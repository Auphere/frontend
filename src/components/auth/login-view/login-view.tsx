import type { LoginViewProps } from "./login-view.interface";

export function LoginView({ onLogin }: LoginViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-full">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-primary" />
          <h1 className="text-h2 text-gray-900 mb-2">Bienvenido a Auphere</h1>
          <p className="text-body text-gray-600">
            Tu asistente inteligente de salidas nocturnas
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onLogin}
            className="w-full px-6 py-3 bg-purple text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Iniciar sesión
          </button>
          <p className="text-small text-gray-500 text-center">
            Demo mode - Click para continuar
          </p>
        </div>
      </div>
    </div>
  );
}

