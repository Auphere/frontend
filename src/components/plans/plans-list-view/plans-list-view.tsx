import Link from "next/link";
import { Plus, Calendar, MapPin } from "lucide-react";
import type { PlansListViewProps } from "./plans-list-view.interface";

export function PlansListView({
  plans,
  isLoading,
  onCreatePlan,
}: PlansListViewProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body text-gray-600">Cargando planes...</p>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-primary" />
          <h2 className="text-h4 text-gray-900 mb-2">
            Aún no tienes planes
          </h2>
          <p className="text-body text-gray-600 mb-6">
            Crea tu primer plan y empieza a organizar tus salidas nocturnas
          </p>
          <button
            onClick={onCreatePlan}
            className="px-6 py-3 bg-purple text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Crear plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-h3 text-gray-900">Mis planes</h1>
          <p className="text-small text-gray-600">
            {plans.length} {plans.length === 1 ? "plan" : "planes"}
          </p>
        </div>
        <button
          onClick={onCreatePlan}
          className="px-4 py-2 bg-purple text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo plan
        </button>
      </div>

      {/* Plans grid */}
      <div className="flex-1 p-6 bg-[#F6F5F4] overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Link
              key={plan.id}
              href={`/plans/${plan.id}`}
              className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Cover image */}
              {plan.cover_image_url ? (
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${plan.cover_image_url})` }}
                />
              ) : (
                <div className="h-48 bg-gradient-primary" />
              )}

              {/* Content */}
              <div className="p-4">
                <h3 className="text-h4 text-gray-900 mb-2">{plan.title}</h3>
                {plan.description && (
                  <p className="text-small text-gray-600 mb-3 line-clamp-2">
                    {plan.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-small text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {plan.city}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {plan.days.length} {plan.days.length === 1 ? "día" : "días"}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

