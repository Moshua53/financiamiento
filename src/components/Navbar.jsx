import React from 'react';
import { 
  ShieldCheck, Sparkles, RotateCcw, Building2, 
  CheckCircle2, ChevronRight, LogOut, CloudUpload, 
  Rocket, Briefcase, User
} from 'lucide-react';
import { formatCOP } from '../utils/financialCalculations';
import FinanciaPlusLogo from './FinanciaPlusLogo';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  currentStep, 
  setCurrentStep, 
  onLoadDemo, 
  onReset, 
  profile, 
  need,
  onPublish,
  isPublishing
}) {
  const { user, profile: authProfile, role, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand & Identity */}
          <div 
            className="flex items-center gap-2 cursor-pointer group select-none transition-transform duration-200 active:scale-[0.99] shrink-0"
            onClick={() => setCurrentStep && setCurrentStep(1)}
            title="Ir al inicio del flujo"
          >
            <FinanciaPlusLogo className="h-9" textClassName="text-2xl" />
            
            {/* Role Badge */}
            {role === 'emprendedor' && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 ml-1">
                <Rocket className="w-3 h-3 text-emerald-500" />
                Emprendedor
              </span>
            )}
            {role === 'financiador' && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 ml-1">
                <Briefcase className="w-3 h-3 text-indigo-500" />
                Financiador
              </span>
            )}
          </div>

          {/* Center Business Status Pill (Desktop, for Emprendedor) */}
          {role === 'emprendedor' && profile?.name && (
            <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-800 max-w-[150px] truncate">
                {profile.name}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">Solicita:</span>
              <span className="font-bold tabular-nums text-emerald-600">
                ${(need?.amount / 1000000).toFixed(0)}M COP
              </span>
            </div>
          )}

          {/* Center Status for Financiador */}
          {role === 'financiador' && (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs text-indigo-800">
              <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
              <span className="font-medium">Portal de Financiadores & Inversionistas</span>
            </div>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Actions for Emprendedor */}
            {role === 'emprendedor' && (
              <>
                {/* Botón Publicar / Guardar Solicitud */}
                {onPublish && (
                  <button
                    onClick={onPublish}
                    disabled={isPublishing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-xs transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                    title="Guardar y publicar tu emprendimiento en la base de datos de Supabase para que sea visible por financiadores"
                  >
                    <CloudUpload className={`w-3.5 h-3.5 ${isPublishing ? 'animate-bounce' : ''}`} />
                    <span className="hidden sm:inline">
                      {isPublishing ? 'Guardando...' : 'Publicar Solicitud'}
                    </span>
                  </button>
                )}

                {/* Quick Demo Data Button */}
                {onLoadDemo && (
                  <button
                    onClick={onLoadDemo}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all duration-200"
                    title="Cargar automáticamente datos de prueba (EcoModa Sostenible SAS)"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden md:inline">Datos Demo</span>
                  </button>
                )}

                {/* Reset Button */}
                {onReset && (
                  <button
                    onClick={onReset}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
                    title="Restablecer todos los datos"
                    aria-label="Reiniciar datos del formulario"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </>
            )}

            {/* User Profile Pill & Sign Out */}
            {user && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <div 
                  className="hidden xl:flex flex-col text-right leading-tight"
                  title={user.email}
                >
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                    {authProfile?.full_name || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {role}
                  </span>
                </div>

                <button
                  onClick={signOut}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}