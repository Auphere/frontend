"use client";

import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { ToolFallback } from "@/components/assistant-ui/tool-fallback";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ActionBarPrimitive,
  AssistantIf,
  BranchPickerPrimitive,
  ComposerPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useMessage,
} from "@assistant-ui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  DownloadIcon,
  PencilIcon,
  RefreshCwIcon,
  SquareIcon,
  Sparkles,
  ArrowRightIcon,
  Compass,
  CalendarDays,
} from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";
import Image from "next/image";
import type { FC } from "react";
import { PlacesGrid } from "@/components/chat/places-grid";
import { PlanPreviewCard } from "@/components/assistant-ui/plan-preview-card";
import type { Place, Plan } from "@/lib/types";

export const Thread: FC = () => {
  return (
    <TooltipProvider>
      <ThreadPrimitive.Root
        className="aui-root aui-thread-root @container flex h-full flex-col bg-[#F6F5F4]"
        style={{
          ["--thread-max-width" as string]: "48rem",
        }}
      >
        <ThreadPrimitive.Viewport
          turnAnchor="top"
          className="aui-thread-viewport relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth px-4 pt-8"
        >
          <AssistantIf condition={({ thread }) => thread.isEmpty}>
            <ThreadWelcome />
          </AssistantIf>

          <ThreadPrimitive.Messages
            components={{
              UserMessage,
              EditComposer,
              AssistantMessage,
            }}
          />

          <ThreadPrimitive.ViewportFooter className="aui-thread-viewport-footer sticky bottom-0 mx-auto mt-auto flex w-full max-w-(--thread-max-width) flex-col gap-4 overflow-visible rounded-t-3xl bg-[#F6F5F4] pb-4 md:pb-6">
            <ThreadScrollToBottom />
            <Composer />
          </ThreadPrimitive.ViewportFooter>
        </ThreadPrimitive.Viewport>
      </ThreadPrimitive.Root>
    </TooltipProvider>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="aui-thread-scroll-to-bottom absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible dark:bg-background dark:hover:bg-accent"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <div className="aui-thread-welcome-root mx-auto my-auto flex w-full max-w-(--thread-max-width) grow flex-col">
      <div className="aui-thread-welcome-center flex w-full grow flex-col items-center justify-center">
        <div className="aui-thread-welcome-message flex size-full flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary p-4">
            <Image
              src="/assets/icono-auphere.png"
              alt="Auphere"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>
          <h1 className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in font-bold text-3xl text-gray-900 duration-200">
            ¡Hola! Soy Auphere
          </h1>
          <p className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in mt-3 text-gray-600 text-lg delay-75 duration-200">
            Tu asistente inteligente para descubrir lugares increíbles y
            planificar tus salidas nocturnas perfectas.
          </p>
        </div>
      </div>
      <ThreadSuggestions />
    </div>
  );
};

const SUGGESTIONS = [
  {
    title: "Recomiéndame bares",
    label: "en el Casco Viejo",
    prompt: "Recomiéndame bares en el Casco Viejo",
  },
  {
    title: "Crea un plan",
    label: "para esta noche",
    prompt: "Crea un plan para esta noche",
  },
  {
    title: "Restaurantes románticos",
    label: "en Zaragoza",
    prompt: "Restaurantes románticos en Zaragoza",
  },
  {
    title: "Clubs de música",
    label: "electrónica",
    prompt: "Clubs de música electrónica",
  },
] as const;

