"use client";

import {
  AssistantIf,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowDown, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const SUGGESTED_PROMPTS = [
  "Recomiéndame bares en el Casco Viejo",
  "Crea un plan para esta noche",
  "Restaurantes románticos en Zaragoza",
  "Clubs de música electrónica",
];

export function ChatThread() {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-col bg-[#F6F5F4]">
      <ThreadPrimitive.Viewport className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <ThreadPrimitive.Empty>
          <div className="flex flex-1 items-center justify-center p-6">
            <WelcomeScreen />
          </div>
        </ThreadPrimitive.Empty>

        <ThreadPrimitive.Messages
          components={{
            UserMessage: ChatUserMessage,
            AssistantMessage: ChatAssistantMessage,
          }}
        />

        <AssistantIf condition={({ thread }) => !thread.isEmpty}>
          <div className="min-h-8 grow" />
        </AssistantIf>

        <ThreadPrimitive.ScrollToBottom asChild>
          <Button
            size="icon"
            variant="outline"
            className="mx-auto mb-4 h-10 w-10 rounded-full border-gray-300 bg-white shadow-md hover:bg-gray-50"
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        </ThreadPrimitive.ScrollToBottom>
      </ThreadPrimitive.Viewport>

      <div className="border-t border-gray-200 bg-white p-4">
        <div className="mx-auto max-w-3xl">
          <ComposerPrimitive.Root className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm focus-within:border-purple focus-within:ring-2 focus-within:ring-purple/20">
            <ComposerPrimitive.Input
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 focus:outline-none"
            />
            <ComposerPrimitive.Send asChild>
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 rounded-lg bg-purple hover:bg-purple/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </ComposerPrimitive.Send>
          </ComposerPrimitive.Root>

          <p className="mt-2 text-center text-xs text-gray-500">
            Auphere puede cometer errores. Considera verificar información
            importante.
          </p>
        </div>
      </div>
    </ThreadPrimitive.Root>
  );
}

// Welcome Screen Component
function WelcomeScreen() {
  return (
    <div className="text-center max-w-2xl">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary">
        <Image
          src="/assets/icono-auphere.png"
          alt="Auphere"
          width={40}
          height={40}
          className="rounded-lg"
        />
      </div>
      <h1 className="mb-3 text-3xl font-bold text-gray-900">
        ¡Hola! Soy Auphere
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        Tu asistente inteligente para descubrir lugares increíbles y planificar
        tus salidas nocturnas perfectas.
      </p>

      {/* Suggested prompts */}
      <div className="grid gap-3 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <ThreadPrimitive.Suggestion
            key={prompt}
            prompt={prompt}
            send
            asChild
          >
            <SuggestedPrompt icon={<Sparkles className="h-5 w-5" />} text={prompt} />
          </ThreadPrimitive.Suggestion>
        ))}
      </div>
    </div>
  );
}

// User Message Component
function ChatUserMessage() {
  return (
    <MessagePrimitive.Root className="group w-full border-b border-gray-100 bg-white py-6">
      <div className="mx-auto flex max-w-3xl gap-4 px-4">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-gray-900 text-xs font-semibold text-white">
            U
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="prose prose-sm max-w-none text-gray-900">
            <MessagePrimitive.Parts />
          </div>
        </div>
      </div>
    </MessagePrimitive.Root>
  );
}

// Assistant Message Component
function ChatAssistantMessage() {
  return (
    <MessagePrimitive.Root className="group w-full border-b border-gray-100 bg-[#F6F5F4] py-6">
      <div className="mx-auto flex max-w-3xl gap-4 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary">
          <Image
            src="/assets/icono-auphere.png"
            alt="Auphere"
            width={20}
            height={20}
            className="rounded"
          />
        </div>
        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="prose prose-sm max-w-none text-gray-900">
            <MessagePrimitive.Parts />
          </div>
        </div>
      </div>
    </MessagePrimitive.Root>
  );
}

// Suggested Prompt Component
function SuggestedPrompt({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-purple hover:bg-purple/5",
        "text-sm text-gray-700 hover:text-gray-900"
      )}
      type="button"
    >
      <div className="text-purple">{icon}</div>
      <span className="flex-1">{text}</span>
    </button>
  );
}

