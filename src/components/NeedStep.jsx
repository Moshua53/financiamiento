import React, { useState } from 'react';
import { 
  Target, DollarSign, Calendar, Compass, ArrowRight, ArrowLeft, 
  Check, AlertCircle, Info, ShieldCheck, Activity, Layers
} from 'lucide-react';
import { 
  formatCOP, 
  calculateMonthlyPayment, 
  evaluateFinancialCapacity,
  DEFAULT_REFERENCE_RATE_EA 
} from '../utils/financialCalculations';

const benchmarkAmounts = [10000000, 25000000, 50000000, 100000000, 150000000];
const termMonthsOptions = [12, 24, 36, 48, 60];

const structuredPurposes = [
  {
    id: 'Maquinaria y Tecnología',
    label: 'Maquinaria & Equipos de Producción',
    description: 'Adquisición de activos fijos, tecnología o herramientas industriales.',
    fieldHint: 'Especifica tipo de activo, vida útil estimada y proveedor previsto:',
    placeholderHint: 'Ej: Cortadora láser industrial CNC, vida útil 8 años, cotización importación directa.'
  },
  {
    id: 'Capital de Trabajo',
    label: 'Capital de Trabajo & Inventario',
    description: 'Adquisición de materias primas, insumos y cobertura del ciclo operativo.',
    fieldHint: 'Detalla rotación de inventario estimada y temporada de comercialización:',
    placeholderHint: 'Ej: Compra de lote textil orgánico para producción de colección otoño/invierno (ciclo 90 días).'
  },
  {
    id: 'Expansión Comercial',
    label: 'Expansión Comercial & Nuevas Sedes',
    description: 'Apertura de puntos de venta físicos, pauta o desarrollo de nuevos mercados.',
    fieldHint: 'Describe la plaza geográfica y proyección de incremento en ventas:',
    placeholderHint: 'Ej: Habilitación de tienda concepto en Medellín y adecuación de módulo logístico.'
  },
  {
    id: 'Consolidación de Pasivos',
    label: 'Consolidación de Deuda & Pasivos',
    description: 'Sustitución de líneas crediticias de alto costo por instrumentos institucionales.',
    fieldHint: 'Relaciona las entidades financieras y tasas vigentes a sustituir:',
    placeholderHint: 'Ej: Consolidación de 2 microcréditos con tasa > 35% E.A. hacia una sola línea estructurada.'
  },
];

