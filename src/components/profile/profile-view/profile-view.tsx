import { User, Mail, MapPin, Globe } from "lucide-react";
import type { ProfileViewProps } from "./profile-view.interface";

export function ProfileView({}: ProfileViewProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-h3 text-gray-900">Mi perfil</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-[#F6F5F4] overflow-auto">
        <div className="max-w-2xl mx-auto">
          {/* Profile card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-h4 text-gray-900">Usuario Demo</h2>
                <p className="text-small text-gray-600">Miembro desde 2025</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-body text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                demo@auphere.com
              </div>
              <div className="flex items-center gap-3 text-body text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                Zaragoza, España
              </div>
              <div className="flex items-center gap-3 text-body text-gray-700">
                <Globe className="w-5 h-5 text-gray-400" />
                Español
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-h4 text-gray-900 mb-4">Preferencias</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-small font-semibold text-gray-700 mb-2">
                  Rango de presupuesto
                </label>
                <p className="text-body text-gray-600">€€ - Moderado</p>
              </div>
              <div>
                <label className="block text-small font-semibold text-gray-700 mb-2">
                  Intereses
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Bares", "Restaurantes", "Música en vivo", "Terrazas"].map(
                    (interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-small"
                      >
                        {interest}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

