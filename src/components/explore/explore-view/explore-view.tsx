import { Search } from "lucide-react";
import type { ExploreViewProps } from "./explore-view.interface";

export function ExploreView({}: ExploreViewProps) {
  return (
    <div className="h-full flex flex-col bg-[#F6F5F4]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-h3 text-gray-900 mb-4">Explorar lugares</h1>
        
        {/* Search bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar bares, restaurantes, clubs..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple bg-white"
          />
        </div>
      </div>

      {/* Content - placeholder */}
      <div className="flex-1 p-6">
        <div className="text-center max-w-md mx-auto mt-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-warm" />
          <h2 className="text-h4 text-gray-900 mb-2">
            Descubre lugares increíbles
          </h2>
          <p className="text-body text-gray-600">
            Usa los filtros y la búsqueda para encontrar el lugar perfecto para
            tu próxima salida
          </p>
        </div>
      </div>
    </div>
  );
}

