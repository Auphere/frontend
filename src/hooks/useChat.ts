import { useCallback, useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/contexts/AuthContext";

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2, 10)}`;
};

const STREAM_ENDPOINT = `${API_BASE_URL}/chat/stream`;

type ChatStatus = string | null;

interface UseChatResult {
  messages: Message[];
  sendMessage: (content: string, mode?: "explore" | "plan") => void;
  resetConversation: (
    initialMessages: Message[],
    sessionId?: string | null
  ) => void;
  appendMessage: (message: Message) => void;
  status: ChatStatus;
  isStreaming: boolean;
  error: string | null;
  sessionId: string | null;
  setSessionId: (sessionId: string | null) => void;
}

export const useChat = (initialSessionId?: string | null): UseChatResult => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ChatStatus>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionId, setSessionIdState] = useState<string | null>(
    initialSessionId || null
  );
  const sessionIdRef = useRef<string>(initialSessionId || createId());
  const abortControllerRef = useRef<AbortController | null>(null);
  const assistantBufferRef = useRef<string>("");

  // Sync sessionId ref when state changes
  useEffect(() => {
    if (sessionId) {
      sessionIdRef.current = sessionId;
    }
  }, [sessionId]);

  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const setSessionId = useCallback((newSessionId: string | null) => {
    if (newSessionId) {
      setSessionIdState(newSessionId);
      sessionIdRef.current = newSessionId;
    } else {
      const newId = createId();
      setSessionIdState(null);
      sessionIdRef.current = newId;
    }
    // Reset messages when switching chats
    setMessages([]);
    assistantBufferRef.current = "";
    setStatus(null);
    setError(null);
    setIsStreaming(false);
    cancelStream();
  }, [cancelStream]);

  useEffect(() => {
    return () => {
      cancelStream();
    };
  }, [cancelStream]);

  useEffect(() => {
    // Only reset if no initial sessionId provided
    if (!initialSessionId && !sessionId) {
    sessionIdRef.current = createId();
    assistantBufferRef.current = "";
    cancelStream();
    }
  }, [user?.id, cancelStream, initialSessionId, sessionId]);

  const appendAssistant = useCallback((chunk: string) => {
    assistantBufferRef.current += chunk;
    setMessages((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];

      if (!last || last.role !== "assistant") {
        next.push({ role: "assistant", content: chunk });
      } else {
        next[next.length - 1] = {
          ...last,
          content: assistantBufferRef.current,
        };
      }

      return next;
    });
  }, []);

  const resetConversation = useCallback(
    (initialMessages: Message[], newSessionId?: string | null) => {
      cancelStream();
      assistantBufferRef.current = "";

      if (newSessionId) {
        sessionIdRef.current = newSessionId;
        setSessionIdState(newSessionId);
      } else {
        const newId = createId();
        sessionIdRef.current = newId;
        setSessionIdState(null);
      }

      setMessages(initialMessages);
      setStatus(null);
      setError(null);
      setIsStreaming(false);
    },
    [cancelStream]
  );

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const sendMessage = useCallback(
    async (rawContent: string, mode: "explore" | "plan" = "explore") => {
      const content = rawContent.trim();
      if (!content) return;
      if (!user) {
        setError("Debes iniciar sesión para usar el chat.");
        return;
      }
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Tu sesión expiró. Ingresa nuevamente.");
        return;
      }

      // Add user message immediately
      appendMessage({ role: "user", content });
      setError(null);
      setStatus("Conectando...");
      setIsStreaming(true);
      assistantBufferRef.current = "";

      // Cancel any ongoing stream
      cancelStream();

      // Create new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const response = await fetch(STREAM_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: content,
            session_id: sessionIdRef.current,
            mode: mode,
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        // Process SSE stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let currentEvent = "";

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (!line || line.startsWith(":")) {
              continue;
            }

            // Track event type
            if (line.startsWith("event:")) {
              currentEvent = line.slice(6).trim();
              continue;
            }

            // Process data
            if (line.startsWith("data:")) {
              const data = line.slice(5).trim();
              
              if (!data) {
                currentEvent = ""; // Reset event
                continue;
              }

              try {
                const parsed = JSON.parse(data);

                // Handle based on event type
                if (currentEvent === "status") {
                  setStatus(parsed.content || parsed);
                } else if (currentEvent === "token") {
                  appendAssistant(parsed.content || parsed);
                } else if (currentEvent === "end") {
                  setStatus(null);
                  setIsStreaming(false);
                  
                  setMessages((prev) => {
                    const next = [...prev];
                    const last = next[next.length - 1];
                    
                    if (last && last.role === "assistant") {
                      next[next.length - 1] = {
                        ...last,
                        content: parsed.content || assistantBufferRef.current,
                        places: parsed.places || [],
                        plan: parsed.plan,
                      };
                    } else {
                      next.push({
                        role: "assistant",
                        content: parsed.content || assistantBufferRef.current,
                        places: parsed.places || [],
                        plan: parsed.plan,
                      });
                    }
                    
                    return next;
                  });
                  
                  assistantBufferRef.current = "";
                } else if (currentEvent === "error") {
                  setStatus(null);
                  setIsStreaming(false);
                  setError(parsed.content || parsed || "An error occurred");
                } else {
                  // Fallback: infer from content
                  if (parsed.places || parsed.plan || parsed.metadata) {
                    // End event without explicit event type
                    setStatus(null);
                    setIsStreaming(false);
                    
                    setMessages((prev) => {
                      const next = [...prev];
                      const last = next[next.length - 1];
                      
                      if (last && last.role === "assistant") {
                        next[next.length - 1] = {
                          ...last,
                          content: parsed.content || assistantBufferRef.current,
                          places: parsed.places || [],
                          plan: parsed.plan,
                        };
                      } else {
                        next.push({
                          role: "assistant",
                          content: parsed.content || assistantBufferRef.current,
                          places: parsed.places || [],
                          plan: parsed.plan,
                        });
                      }
                      
                      return next;
                    });
                    
                    assistantBufferRef.current = "";
                  } else if (parsed.content) {
                    // Status or token
                    if (assistantBufferRef.current === "") {
                      setStatus(parsed.content);
                    } else {
                      appendAssistant(parsed.content);
                    }
                  }
                }
                
                currentEvent = ""; // Reset after processing
              } catch (e) {
                // Ignore malformed JSON
                console.warn("Failed to parse SSE data:", data, e);
                currentEvent = ""; // Reset on error
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          // Stream was cancelled
          return;
        }
        
        setStatus(null);
        setIsStreaming(false);
        setError(
          err.message || "No pudimos conectar con el asistente."
        );
        console.error("Chat stream error:", err);
      } finally {
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
        }
      }
    },
    [appendAssistant, appendMessage, cancelStream, user]
  );

  return {
    messages,
    sendMessage,
    resetConversation,
    appendMessage,
    status,
    isStreaming,
    error,
    sessionId,
    setSessionId,
  };
};
