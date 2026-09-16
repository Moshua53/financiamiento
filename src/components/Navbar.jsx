import React from 'react';
import { 
  ShieldCheck, Sparkles, RotateCcw, Building2, 
  CheckCircle2, ChevronRight 
} from 'lucide-react';
import { formatCOP } from '../utils/financialCalculations';
import FinanciaPlusLogo from './FinanciaPlusLogo';

export default function Navbar({ 
  currentStep, 
  setCurrentStep, 
  onLoadDemo, 
  onReset, 
  profile, 
  need
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Identity */}
          <div 
            className="flex items-center gap-2 cursor-pointer group select-none transition-transform duration-200 active:scale-[0.99]"
            onClick={() => setCurrentStep(1)}
            title="Ir al inicio del flujo"
          >
            <FinanciaPlusLogo className="h-9" textClassName="text-2xl" />
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 ml-1">
              Fintech Hub
            </span>
          </div>

          {/* Center Business Status Pill (Desktop) */}
          {profile?.name && (
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

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Quick Demo Data Button */}
            <button
              onClick={onLoadDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 transition-all duration-200 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Cargar automáticamente datos de prueba (EcoModa Sostenible SAS)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Datos Demo</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
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