const ThreadSuggestions: FC = () => {
  return (
    <div className="aui-thread-welcome-suggestions grid w-full gap-3 px-4 pb-4 sm:grid-cols-2">
      {SUGGESTIONS.map((suggestion, index) => (
        <div
          key={suggestion.prompt}
          className="aui-thread-welcome-suggestion-display fade-in slide-in-from-bottom-2 animate-in fill-mode-both duration-200"
          style={{ animationDelay: `${100 + index * 50}ms` }}
        >
          <ThreadPrimitive.Suggestion prompt={suggestion.prompt} send asChild>
            <Button
              variant="ghost"
              className="aui-thread-welcome-suggestion h-auto w-full flex-col items-start justify-start gap-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm transition-all hover:border-purple hover:bg-purple/5"
              aria-label={suggestion.prompt}
            >
              <div className="flex w-full items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-purple" />
                <span className="aui-thread-welcome-suggestion-text-1 flex-1 font-medium text-gray-900">
                  {suggestion.title}
                </span>
              </div>
              <span className="aui-thread-welcome-suggestion-text-2 text-gray-600 text-xs">
                {suggestion.label}
              </span>
            </Button>
          </ThreadPrimitive.Suggestion>
        </div>
      ))}
    </div>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">
      <div className="group relative rounded-2xl border border-gray-300 bg-[#F6F5F4] transition-all focus-within:border-transparent">
        <div className="absolute -inset-[3px] rounded-2xl opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 pointer-events-none -z-10">
          <div className="h-full w-full rounded-2xl gradient-auphere" />
        </div>
        <div className="relative aui-composer-wrapper flex w-full flex-col rounded-2xl bg-[#F6F5F4] px-1 pt-2 shadow-sm">
          <ComposerPrimitive.Input
            placeholder="Escribe tu mensaje..."
            className="aui-composer-input mb-1 max-h-40 min-h-[56px] w-full resize-none bg-transparent px-4 pt-2 pb-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus-visible:ring-0"
            rows={1}
            autoFocus
            aria-label="Message input"
          />
          <ComposerAction />
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-gray-500">
        Auphere puede cometer errores. Considera verificar información
        importante.
      </p>
    </ComposerPrimitive.Root>
  );
};

const ComposerAction: FC = () => {
  const { chatMode, setChatMode } = useUIStore();
  const isExploreMode = chatMode === "explore";

  const toggleMode = () => {
    setChatMode(isExploreMode ? "plan" : "explore");
  };

  return (
    <div className="aui-composer-action-wrapper relative mx-2 mb-2 flex items-center justify-between">
      {/* Mode Toggle Badge */}
      <button
        type="button"
        onClick={toggleMode}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
          "border shadow-sm hover:shadow-md active:scale-95",
          isExploreMode
            ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
        )}
        aria-label={`Modo actual: ${isExploreMode ? "Explorar" : "Plan"}. Click para cambiar.`}
      >
        {isExploreMode ? (
          <>
            <Compass className="h-3.5 w-3.5" />
            <span>Explorar</span>
          </>
        ) : (
          <>
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Plan</span>
          </>
        )}
      </button>

      {/* Send/Cancel Buttons */}
      <div className="flex items-center gap-2">
        <AssistantIf condition={({ thread }) => !thread.isRunning}>
          <ComposerPrimitive.Send asChild>
            <Button
              type="submit"
              variant="default"
              size="icon"
              className="aui-composer-send h-8 w-8 shrink-0 rounded-lg bg-purple hover:bg-purple/90"
              aria-label="Enviar mensaje"
            >
              <ArrowRightIcon className="aui-composer-send-icon h-4 w-4 text-gray-900" />
            </Button>
          </ComposerPrimitive.Send>
        </AssistantIf>

        <AssistantIf condition={({ thread }) => thread.isRunning}>
          <ComposerPrimitive.Cancel asChild>
            <Button
              type="button"
              variant="default"
              size="icon"
              className="aui-composer-cancel h-8 w-8 shrink-0 rounded-lg bg-gray-600 hover:bg-gray-700"
              aria-label="Detener generación"
            >
              <SquareIcon className="aui-composer-cancel-icon h-3 w-3 fill-current" />
            </Button>
          </ComposerPrimitive.Cancel>
        </AssistantIf>
      </div>
    </div>
  );
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="aui-message-error-root mt-3 rounded-lg border border-red bg-red/10 p-3 text-red text-sm">
        <ErrorPrimitive.Message className="aui-message-error-message line-clamp-3" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

// Componente personalizado para renderizar texto con places
const AssistantMessageText: FC = () => {
  const metadata = useMessage((m) => (m as any).metadata);
  const isStatusMessage = metadata?.custom?.isStatusMessage ?? false;

  // Siempre llamar a useMessage, no condicionalmente
  const message = useMessage(
    (m) => m.content.find((c) => c.type === "text")?.text || ""
  );

  if (isStatusMessage) {
    // Renderizar mensaje de estado con shimmer
    return <div className="text-xs text-gray-600 shimmer">{message}</div>;
  }

  return (
    <div className="aui-text">
      <MarkdownText />
    </div>
  );
};