export default function NeedStep({ need, setNeed, profile, onNext, onBack }) {
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const referenceRateEA = need.maxAcceptableRate || DEFAULT_REFERENCE_RATE_EA;
  const estimatedPayment = calculateMonthlyPayment(need.amount, referenceRateEA, need.termMonths || 24);
  const capacity = evaluateFinancialCapacity(
    estimatedPayment,
    profile?.monthlySales || 0,
    profile?.monthlyCosts || 0
  );

  const handleChange = (field, value) => {
    setNeed(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isAmountValid = Number(need.amount) >= 1000000;
  const isTermValid = Number(need.termMonths) > 0;
  const isPurposeValid = Boolean(need.purpose);
  const isStepValid = isAmountValid && isTermValid && isPurposeValid;

  const handleContinue = () => {
    if (!isStepValid) {
      setShowValidationErrors(true);
      return;
    }
    setShowValidationErrors(false);
    onNext();
  };

  const selectedPurposeConfig = structuredPurposes.find(p => p.id === need.purpose) || structuredPurposes[0];

  return (
    <div className="space-y-6">

      {/* Encabezado Técnico de Sección */}
      <div className="border-b border-neutral-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
              Módulo 02 / Estructuración de Demanda
            </span>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              Definición de Demanda de Capital y Destino
            </h1>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
            Parámetros de Amortización
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Controles Principales (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Tarjeta 1: Calibrador Numérico de Precisión */}
          <div className="bg-white p-5 rounded border border-neutral-200 shadow-subtle space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-neutral-700" />
                <span className="text-sm font-semibold text-neutral-900">
                  1. Monto Requerido de Financiación
                </span>
              </div>

              {/* Indicador de Calificación Crediticia */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold border ${capacity.badgeClasses}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    capacity.color === 'emerald' ? 'bg-emerald-600' :
                    capacity.color === 'amber' ? 'bg-amber-600' : 'bg-rose-600'
                  }`} />
                  <span>{capacity.pillLabel}</span>
                </span>
              </div>
            </div>

            {/* Input Numérico Libre y Slider Sincronizados */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-medium text-neutral-600">
                  Ingreso directo o calibración continua:
                </label>
                <div className="relative max-w-xs w-full">
                  <span className="absolute left-3 top-2 text-xs font-mono text-neutral-400 select-none">$</span>
                  <input
                    type="number"
                    min="1000000"
                    max="150000000"
                    step="1000000"
                    value={need.amount || ''}
                    onChange={(e) => handleChange('amount', Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-1.5 text-sm font-finance font-bold tabular-nums text-right bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <input
                type="range"
                min="2000000"
                max="150000000"
                step="1000000"
                value={need.amount || 35000000}
                onChange={(e) => handleChange('amount', Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />

              {/* Marcas de montos frecuentes */}
              <div className="grid grid-cols-5 gap-1 pt-1">
                {benchmarkAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleChange('amount', amt)}
                    className={`py-1 text-[11px] font-mono rounded border transition-colors ${
                      need.amount === amt
                        ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    ${amt / 1000000}M
                  </button>
                ))}
              </div>
            </div>

            {/* Matriz de Impacto en Liquidez */}
            <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <span className="font-semibold text-neutral-800">
                  Impacto en Liquidez Operativa Mensual:
                </span>
                <span className="font-finance tabular-nums text-neutral-900">
                  Cuota estimada: <strong>{formatCOP(estimatedPayment)} / mes</strong>
                </span>
              </div>

              {/* Rango de compromiso de ventas */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                  <span>Compromiso sobre facturación:</span>
                  <span className="font-bold text-neutral-900">{capacity.debtRatio}% de ventas</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden flex">
                  <div style={{ width: '40%' }} className="bg-emerald-500/80 h-full border-r border-white" title="≤20% Solvencia Alta" />
                  <div style={{ width: '30%' }} className="bg-amber-500/80 h-full border-r border-white" title="20-35% Vigilancia" />
                  <div style={{ width: '30%' }} className="bg-rose-500/80 h-full" title=">35% Sobreendeudamiento" />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-neutral-500 pt-0.5">
                  <span className="text-emerald-800">A-1 (≤20%)</span>
                  <span className="text-amber-800">B-2 (20-35%)</span>
                  <span className="text-rose-800">C-3 (&gt;35%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Plazo de Amortización Objetivo */}
          <div className="bg-white p-5 rounded border border-neutral-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-700" />
                <span className="text-sm font-semibold text-neutral-900">
                  2. Plazo de Amortización del Capital
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-neutral-900">
                {need.termMonths} Meses ({(need.termMonths / 12).toFixed(1)} años)
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {termMonthsOptions.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleChange('termMonths', term)}
                  className={`py-2 text-xs font-mono rounded border transition-colors text-center ${
                    need.termMonths === term
                      ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {term} Meses
                </button>
              ))}
            </div>
            <p className="text-[11px] text-neutral-500">
              Un plazo más extenso reduce la cuota mensual fija, mejorando el indicador de riesgo crediticio pero incrementando el interés acumulado.
            </p>
          </div>

          {/* Tarjeta 3: Destino de Fondos en Cuatro Cuadrantes */}
          <div className="bg-white p-5 rounded border border-neutral-200 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <Compass className="w-4 h-4 text-neutral-700" />
              <span className="text-sm font-semibold text-neutral-900">
                3. Destino Estructurado de los Recursos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {structuredPurposes.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleChange('purpose', opt.id)}
                  className={`p-3.5 rounded border transition-colors cursor-pointer select-none ${
                    need.purpose === opt.id
                      ? 'bg-neutral-50 border-neutral-900 ring-1 ring-neutral-900'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-neutral-900">
                      {opt.label}
                    </span>
                    {need.purpose === opt.id && (
                      <Check className="w-3.5 h-3.5 text-neutral-900" strokeWidth={2.5} />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Justificación obligatoria del destino */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                {selectedPurposeConfig.fieldHint}
              </label>
              <textarea
                rows={2}
                value={need.purposeDetails || ''}
                onChange={(e) => handleChange('purposeDetails', e.target.value)}
                placeholder={selectedPurposeConfig.placeholderHint}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors"
              />
            </div>
          </div>

        </div>

        {/* Resumen Analítico Lateral (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
          
          <div className="bg-white p-5 rounded border border-neutral-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wider font-mono">
                Dictamen de Capacidad
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${capacity.badgeClasses}`}>
                {capacity.code}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Monto solicitado:</span>
                <span className="font-finance font-semibold text-neutral-900 tabular-nums">
                  {formatCOP(need.amount)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Plazo solicitado:</span>
                <span className="font-mono text-neutral-900">
                  {need.termMonths} meses
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Cuota proyectada:</span>
                <span className="font-finance font-semibold text-neutral-900 tabular-nums">
                  {formatCOP(estimatedPayment)} / mes
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Ratio sobre ventas:</span>
                <span className="font-finance font-bold tabular-nums text-neutral-900">
                  {capacity.debtRatio}%
                </span>
              </div>

              {/* Diagnóstico técnico */}
              <div className="pt-2 text-[11px] leading-relaxed text-neutral-600 bg-neutral-50 p-3 rounded border border-neutral-200">
                <span className="font-semibold text-neutral-900 block mb-1">
                  Dictamen preliminar:
                </span>
                {capacity.description}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="space-y-2">
            {showValidationErrors && !isStepValid && (
              <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <span className="text-[11px]">
                  Ingresa un monto válido y selecciona el destino de los recursos antes de continuar.
                </span>
              </div>
            )}

            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded transition-colors cursor-pointer shadow-subtle"
            >
              <span>Explorar Opciones Financieras (Paso 03)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white hover:bg-neutral-100 text-neutral-700 font-medium text-xs rounded border border-neutral-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Regresar al Perfil Operativo</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}