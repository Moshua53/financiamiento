import React from 'react';
import { 
  ShieldCheck, Sparkles, RotateCcw, Building2, Sun, Moon, 
  TrendingUp, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { formatCOP } from '../utils/financialCalculations';

export default function Navbar({ 
  currentStep, 
  setCurrentStep, 
  onLoadDemo, 
  onReset, 
  profile, 
  need,
  darkMode,
  setDarkMode
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b transition-colors duration-200 bg-white/95 dark:bg-[#020617]/90 backdrop-blur-md border-slate-200 dark:border-slate-800/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => setCurrentStep(1)}
            title="Ir al inicio del flujo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 p-[1px] shadow-glow-sm transition-transform duration-200 group-hover:scale-105">
              <div className="w-full h-full rounded-[11px] bg-slate-900 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  Finan<span className="text-emerald-500">Emprende</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Fintech Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                Alternativas de Financiación para Emprendedores
              </p>
            </div>
          </div>

          {/* Center Business Status Pill (Desktop) */}
          {profile?.name && (
            <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[150px] truncate">
                {profile.name}
              </span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span className="text-slate-500 dark:text-slate-400">Solicita:</span>
              <span className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                ${(need?.amount / 1000000).toFixed(0)}M COP
              </span>
            </div>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
              title={darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              aria-label="Alternar tema de interfaz"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Quick Demo Data Button */}
            <button
              onClick={onLoadDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-all duration-200 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Cargar automáticamente datos de prueba (EcoModa Sostenible SAS)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Datos Demo</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Restablecer todos los datos"
              aria-label="Reiniciar datos del formulario"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}