import React, { createContext, useContext, useState, ReactNode } from "react";
import { Place, EveningPlan } from "@/types/place";

interface PlanContextState {
  currentPlan: EveningPlan | null;
  planPlaces: Place[];
  addPlaceToPlan: (place: Place) => void;
  removePlaceFromPlan: (placeId: string) => void;
  clearPlan: () => void;
  savePlan: (plan: EveningPlan) => void;
}

const PlanContext = createContext<PlanContextState | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [currentPlan, setCurrentPlan] = useState<EveningPlan | null>(null);
  const [planPlaces, setPlanPlaces] = useState<Place[]>([]);

  const addPlaceToPlan = (place: Place) => {
    setPlanPlaces((prev) => {
      if (prev.find((p) => p.id === place.id)) return prev;
      return [...prev, place];
    });
  };

  const removePlaceFromPlan = (placeId: string) => {
    setPlanPlaces((prev) => prev.filter((p) => p.id !== placeId));
  };

  const clearPlan = () => {
    setPlanPlaces([]);
    setCurrentPlan(null);
  };

  const savePlan = (plan: EveningPlan) => {
    setCurrentPlan(plan);
    // In a real app, this would save to backend/localStorage
    console.log("Plan saved:", plan);
  };

  return (
    <PlanContext.Provider
      value={{
        currentPlan,
        planPlaces,
        addPlaceToPlan,
        removePlaceFromPlan,
        clearPlan,
        savePlan,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within PlanProvider");
  }
  return context;
};
