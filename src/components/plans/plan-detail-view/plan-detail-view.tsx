"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Clock, Euro, Users, Share2 } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { PlanDetailViewProps } from "./plan-detail-view.interface";
import { PlanMapView } from "@/components/plan/plan-map-view";
import { PlanStopsCarousel } from "@/components/plan/plan-stops-carousel";
import { PlanTimeline } from "@/components/plan/plan-timeline";

export function PlanDetailView({ plan, isLoading }: PlanDetailViewProps) {
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple border-t-transparent" />
          <p className="text-body text-gray-600">Cargando plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-md text-center">
          <h2 className="text-h4 mb-2 text-gray-900">Plan no encontrado</h2>
          <p className="text-body mb-6 text-gray-600">
            El plan que buscas no existe o ha sido eliminado
          </p>
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 rounded-lg bg-purple px-6 py-3 font-semibold text-white transition-colors hover:bg-opacity-90"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver a planes
          </Link>
        </div>
      </div>
    );
  }

  // Get summary data
  const city = plan.execution?.city || plan.city || "Zaragoza";
  const totalDuration = plan.summary?.total_duration || "~3h";
  const budgetPerPerson = plan.summary?.budget?.per_person;
  const groupSize = plan.execution?.group_size;
  const totalStops = plan.stops?.length || 0;

  return (
    <div className="flex h-full flex-col bg-[#F6F5F4]">
      {/* Header */}
      <div className="relative shrink-0">
        {/* Cover image or gradient */}
        {plan.cover_image_url ? (
          <div
            className="h-48 bg-cover bg-center md:h-56"
            style={{ backgroundImage: `url(${plan.cover_image_url})` }}
          />
        ) : (
          <div className="h-48 bg-gradient-to-br from-purple via-purple/80 to-blue-500 md:h-56" />
        )}

        {/* Plan info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6">
          <h1 className="mb-1 text-xl font-bold text-white md:text-2xl">
            {plan.title}
          </h1>
          {plan.description && (
            <p className="mb-3 line-clamp-2 text-sm text-white/90">
              {plan.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/90 md:text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {city}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {totalDuration}
            </div>
            <div className="flex items-center gap-1">
              📍 {totalStops} paradas
            </div>
            {budgetPerPerson && (
              <div className="flex items-center gap-1">
                <Euro className="h-4 w-4" />~{budgetPerPerson}€/persona
              </div>
            )}
            {groupSize && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {groupSize} personas
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="visualization" className="flex h-full flex-col">
          <TabsList className="mx-4 mt-4 grid w-auto grid-cols-2 bg-gray-200/80">
            <TabsTrigger
              value="visualization"
              className="data-[state=active]:bg-white data-[state=active]:text-purple"
            >
              🗺️ Visualización
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-white data-[state=active]:text-purple"
            >
              📋 Detalles
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="visualization"
            className="mt-0 flex-1 overflow-y-auto p-4"
          >
            <div className="space-y-4">
              {/* Map */}
              <PlanMapView
                plan={plan}
                activeStopIndex={activeStopIndex}
                onStopClick={(index) => setActiveStopIndex(index)}
              />

              {/* Stops Carousel */}
              <PlanStopsCarousel
                stops={plan.stops || []}
                activeIndex={activeStopIndex}
                onCardChange={(index) => setActiveStopIndex(index)}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="details"
            className="mt-0 flex-1 overflow-y-auto p-4"
          >
            <PlanTimeline plan={plan} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
