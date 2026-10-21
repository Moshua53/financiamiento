import React from 'react';
import { 
  Building2, Briefcase, RotateCcw, LogOut, 
  Cloud, CloudCheck, Check, Activity
} from 'lucide-react';
import { formatCOP, calculateMonthlyPayment } from '../utils/financialCalculations';
import FinanciaPlusLogo from './FinanciaPlusLogo';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  currentStep, 
  setCurrentStep, 
  onReset, 
  profile, 
  need,
  onPublish,
  isPublishing,
  lastSyncTime
}) {
  const { user, profile: authProfile, role, signOut, isSupabaseConfigured } = useAuth();

  // Cálculo de cobertura de flujo para la status bar central
  const monthlySales = Number(profile?.monthlySales) || 0;
  const monthlyCosts = Number(profile?.monthlyCosts) || 0;
  const netCash = Math.max(0, monthlySales - monthlyCosts);
  const estimatedPayment = calculateMonthlyPayment(
    need?.amount || 0, 
    need?.maxAcceptableRate || 22.0, 
    need?.termMonths || 12
  );
  const debtRatio = monthlySales > 0 ? ((estimatedPayment / monthlySales) * 100).toFixed(1) : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">
          
          {/* Bloque 1: Identidad y Espacio de Trabajo */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => setCurrentStep && setCurrentStep(1)}
              title="Volver al Paso 1"
            >
              <FinanciaPlusLogo className="h-7" textClassName="text-xl tracking-tight" />
            </div>

            <div className="hidden sm:flex items-center border-l border-neutral-200 pl-3">
              {role === 'emprendedor' ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Entorno Emprendedor</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-900 border border-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>Mesa de Inversión</span>
                </div>
              )}
            </div>
          </div>

          {/* Bloque 2: Status Bar Central Persistente */}
          <div className="hidden md:flex flex-1 justify-center max-w-2xl px-2">
            {role === 'emprendedor' ? (
              <div className="flex items-center gap-2.5 px-3 py-1 rounded bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
                <span className="font-semibold text-neutral-900 truncate max-w-[140px]">
                  {profile?.name || 'Nuevo Registro'}
                </span>
                <span className="text-neutral-300">|</span>
                <span className="text-neutral-500">Solicitud:</span>
                <span className="font-finance font-semibold tabular-nums text-neutral-900">
                  {need?.amount ? formatCOP(need.amount) : '$ 0 COP'}
                </span>
                {debtRatio !== null && (
                  <>
                    <span className="text-neutral-300">|</span>
                    <span className="text-neutral-500">Compromiso:</span>
                    <span className={`font-finance font-semibold tabular-nums ${
                      Number(debtRatio) <= 20 
                        ? 'text-emerald-700' 
                        : Number(debtRatio) <= 35 
                        ? 'text-amber-700' 
                        : 'text-rose-700'
                    }`}>
                      {debtRatio}%
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 rounded bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold text-neutral-900">Mesa de Evaluación</span>
              </div>
            )}
          </div>

          {/* Bloque 3: Acciones */}
          <div className="flex items-center gap-2 shrink-0">
            {role === 'emprendedor' && (
              <>
                {/* Botón de Publicación con indicador de sincronización */}
                {onPublish && (
                  <button
                    onClick={onPublish}
                    disabled={isPublishing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-emerald-700 hover:bg-emerald-800 text-white transition-colors disabled:opacity-50 cursor-pointer shadow-subtle"
                    title="Publicar solicitud en base de datos central"
                  >
                    <Cloud className={`w-3.5 h-3.5 ${isPublishing ? 'animate-pulse' : ''}`} />
                    <span className="hidden sm:inline">
                      {isPublishing ? 'Guardando...' : 'Publicar Solicitud'}
                    </span>
                  </button>
                )}

                {/* Restablecer formulario */}
                {onReset && (
                  <button
                    onClick={onReset}
                    className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200 transition-colors cursor-pointer"
                    title="Restablecer valores del formulario"
                    aria-label="Restablecer valores"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}

            {/* Perfil austero y cierre de sesión */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
                <div className="hidden xl:flex flex-col text-right leading-none">
                  <span className="text-xs font-semibold text-neutral-900 truncate max-w-[120px]">
                    {authProfile?.full_name || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[11px] text-neutral-500 capitalize mt-0.5">
                    {role}
                  </span>
                </div>

                <button
                  onClick={signOut}
                  className="p-1.5 rounded text-neutral-500 hover:text-rose-700 hover:bg-rose-50 border border-neutral-200 transition-colors cursor-pointer"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}