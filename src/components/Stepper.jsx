import React from 'react';
import { UserCheck, Target, Layers, Calculator, Check, Lock } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Perfil & Finanzas',
    code: 'Paso 1',
    desc: 'Datos comerciales y solvencia',
    icon: UserCheck
  },
  {
    id: 2,
    title: 'Necesidad de Fondos',
    code: 'Paso 2',
    desc: 'Monto, plazo y destino',
    icon: Target
  },
  {
    id: 3,
    title: 'Catálogo de Opciones',
    code: 'Paso 3',
    desc: 'Fuentes disponibles en Colombia',
    icon: Layers
  },
  {
    id: 4,
    title: 'Simulador & Decisión',
    code: 'Paso 4',
    desc: 'Cuotas y comparativa',
    icon: Calculator
  }
];

export default function Stepper({ currentStep, setCurrentStep, maxUnlockedStep = 1, onLockedClick }) {
  return (
    <nav aria-label="Progreso del Emprendedor" className="w-full border-b bg-slate-50/80 border-slate-200 py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isLocked = step.id > maxUnlockedStep;
            const Icon = step.icon;

            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (isLocked) {
                      onLockedClick?.(step.id);
                    } else {
                      setCurrentStep(step.id);
                    }
                  }}
                  disabled={isLocked}
                  aria-disabled={isLocked}
                  className={`w-full text-left p-3 rounded-2xl transition-all duration-200 border flex items-start gap-3 select-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                    isCurrent
                      ? 'bg-white border-emerald-500 shadow-glow-sm ring-1 ring-emerald-500/20'
                      : isCompleted
                      ? 'bg-white/70 border-slate-200 hover:border-emerald-500/40 cursor-pointer'
                      : isLocked
                      ? 'bg-slate-100/40 border-slate-200/50 opacity-50 cursor-not-allowed'
                      : 'bg-white/40 border-slate-200/60 hover:border-slate-300 cursor-pointer'
                  }`}
                >
                  {/* Step Icon Badge */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isCurrent
                        ? 'bg-emerald-500 text-white font-bold shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                        : isLocked
                        ? 'bg-slate-200/50 text-slate-400'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <Icon className="w-4 h-4 stroke-[2]" />
                    )}
                  </div>

                  {/* Step Titles */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[10px] font-bold tracking-wider uppercase ${
                        isCurrent
                          ? 'text-emerald-600'
                          : isCompleted
                          ? 'text-emerald-600/80'
                          : 'text-slate-400'
                      }`}>
                        {isLocked ? `${step.code} • Bloqueado` : step.code}
                      </span>
                      <span className="text-[10px] text-slate-400 hidden lg:inline">
                        Paso {step.id} de 4
                      </span>
                    </div>

                    <p className={`text-xs sm:text-sm font-bold truncate mt-0.5 ${
                      isCurrent 
                        ? 'text-slate-900' 
                        : isLocked
                        ? 'text-slate-400'
                        : 'text-slate-700'
                    }`}>
                      {step.title}
                    </p>

                    <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                      {step.desc}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}