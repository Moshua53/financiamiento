import React from 'react';
import { Landmark, Sparkles, RotateCcw, Building2, CheckCircle2, ChevronRight } from 'lucide-react';

export default function Navbar({ currentStep, setCurrentStep, onLoadDemo, onReset, profile, need }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Info */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentStep(1)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">FinanEmprende</span>
                <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                  MVP Fase 1
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Búsqueda & Simulación de Alternativas de Financiación
              </p>
            </div>
          </div>

          {/* Quick Context Pill */}
          {profile?.name && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-medium text-slate-900 truncate max-w-[140px]">{profile.name}</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold">
                ${(need?.amount / 1000000).toFixed(0)}M COP
              </span>
            </div>
          )}

          {/* Actions: Demo Data & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={onLoadDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-sm"
              title="Cargar automáticamente datos de ejemplo para pruebas rápidas"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Cargar Datos Demo</span>
              <span className="sm:hidden">Demo</span>
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Restablecer todos los campos"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
