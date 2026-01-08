"use client";

import type { Plan, PlanStop } from "@/lib/types";
import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Euro,
  Users,
  Lightbulb,
  Phone,
  ExternalLink,
  Navigation,
  Trash2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdatePlanMutation } from "@/api-queries/queries/plans";
import { useAuth } from "@/lib/hooks/use-auth";

export interface PlanPreviewProps {
  plan: Plan;
  onViewDetails?: () => void;
}

export function PlanPreview({ plan, onViewDetails }: PlanPreviewProps) {
  const totalStops = plan.stops?.length || 0;
  const totalDuration = plan.summary?.total_duration || "~3h";
  const budgetPerPerson = plan.summary?.budget?.per_person;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-purple hover:shadow-md">
      {/* Header */}
      <div className="mb-4">
        <h3 className="mb-2 text-xl font-bold text-gray-900">{plan.title}</h3>
        {plan.description && (
          <p className="line-clamp-2 text-gray-600">{plan.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{totalStops} paradas</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{totalDuration}</span>
        </div>
        {budgetPerPerson && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Euro className="h-4 w-4" />
            <span>~{budgetPerPerson}€/persona</span>
          </div>
        )}
      </div>

      {/* Timeline preview - First 3 stops */}
      <div className="mb-4 space-y-2">
        {plan.stops?.slice(0, 3).map((stop, idx) => (
          <div
            key={`stop-${stop.local_id}-${idx}`}
            className="flex items-center gap-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple/10 text-xs font-semibold text-purple">
              {idx + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-medium text-gray-900">
                {stop.name}
              </p>
              {stop.timing?.recommended_start && (
                <p className="text-xs text-gray-500">
                  {stop.timing.recommended_start}
                </p>
              )}
            </div>
          </div>
        ))}
        {totalStops > 3 && (
          <p className="text-center text-sm text-gray-500">
            +{totalStops - 3} más...
          </p>
        )}
      </div>

      {/* View button */}
      {onViewDetails && (
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={onViewDetails}
        >
          Ver plan completo
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export interface PlanTimelineProps {
  plan: Plan;
}

// Get category icon
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    restaurant: "🍽️",
    bar: "🍸",
    club: "🎵",
    cafe: "☕",
    activity: "🎯",
    hotel: "🏨",
    cruise: "🚢",
  };
  return icons[category?.toLowerCase()] || "📍";
}

// Get travel mode icon
function getTravelModeIcon(mode?: string): string {
  const icons: Record<string, string> = {
    walk: "🚶",
    car: "🚗",
    public: "🚌",
    taxi: "🚕",
  };
  return icons[mode || "walk"] || "🚶";
}

export function PlanTimeline({ plan }: PlanTimelineProps) {
  if (!plan.stops || plan.stops.length === 0) {
    return (
      <div className="rounded-lg bg-gray-100 p-6 text-center">
        <p className="text-gray-600">No hay paradas en este plan</p>
      </div>
    );
  }

  const { getAccessToken } = useAuth();
  const updatePlan = useUpdatePlanMutation();
  const [isReplaceDialogOpen, setIsReplaceDialogOpen] = useState(false);
  const [targetStopNumber, setTargetStopNumber] = useState<number | null>(null);
  const [replaceInstruction, setReplaceInstruction] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addInstruction, setAddInstruction] = useState("");
  const [addQuery, setAddQuery] = useState("");
  const [addAfterStopNumber, setAddAfterStopNumber] = useState<number | null>(null);

  const [isTimingDialogOpen, setIsTimingDialogOpen] = useState(false);
  const [timingStopNumber, setTimingStopNumber] = useState<number | null>(null);
  const [timingStart, setTimingStart] = useState("");
  const [timingDuration, setTimingDuration] = useState<number>(60);

  const isMutating = updatePlan.isPending;

  async function runAiEdit(aiEdit: Record<string, unknown>) {
    const token = await getAccessToken();
    if (!token) throw new Error("Not authenticated");
    return updatePlan.mutateAsync({
      planId: plan.id,
      token,
      updates: { ai_edit: aiEdit as any },
    });
  }

  async function handleRemoveStop(stopNumber: number) {
    const ok = window.confirm(`¿Eliminar la parada #${stopNumber}?`);
    if (!ok) return;
    await runAiEdit({
      operation: "remove_stop",
      instruction: `Eliminar la parada #${stopNumber}`,
      stop_number: stopNumber,
      constraints: {},
      language: "es",
    });
  }

  function openReplace(stopNumber: number) {
    setTargetStopNumber(stopNumber);
    setReplaceInstruction("");
    setReplaceQuery("");
    setIsReplaceDialogOpen(true);
  }

  async function submitReplace() {
    if (!targetStopNumber) return;
    const query = replaceQuery.trim();
    const instruction = replaceInstruction.trim() || "Reemplazar por una mejor opción";

    await runAiEdit({
      operation: "replace_stop",
      instruction,
      stop_number: targetStopNumber,
      constraints: query ? { query } : {},
      language: "es",
    });

    setIsReplaceDialogOpen(false);
    setTargetStopNumber(null);
  }

  function openAdd(afterStopNumber?: number) {
    setAddAfterStopNumber(afterStopNumber ?? null);
    setAddInstruction("");
    setAddQuery("");
    setIsAddDialogOpen(true);
  }

  async function submitAdd() {
    const query = addQuery.trim();
    const instruction = addInstruction.trim() || `Agregar una parada nueva`;
    await runAiEdit({
      operation: "add_stop",
      instruction,
      stop_number: addAfterStopNumber ?? undefined,
      constraints: query ? { query } : {},
      language: "es",
    });
    setIsAddDialogOpen(false);
    setAddAfterStopNumber(null);
  }

  function openTiming(stopNumber: number, stop: PlanStop) {
    setTimingStopNumber(stopNumber);
    setTimingStart(stop.timing?.recommended_start || "");
    setTimingDuration(stop.timing?.suggested_duration_minutes || 60);
    setIsTimingDialogOpen(true);
  }

  async function submitTiming() {
    if (!timingStopNumber) return;
    await runAiEdit({
      operation: "update_timing",
      instruction: `Actualizar horario de la parada #${timingStopNumber}`,
      stop_number: timingStopNumber,
      constraints: {
        start_time: timingStart || undefined,
        duration_minutes: timingDuration,
      },
      language: "es",
    });
    setIsTimingDialogOpen(false);
    setTimingStopNumber(null);
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Plan summary header */}
      {plan.execution && (
        <div className="rounded-lg bg-purple-50 p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {plan.execution.date && (
              <div className="flex items-center gap-2 text-purple-700">
                <Calendar className="h-4 w-4" />
                <span>{plan.execution.date}</span>
              </div>
            )}
            {plan.execution.start_time && (
              <div className="flex items-center gap-2 text-purple-700">
                <Clock className="h-4 w-4" />
                <span>Inicio: {plan.execution.start_time}</span>
              </div>
            )}
            {plan.execution.group_size && (
              <div className="flex items-center gap-2 text-purple-700">
                <Users className="h-4 w-4" />
                <span>{plan.execution.group_size} personas</span>
              </div>
            )}
            {plan.execution.city && (
              <div className="flex items-center gap-2 text-purple-700">
                <MapPin className="h-4 w-4" />
                <span>{plan.execution.city}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        <div className="mb-3 flex items-center justify-end">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => openAdd(undefined)}
            disabled={isMutating}
          >
            <Plus className="h-4 w-4" />
            Agregar parada
          </Button>
        </div>
        {plan.stops.map((stop, index) => (
          <TimelineStop
            key={`stop-${stop.local_id}-${index}`}
            stop={stop}
            index={index}
            isLast={index === plan.stops.length - 1}
            onRemove={() => handleRemoveStop(index + 1)}
            onReplace={() => openReplace(index + 1)}
            onTiming={() => openTiming(index + 1, stop)}
            onAddAfter={() => openAdd(index + 1)}
            isEditingDisabled={isMutating}
          />
        ))}
      </div>

      {/* Final recommendations */}
      {plan.final_recommendations && plan.final_recommendations.length > 0 && (
        <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-purple-900">
            <Lightbulb className="h-5 w-5" />
            Recomendaciones finales
          </h4>
          <ul className="space-y-2">
            {plan.final_recommendations.map((rec, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-purple-800"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Replace Stop Dialog */}
      <Dialog open={isReplaceDialogOpen} onOpenChange={setIsReplaceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reemplazar parada</DialogTitle>
            <DialogDescription>
              Indica qué quieres en su lugar (ej. “más barato y con terraza”, “un bar de cócteles tranquilo”).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-900">Instrucción</label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:border-purple"
                rows={3}
                value={replaceInstruction}
                onChange={(e) => setReplaceInstruction(e.target.value)}
                placeholder="Ej: Cambia esta parada por algo más barato y tranquilo, cerca de la zona."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Query (opcional)</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:border-purple"
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                placeholder="Ej: cafe, bar, tapas, brunch..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplaceDialogOpen(false)} disabled={isMutating}>
              Cancelar
            </Button>
            <Button onClick={submitReplace} disabled={isMutating}>
              {isMutating ? "Recalculando..." : "Reemplazar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Stop Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar parada</DialogTitle>
            <DialogDescription>
              Indica qué quieres agregar (ej. “bar de cócteles”, “cafetería tranquila”, “tapas”).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-900">Instrucción</label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:border-purple"
                rows={3}
                value={addInstruction}
                onChange={(e) => setAddInstruction(e.target.value)}
                placeholder="Ej: Agrega una parada para tomar algo tranquilo cerca."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Query (opcional)</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:border-purple"
                value={addQuery}
                onChange={(e) => setAddQuery(e.target.value)}
                placeholder="Ej: bar, cafe, tapas..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isMutating}>
              Cancelar
            </Button>
            <Button onClick={submitAdd} disabled={isMutating}>
              {isMutating ? "Recalculando..." : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Timing Dialog */}
      <Dialog open={isTimingDialogOpen} onOpenChange={setIsTimingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar horario</DialogTitle>
            <DialogDescription>
              Ajusta la hora recomendada y la duración estimada para esta parada.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-900">Hora (HH:MM)</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:border-purple"
                value={timingStart}
                onChange={(e) => setTimingStart(e.target.value)}
                placeholder="20:00"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Duración (min)</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:border-purple"
                type="number"
                min={15}
                step={5}
                value={timingDuration}
                onChange={(e) => setTimingDuration(Number(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTimingDialogOpen(false)} disabled={isMutating}>
              Cancelar
            </Button>
            <Button onClick={submitTiming} disabled={isMutating}>
              {isMutating ? "Actualizando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface TimelineStopProps {
  stop: PlanStop;
  index: number;
  isLast: boolean;
  onRemove: () => void;
  onReplace: () => void;
  onTiming: () => void;
  onAddAfter: () => void;
  isEditingDisabled: boolean;
}

function TimelineStop({
  stop,
  index,
  isLast,
  onRemove,
  onReplace,
  onTiming,
  onAddAfter,
  isEditingDisabled,
}: TimelineStopProps) {
  return (
    <div className="relative">
      {/* Vertical connector line */}
      {!isLast && (
        <div className="absolute left-5 top-12 h-full w-0.5 bg-gray-200" />
      )}

      <div className="flex gap-4">
        {/* Category icon circle */}
        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple text-lg shadow-md">
          {getCategoryIcon(stop.category)}
        </div>

        {/* Content card */}
        <div className="mb-6 flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-4">
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple">
                    {index + 1}
                  </span>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {stop.name}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {stop.type_label || stop.category}
                </p>
              </div>
              {stop.timing?.recommended_start && (
                <span className="shrink-0 rounded-lg bg-purple-50 px-2.5 py-1 text-sm font-medium text-purple">
                  {stop.timing.recommended_start}
                </span>
              )}
            </div>

            {/* Time and cost info */}
            <div className="mb-3 flex flex-wrap gap-3 text-sm text-gray-600">
              {stop.timing?.suggested_duration_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {stop.timing.suggested_duration_minutes} min
                </span>
              )}
              {stop.details?.average_spend_per_person && (
                <span className="flex items-center gap-1">
                  <Euro className="h-4 w-4 text-gray-400" />~
                  {stop.details.average_spend_per_person}€/persona
                </span>
              )}
              {stop.details?.noise_level && (
                <span className="text-gray-500">
                  Ruido: {stop.details.noise_level}
                </span>
              )}
            </div>

            {/* Location */}
            {stop.location?.address && (
              <div className="mb-3 flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span>{stop.location.address}</span>
              </div>
            )}

            {/* Vibes */}
            {stop.details?.vibes && stop.details.vibes.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {stop.details.vibes.map((vibe) => (
                  <span
                    key={vibe}
                    className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
                  >
                    {vibe}
                  </span>
                ))}
              </div>
            )}

            {/* Selection reasons */}
            {stop.selection_reasons && stop.selection_reasons.length > 0 && (
              <div className="mb-3 rounded-md bg-gray-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Por qué este lugar
                </p>
                <ul className="space-y-1">
                  {stop.selection_reasons.map((reason, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Personal tips */}
            {stop.personal_tips && stop.personal_tips.length > 0 && (
              <div className="mb-3 rounded-md bg-yellow-50 p-3">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-yellow-800">
                  <Lightbulb className="h-4 w-4" />
                  Tips
                </p>
                {stop.personal_tips.map((tip, idx) => (
                  <p key={idx} className="text-sm text-yellow-900">
                    {tip}
                  </p>
                ))}
              </div>
            )}

            {/* Actions */}
            {stop.actions && (
              <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                {stop.actions.google_maps_url && (
                  <a
                    href={stop.actions.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    Ver en mapa
                  </a>
                )}
                {stop.actions.phone && (
                  <a
                    href={`tel:${stop.actions.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Llamar
                  </a>
                )}
                {stop.actions.can_reserve && stop.actions.reservation_url && (
                  <a
                    href={stop.actions.reservation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-purple px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-purple/90"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Reservar
                  </a>
                )}

                {/* Phase 6: Edit actions */}
                <button
                  type="button"
                  onClick={onReplace}
                  disabled={isEditingDisabled}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-60"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reemplazar
                </button>
                <button
                  type="button"
                  onClick={onTiming}
                  disabled={isEditingDisabled}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-60"
                >
                  <Clock className="h-3.5 w-3.5" />
                  Horario
                </button>
                <button
                  type="button"
                  onClick={onAddAfter}
                  disabled={isEditingDisabled}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-60"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar después
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  disabled={isEditingDisabled}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-60"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Eliminar
                </button>
              </div>
            )}
          </div>

          {/* Travel info to next stop */}
          {!isLast && stop.location?.travel_time_from_previous_minutes && (
            <div className="flex items-center gap-2 border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-600">
              <span>{getTravelModeIcon(stop.location.travel_mode)}</span>
              <span className="font-medium">
                {stop.location.travel_mode === "walk" && "Caminando"}
                {stop.location.travel_mode === "car" && "En coche"}
                {stop.location.travel_mode === "public" && "Transporte público"}
                {!stop.location.travel_mode && "Caminando"}
              </span>
              <span>•</span>
              <span>{stop.location.travel_time_from_previous_minutes} min</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