const AssistantMessage: FC = () => {
  const metadata = useMessage((m) => (m as any).metadata);
  const places = metadata?.custom?.places ?? [];
  const plan = metadata?.custom?.plan as Plan | null;

  return (
    <MessagePrimitive.Root
      className="aui-assistant-message-root fade-in slide-in-from-bottom-1 relative mx-auto w-full max-w-(--thread-max-width) animate-in py-4 duration-150"
      data-role="assistant"
    >
      <div className="aui-assistant-message-content-wrapper flex gap-4 px-2">
        <div className="md:flex hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary">
          <Image
            src="/assets/icono-auphere.png"
            alt="Auphere"
            width={20}
            height={20}
            className="rounded"
          />
        </div>
        <div className="aui-assistant-message-content wrap-break-word flex-1 text-gray-900 leading-relaxed">
          <MessagePrimitive.Parts
            components={{
              Text: AssistantMessageText,
              tools: { Fallback: ToolFallback },
            }}
          />
          <MessageError />

          {/* Renderizar plan preview desde metadata */}
          {plan && (
            (plan.stops && plan.stops.length > 0) || 
            ((plan as any).stopsDetailed && (plan as any).stopsDetailed.length > 0)
          ) && (
            <PlanPreviewCard plan={plan} />
          )}

          {/* Renderizar places desde metadata */}
          {places.length > 0 && (
            <div className="mt-4">
              <PlacesGrid places={places} />
            </div>
          )}
        </div>
      </div>

      <div className="aui-assistant-message-footer mt-2 ml-12 flex">
        <BranchPicker />
        <AssistantActionBar />
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="aui-assistant-action-bar-root col-start-3 row-start-2 -ml-1 flex gap-1 text-gray-500 data-floating:absolute data-floating:rounded-lg data-floating:border data-floating:border-gray-200 data-floating:bg-white data-floating:p-1 data-floating:shadow-md"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copiar">
          <AssistantIf condition={({ message }) => message.isCopied}>
            <CheckIcon />
          </AssistantIf>
          <AssistantIf condition={({ message }) => !message.isCopied}>
            <CopyIcon />
          </AssistantIf>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Regenerar">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      className="aui-user-message-root fade-in slide-in-from-bottom-1 mx-auto grid w-full max-w-(--thread-max-width) animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 py-3 duration-150 [&:where(>*)]:col-start-2"
      data-role="user"
    >
      <div className="aui-user-message-content-wrapper relative col-start-2 min-w-0">
        <div className="aui-user-message-content wrap-break-word rounded-2xl bg-white border border-gray-200 px-4 py-2.5 text-gray-900">
          <MessagePrimitive.Parts />
        </div>
        <div className="aui-user-action-bar-wrapper absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2">
          <UserActionBar />
        </div>
      </div>

      <BranchPicker className="aui-user-branch-picker col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="aui-user-action-bar-root flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit" className="aui-user-action-edit p-4">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <MessagePrimitive.Root className="aui-edit-composer-wrapper mx-auto flex w-full max-w-(--thread-max-width) flex-col px-2 py-3">
      <ComposerPrimitive.Root className="aui-edit-composer-root ml-auto flex w-full max-w-[85%] flex-col rounded-2xl bg-muted">
        <ComposerPrimitive.Input
          className="aui-edit-composer-input min-h-14 w-full resize-none bg-transparent p-4 text-foreground text-sm outline-none"
          autoFocus
        />
        <div className="aui-edit-composer-footer mx-3 mb-3 flex items-center gap-2 self-end">
          <ComposerPrimitive.Cancel asChild>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </ComposerPrimitive.Cancel>
          <ComposerPrimitive.Send asChild>
            <Button size="sm">Update</Button>
          </ComposerPrimitive.Send>
        </div>
      </ComposerPrimitive.Root>
    </MessagePrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "aui-branch-picker-root mr-2 -ml-2 inline-flex items-center text-muted-foreground text-xs",
        className
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="aui-branch-picker-state font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};
