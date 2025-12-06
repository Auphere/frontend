import { Message } from "@/types/chat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ChatPlaceCard } from "./ChatPlaceCard";
import { PlanPreview } from "./PlanPreview";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
  onSuggestionClick?: (suggestion: string) => void;
}

export const ChatMessage = ({
  message,
  onSuggestionClick,
}: ChatMessageProps) => {
  if (message.role === "user") {
    return (
      <div className="flex gap-2 sm:gap-3 lg:gap-4 justify-end">
        <div className="max-w-[85%] sm:max-w-2xl">
          <Card className="p-3 sm:p-4 bg-primary text-primary-foreground">
            <p className="text-xs sm:text-sm leading-relaxed">
              {message.content}
            </p>
          </Card>
        </div>
        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] sm:text-xs font-semibold">Tú</span>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex gap-2 sm:gap-3 lg:gap-4 justify-start">
      <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
      </div>

      <div className="max-w-[85%] sm:max-w-3xl flex flex-col gap-3 flex-1 overflow-hidden">
        <Card className="p-3 sm:p-4 bg-card/80 backdrop-blur-sm">
          {message.content && (
            <div className="text-xs sm:text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-headings:my-2 prose-h3:text-base prose-h3:font-bold">
              <ReactMarkdown
                components={{
                  // Remove image rendering from markdown (we show images in cards)
                  img: () => null,
                  // Style links
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  // Style code blocks
                  code: ({ node, className, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code
                        {...props}
                        className="bg-muted px-1 py-0.5 rounded text-xs"
                      />
                    ) : (
                      <code
                        {...props}
                        className="block bg-muted p-2 rounded text-xs overflow-x-auto"
                      />
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Place Recommendations - Horizontal Scroll */}
          {message.places && message.places.length > 0 && (
            <div className="mt-4 -mx-3 sm:-mx-4">
              <div className="overflow-x-auto px-3 sm:px-4 hide-scrollbar">
                <div className="flex gap-3 pb-2">
                  {message.places.slice(0, 5).map((place) => (
                    <div key={place.id || place.place_id} className="flex-shrink-0 w-[280px] sm:w-[320px]">
                      <ChatPlaceCard place={place} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Plan Preview */}
          {message.plan && (
            <div className="mt-4">
              <PlanPreview plan={message.plan} />
            </div>
          )}

        </Card>

        {/* Suggested Follow-ups */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {message.suggestions.map((suggestion, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick?.(suggestion)}
                className="text-[10px] sm:text-xs h-7 px-2 sm:px-3"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
