"use client";

import { Plan } from "@/lib/types";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PlanPreviewProps {
  plan: Plan;
  onViewDetails?: () => void;
}

export function PlanPreview({ plan, onViewDetails }: PlanPreviewProps) {
  const totalDuration = plan.days.reduce((acc, day) => {
    return (
      acc +
      day.events.reduce(
        (dayAcc, event) => dayAcc + (event.duration || 0),
        0
      )
    );
  }, 0);

  const totalEvents = plan.days.reduce(
    (acc, day) => acc + day.events.length,
    0
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-purple hover:shadow-md">
      {/* Header */}
      <div className="mb-4">
        <h3 className="mb-2 text-xl font-bold text-gray-900">{plan.title}</h3>
        {plan.description && (
          <p className="text-gray-600 line-clamp-2">{plan.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{plan.days.length} día(s)</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{totalEvents} paradas</span>
        </div>
        {totalDuration > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>~{Math.round(totalDuration / 60)}h</span>
          </div>
        )}
      </div>

      {/* Timeline preview - First 3 events */}
      <div className="mb-4 space-y-2">
        {plan.days[0]?.events.slice(0, 3).map((event, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple/10 text-xs font-semibold text-purple">
              {idx + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm line-clamp-1">
                {event.place?.name || event.title}
              </p>
              {event.startTime && (
                <p className="text-xs text-gray-500">{event.startTime}</p>
              )}
            </div>
          </div>
        ))}
        {totalEvents > 3 && (
          <p className="text-center text-sm text-gray-500">
            +{totalEvents - 3} más...
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

export function PlanTimeline({ plan }: PlanTimelineProps) {
  return (
    <div className="space-y-8">
      {plan.days.map((day, dayIdx) => (
        <div key={day.id}>
          {/* Day header */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-white">
              {dayIdx + 1}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {day.title || `Día ${dayIdx + 1}`}
              </h3>
              {day.date && (
                <p className="text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Events timeline */}
          <div className="relative ml-5 space-y-6 border-l-2 border-gray-200 pl-8">
            {day.events.map((event, eventIdx) => (
              <div key={event.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-[37px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-purple shadow-md">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>

                {/* Event card */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="p-4">
                    {/* Time */}
                    {event.startTime && (
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-purple">
                        <Clock className="h-4 w-4" />
                        {event.startTime}
                        {event.duration && ` (${event.duration} min)`}
                      </div>
                    )}

                    {/* Title */}
                    <h4 className="mb-1 font-semibold text-gray-900">
                      {event.place?.name || event.title}
                    </h4>

                    {/* Address */}
                    {event.place?.address && (
                      <div className="mb-2 flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{event.place.address}</span>
                      </div>
                    )}

                    {/* Description */}
                    {event.description && (
                      <p className="text-sm text-gray-700">
                        {event.description}
                      </p>
                    )}

                    {/* Notes */}
                    {event.notes && (
                      <div className="mt-3 rounded-md bg-yellow-50 p-3 text-sm text-yellow-900">
                        💡 {event.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Transport to next event */}
                {event.transportToNext &&
                  eventIdx < day.events.length - 1 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <div className="ml-1 h-6 w-0.5 bg-gray-300"></div>
                      <span className="ml-2">
                        🚶 {event.transportToNext.mode} •{" "}
                        {event.transportToNext.duration} min •{" "}
                        {event.transportToNext.distance}
                      </span>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

