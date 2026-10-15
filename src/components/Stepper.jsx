import React, { useState } from 'react';
import { Check, Lock, ChevronDown } from 'lucide-react';

const technicalSteps = [
  {
    id: 1,
    code: '01',
    title: 'Perfil Operativo',
    description: 'Estructura comercial y capacidad de caja',
  },
  {
    id: 2,
    code: '02',
    title: 'Demanda de Capital',
    description: 'Monto, plazo y justificación de fondos',
  },
  {
    id: 3,
    code: '03',
    title: 'Evaluación de Fuentes',
    description: 'Catálogo y comparativa de alternativas',
  },
  {
    id: 4,
    code: '04',
    title: 'Dictamen Financiero',
    description: 'Simulador francés y calificación de riesgo',
  },
];

export default function Stepper({ 
  currentStep, 
  setCurrentStep, 
  maxUnlockedStep = 1, 
  onLockedClick 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentStepData = technicalSteps.find(s => s.id === currentStep) || technicalSteps[0];
  const progressPercent = Math.round(((currentStep - 1) / (technicalSteps.length - 1)) * 100);

  const handleStepClick = (stepId) => {
    if (stepId > maxUnlockedStep) {
      onLockedClick?.(stepId);
    } else {
      setCurrentStep(stepId);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav aria-label="Navegación del Flujo Financiero" className="w-full bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop Stepper: Horizontal continuo de 4 segmentos */}
        <div className="hidden md:grid grid-cols-4 divide-x divide-neutral-200 py-3">
          {technicalSteps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isLocked = step.id > maxUnlockedStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(step.id)}
                className={`px-4 py-1.5 text-left transition-colors flex items-center gap-3 select-none ${
                  isCurrent 
                    ? 'bg-neutral-50/80 cursor-default'
                    : isLocked 
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-neutral-50/50 cursor-pointer'
                }`}
              >
                {/* Indicador Numérico / Estado */}
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center shrink-0 text-xs font-mono font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isCurrent
                      ? 'bg-neutral-900 text-white ring-2 ring-neutral-400'
                      : isLocked
                      ? 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                      : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-neutral-400" strokeWidth={1.75} />
                  ) : (
                    <span>{step.code}</span>
                  )}
                </div>

                {/* Texto del Paso */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                      Paso {step.code}
                    </span>
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    )}
                  </div>
                  <p className={`text-xs font-semibold truncate ${
                    isCurrent ? 'text-neutral-900' : 'text-neutral-700'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Móvil: Barra compacta de progreso de 3px y selector de paso actual */}
        <div className="md:hidden py-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                Paso {currentStep} de 4
              </span>
              <p className="text-xs font-bold text-neutral-900">
                {currentStepData.code}. {currentStepData.title}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 rounded border border-neutral-200"
            >
              <span>Detalle</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Barra delgada de progreso 3px */}
          <div className="w-full h-[3px] bg-neutral-200 rounded-full mt-2.5 overflow-hidden">
            <div 
              style={{ width: `${Math.max(12, progressPercent)}%` }} 
              className="h-full bg-emerald-600 transition-all duration-300"
            />
          </div>

          {/* Menú desplegable móvil */}
          {mobileMenuOpen && (
            <div className="mt-3 pt-2 border-t border-neutral-200 space-y-1">
              {technicalSteps.map((step) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                const isLocked = step.id > maxUnlockedStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepClick(step.id)}
                    disabled={isLocked}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded text-left transition-colors ${
                      isCurrent
                        ? 'bg-neutral-100 font-semibold text-neutral-900'
                        : isLocked
                        ? 'text-neutral-400 cursor-not-allowed'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-neutral-500">{step.code}</span>
                      <span>{step.title}</span>
                    </div>
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : isLocked ? (
                      <Lock className="w-3 h-3 text-neutral-400" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}