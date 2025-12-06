import { ChatMode } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Search, Calendar } from "lucide-react";

interface ModeSelectorProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="flex gap-2 p-1 bg-muted/50 rounded-lg w-fit mx-auto">
      <Button
        variant={mode === "explore" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("explore")}
        className="gap-2 h-9 text-xs sm:text-sm"
      >
        <Search className="w-4 h-4" />
        Buscar Lugares
      </Button>
      <Button
        variant={mode === "plan" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("plan")}
        className="gap-2 h-9 text-xs sm:text-sm"
      >
        <Calendar className="w-4 h-4" />
        Crear Plan
      </Button>
    </div>
  );
};
