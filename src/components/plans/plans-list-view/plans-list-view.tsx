import Link from "next/link";
import { Plus, Clock, MapPin } from "lucide-react";
import type { PlansListViewProps } from "./plans-list-view.interface";

export function PlansListView({
  plans,
  isLoading,
  onCreatePlan,
}: PlansListViewProps) {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple border-t-transparent" />
          <p className="text-body text-gray-600">Cargando planes...</p>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-xl bg-gradient-primary" />
          <h2 className="text-h4 mb-2 text-gray-900">Aún no tienes planes</h2>
          <p className="text-body mb-6 text-gray-600">
            Crea tu primer plan y empieza a organizar tus salidas nocturnas
          </p>
          <button
            onClick={onCreatePlan}
            className="inline-flex items-center gap-2 rounded-lg bg-purple px-6 py-3 font-semibold text-white transition-colors hover:bg-opacity-90"
          >
            <Plus className="h-5 w-5" />
            Crear plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-h3 text-gray-900">Mis planes</h1>
          <p className="text-small text-gray-600">
            {plans.length} {plans.length === 1 ? "plan" : "planes"}
          </p>
        </div>
        <button
          onClick={onCreatePlan}
          className="inline-flex items-center gap-2 rounded-lg bg-purple px-4 py-2 font-semibold text-white transition-colors hover:bg-opacity-90"
        >
          <Plus className="h-5 w-5" />
          Nuevo plan
        </button>
      </div>

      {/* Plans grid */}
      <div className="flex-1 overflow-auto bg-[#F6F5F4] p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const city = plan.execution?.city || plan.city || "Zaragoza";
            const totalStops = plan.stops?.length || 0;
            const totalDuration = plan.summary?.total_duration;

            return (
              <Link
                key={plan.id}
                href={`/plans/${plan.id}`}
                className="block overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Cover image */}
                {plan.cover_image_url ? (
                  <div
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${plan.cover_image_url})` }}
                  />
                ) : (
                  <div className="h-40 bg-gradient-to-br from-purple via-purple/80 to-blue-500" />
                )}

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-h4 mb-1 line-clamp-1 text-gray-900">
                    {plan.title}
                  </h3>
                  {plan.description && (
                    <p className="text-small mb-3 line-clamp-2 text-gray-600">
                      {plan.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {city}
                    </div>
                    <div className="flex items-center gap-1">
                      📍 {totalStops} paradas
                    </div>
                    {totalDuration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {totalDuration}
                      </div>
                    )}
                  </div>

                  {/* Vibes */}
                  {plan.vibes && plan.vibes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {plan.vibes.slice(0, 3).map((vibe) => (
                        <span
                          key={vibe}
                          className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700"
                        >
                          {vibe}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

