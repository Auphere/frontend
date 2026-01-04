"use client";

import type { ChatShellProps } from "./chat-shell.interface";

/**
 * ChatShell component - Basic chat UI structure
 * This is a placeholder for @assistant-ui/react integration
 * The actual assistant-ui components will be integrated here later
 */
export function ChatShell({}: ChatShellProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Placeholder message */}
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-gray-100 rounded-lg p-4">
              <p className="text-body text-gray-900">
                ¡Hola! Soy Auphere, tu asistente de salidas nocturnas. ¿En qué
                puedo ayudarte hoy?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
              disabled
            />
            <button
              className="px-6 py-3 bg-purple text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50"
              disabled
            >
              Enviar
            </button>
          </div>
          <p className="text-tiny text-gray-400 mt-2 text-center">
            @assistant-ui/react integration - Coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

