"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useLocalRuntime,
  type ChatModelAdapter,
  type ChatModelRunOptions,
  type ChatModelRunResult,
} from "@assistant-ui/react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useMemo, useEffect } from "react";
import type { ChatHistoryResponse } from "@/api-queries/types/chats.types";

interface ChatRuntimeProviderProps {
  children: ReactNode;
  sessionId?: string | null;
  initialHistory?: ChatHistoryResponse | null;
}

const DEFAULT_BACKEND_BASE =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE || "http://localhost:8000";
const DEFAULT_USER_ID =
  process.env.NEXT_PUBLIC_AGENT_USER_ID || "demo-user-auphere";

export function ChatRuntimeProvider({ 
  children, 
  sessionId: externalSessionId,
  initialHistory 
}: ChatRuntimeProviderProps) {
  const { user, getAccessToken, isAuthenticated } = useAuth();

  // Set session ID when component mounts or when external sessionId changes
  useEffect(() => {
    if (externalSessionId) {
      // We have a session ID from URL, use it
      setSessionId(externalSessionId);
    } else {
      // No session ID in URL, clear localStorage to start fresh
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("auphere-agent-session-id");
      }
      // Reset cached session ID
      cachedSessionId = null;
    }
  }, [externalSessionId]);

  // Create a memoized adapter with auth context
  const agentModelAdapter: ChatModelAdapter = useMemo(
    () => ({
      async *run(options: ChatModelRunOptions) {
        yield* runAgentWithAuth(
          options,
          user?.sub,
          getAccessToken,
          isAuthenticated
        );
      },
    }),
    [user?.sub, getAccessToken, isAuthenticated]
  );

  const runtime = useLocalRuntime(agentModelAdapter, {
    initialMessages: initialHistory?.messages?.map((msg, index) => ({
      id: `${initialHistory.chat_id}-msg-${index}`,
      role: msg.role,
      content: [{ type: "text" as const, text: msg.content }],
      createdAt: new Date(),
      metadata: {
        custom: {
          places: msg.places ?? [],
          plan: msg.plan ?? null,
        },
      },
    })) || [],
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
async function* runAgentWithAuth(
  { messages, abortSignal }: ChatModelRunOptions,
  userId: string | undefined,
  getAccessToken: () => Promise<string | null>,
  isAuthenticated: boolean
): AsyncGenerator<ChatModelRunResult> {
  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === "user");

  const userText =
    lastUserMessage?.content
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n")
      .trim() ?? "";

  if (!userText) {
    yield {
      content: [{ type: "text", text: "¿Qué te gustaría planear hoy?" }],
    };
    return;
  }

  const sessionId = getSessionId();

  // Use Auth0 user ID if authenticated, otherwise use default
  const effectiveUserId = userId || DEFAULT_USER_ID;

  // Backend expects: { message, session_id, mode, user_id }
  const payload = {
    message: userText,
    session_id: sessionId,
    mode: "explore",
    // Note: user_id will be set by backend from Auth0 token
  };

  // Get Auth0 token if authenticated
  const accessToken = isAuthenticated ? await getAccessToken() : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add Authorization header if token is available
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(
    `${DEFAULT_BACKEND_BASE.replace(/\/$/, "")}/api/v1/chat/stream`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: abortSignal,
    }
  );

  if (!response.ok || !response.body) {
    const errorText = await safeReadError(response);
    throw new Error(
      `Agent request failed (${response.status}): ${
        errorText || "unknown error"
      }`
    );
  }

  let accumulated = "";
  let lastStatus = ""; // Para mostrar el último estado mientras no hay respuesta

  for await (const event of readSSE(response.body, abortSignal)) {
    if (event.type === "error") {
      throw new Error(event.data?.content || "Error del agente");
    }

    // Eventos de status: mostrar mientras el agente piensa
    if (event.type === "status" && event.data?.content) {
      // Limpiar emojis y texto sin formato especial
      const statusText = event.data.content
        .replace(/🔍/g, "")
        .replace(/🧠/g, "")
        .replace(/🎯/g, "")
        .replace(/🤖/g, "")
        .replace(/⭐/g, "")
        .replace(/✍️/g, "")
        .replace(/💾/g, "")
        .trim();

      lastStatus = statusText;

      // Si aún no hay contenido real, mostrar el status con shimmer
      if (!accumulated && statusText) {
        yield {
          content: [
            {
              type: "text" as const,
              text: statusText,
            },
          ],
          metadata: {
            custom: {
              isStatusMessage: true,
            },
          },
        };
      }
    }

    // Eventos thought: información del proceso de pensamiento
    if (event.type === "thought" && event.data?.content) {
      const thoughtText = event.data.content.trim();

      lastStatus = thoughtText;

      // Si aún no hay contenido real, mostrar el thought con shimmer
      if (!accumulated && thoughtText) {
        yield {
          content: [
            {
              type: "text" as const,
              text: thoughtText,
            },
          ],
          metadata: {
            custom: {
              isStatusMessage: true,
            },
          },
        };
      }
    }

    // Eventos action: acciones ejecutadas
    if (event.type === "action" && event.data?.content) {
      const actionText = event.data.content.trim();
      lastStatus = actionText;

      // Si aún no hay contenido real, mostrar la acción con shimmer
      if (!accumulated && actionText) {
        yield {
          content: [
            {
              type: "text" as const,
              text: actionText,
            },
          ],
          metadata: {
            custom: {
              isStatusMessage: true,
            },
          },
        };
      }
    }

    // Tokens de texto: respuesta real del agente
    if (event.type === "token" && event.data?.content) {
      accumulated += event.data.content;
      // Una vez que empieza el contenido real, solo mostrar eso
      yield { content: [{ type: "text" as const, text: accumulated }] };
    }

    // Evento final con contenido completo y datos estructurados
    if (event.type === "end") {
      const text = event.data?.content || accumulated;
      const places = event.data?.places ?? [];

      console.log("SSE END event data:", event.data);
      console.log("Extracted places:", places);

      // Enviar con metadata en custom (así lo lee assistant-ui)
      yield {
        content: [{ type: "text" as const, text }],
        metadata: { 
          custom: { 
            places,
            plan: event.data?.plan ?? null 
          } 
        },
      };
      return;
    }
  }

  // Si no hubo evento "end", devolver lo acumulado
  if (accumulated) {
    yield {
      content: [{ type: "text" as const, text: accumulated }],
    };
  } else if (lastStatus) {
    // Si solo hubo status pero no respuesta, mostrar el último status
    yield {
      content: [{ type: "text" as const, text: `*${lastStatus}*` }],
    };
  } else {
    yield {
      content: [
        { type: "text" as const, text: "No recibí respuesta del agente." },
      ],
    };
  }
}

