import { ArrowLeft, MapPin, Clock, Euro } from "lucide-react";
import Link from "next/link";
import type { PlanDetailViewProps } from "./plan-detail-view.interface";

export function PlanDetailView({ plan, isLoading }: PlanDetailViewProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body text-gray-600">Cargando plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-h4 text-gray-900 mb-2">Plan no encontrado</h2>
          <p className="text-body text-gray-600 mb-6">
            El plan que buscas no existe o ha sido eliminado
          </p>
          <Link
            href="/plans"
            className="px-6 py-3 bg-purple text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a planes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="relative">
        {/* Cover image */}
        {plan.cover_image_url ? (
          <div
            className="h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${plan.cover_image_url})` }}
          />
        ) : (
          <div className="h-64 bg-gradient-primary" />
        )}

        {/* Back button */}
        <Link
          href="/plans"
          className="absolute top-4 left-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </Link>

        {/* Plan info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <h1 className="text-h2 text-white mb-2">{plan.title}</h1>
          {plan.description && (
            <p className="text-body text-white/90 mb-3">{plan.description}</p>
          )}
          <div className="flex items-center gap-4 text-small text-white/90">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {plan.city}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {Math.round(plan.total_duration_minutes / 60)}h
            </div>
            {plan.estimated_cost && (
              <div className="flex items-center gap-1">
                <Euro className="w-4 h-4" />
                {plan.estimated_cost}€
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-[#F6F5F4] overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-h3 text-gray-900 mb-4">Itinerario</h2>
          
          {plan.days.map((day) => (
            <div key={day.day_number} className="mb-6">
              <h3 className="text-h4 text-gray-900 mb-3">
                Día {day.day_number}
                {day.date && ` - ${new Date(day.date).toLocaleDateString()}`}
              </h3>

              <div className="space-y-4">
                {day.events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-body font-semibold text-gray-900">
                          {event.place_name}
                        </h4>
                        <p className="text-small text-gray-600">
                          {event.activity_type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-body font-semibold text-gray-900">
                          {event.start_time}
                        </p>
                        <p className="text-small text-gray-600">
                          {event.duration_minutes} min
                        </p>
                      </div>
                    </div>
                    {event.notes && (
                      <p className="text-small text-gray-600 mt-2">
                        {event.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

