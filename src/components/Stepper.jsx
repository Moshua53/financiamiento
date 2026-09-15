import React from 'react';
import { UserCheck, Target, Layers, Calculator, Check } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Perfil & Finanzas',
    stories: 'HU-01, HU-02',
    description: 'Datos del negocio e ingresos',
    icon: UserCheck
  },
  {
    id: 2,
    title: 'Necesidad de Fondos',
    stories: 'HU-04',
    description: 'Monto, plazo y destino',
    icon: Target
  },
  {
    id: 3,
    title: 'Catálogo & Filtros',
    stories: 'HU-05, HU-06',
    description: 'Explorar opciones en Colombia',
    icon: Layers
  },
  {
    id: 4,
    title: 'Simulador & Comparativa',
    stories: 'HU-07, HU-11',
    description: 'Cálculo de cuotas y decisión',
    icon: Calculator
  }
];

export default function Stepper({ currentStep, setCurrentStep }) {
  return (
    <nav aria-label="Progreso" className="w-full bg-white border-b border-slate-200 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const Icon = step.icon;

            return (
              <li key={step.id} className="relative">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl transition-all border flex items-start gap-3 ${
                    isCurrent
                      ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50/40 border-emerald-300 hover:bg-emerald-50/70'
                      : 'bg-white border-slate-200 hover:bg-slate-50 opacity-80'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600">
                        {step.stories}
                      </span>
                      <span className="text-[10px] text-slate-600 hidden lg:inline">
                        Paso {step.id} de 4
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm font-semibold truncate ${
                      isCurrent ? 'text-blue-900' : 'text-slate-800'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                      {step.description}
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