type SSEEvent = {
  type: "status" | "thought" | "action" | "token" | "end" | "error" | string;
  data: any;
};

async function* readSSE(
  stream: ReadableStream<Uint8Array>,
  abortSignal?: AbortSignal
): AsyncGenerator<SSEEvent> {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      const lines = part.split("\n");
      let eventType = "message";
      let dataStr = "";

      for (const line of lines) {
        if (line.startsWith("event:")) {
          eventType = line.replace("event:", "").trim();
        } else if (line.startsWith("data:")) {
          dataStr += line.replace("data:", "").trim();
        }
      }

      if (!dataStr) continue;

      try {
        const parsed = JSON.parse(dataStr);
        yield { type: eventType, data: parsed };
      } catch {
        // ignore malformed
      }

      if (abortSignal?.aborted) return;
    }
  }
}

async function safeReadError(response: Response) {
  try {
    const text = await response.text();
    return text.slice(0, 500);
  } catch {
    return null;
  }
}

let cachedSessionId: string | null = null;
function getSessionId() {
  if (cachedSessionId) return cachedSessionId;
  const fromStorage =
    typeof window !== "undefined"
      ? window.localStorage.getItem("auphere-agent-session-id")
      : null;
  if (fromStorage) {
    cachedSessionId = fromStorage;
    return cachedSessionId;
  }
  cachedSessionId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `session-${Date.now()}`;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("auphere-agent-session-id", cachedSessionId);
  }
  return cachedSessionId;
}

function setSessionId(sessionId: string) {
  cachedSessionId = sessionId;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("auphere-agent-session-id", sessionId);
  }
}
