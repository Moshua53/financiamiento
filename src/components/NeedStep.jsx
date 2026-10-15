import React, { useState } from 'react';
import { 
  Target, DollarSign, Calendar, Compass, ArrowRight, ArrowLeft, 
  CheckCircle2, Sparkles, ShieldCheck, Zap, AlertCircle, AlertTriangle, 
  Info, Activity
} from 'lucide-react';
import { 
  formatCOP, 
  calculateMonthlyPayment, 
  evaluateFinancialCapacity,
  DEFAULT_REFERENCE_RATE_EA 
} from '../utils/financialCalculations';

const quickAmounts = [10000000, 20000000, 35000000, 50000000, 80000000, 120000000];
const termOptions = [6, 12, 18, 24, 36, 48, 60];

const purposeOptions = [
  { id: 'Maquinaria y Tecnología', label: 'Maquinaria y Tecnología', desc: 'Equipos industriales, servidores, software o herramientas' },
  { id: 'Capital de Trabajo', label: 'Capital de Trabajo / Stock', desc: 'Compra de inventario, materia prima o cobertura operativa' },
  { id: 'Expansión Comercial', label: 'Expansión & Apertura', desc: 'Nuevo punto de venta, pauta comercial o ferias de negocios' },
  { id: 'Consolidación de Pasivos', label: 'Consolidación de Deuda', desc: 'Sustituir créditos caros por opciones de menor costo' },
];

export default function NeedStep({ need, setNeed, profile, onNext, onBack }) {
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const referenceRateEA = need.maxAcceptableRate || DEFAULT_REFERENCE_RATE_EA;
  const estimatedPayment = calculateMonthlyPayment(need.amount, referenceRateEA, need.termMonths || 12);
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

  const isAmountValid = Number(need.amount) > 0;
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

  return (
    <div className="space-y-6 animate-fadeIn">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card: Monto Requerido */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                    Monto de Capital Requerido
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ajusta el slider o selecciona un monto típico para emprendimientos
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tabular-nums">
                  {formatCOP(need.amount)}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
                  capacity.color === 'emerald'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : capacity.color === 'amber'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : capacity.color === 'rose'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    capacity.color === 'emerald'
                      ? 'bg-emerald-500 animate-pulse'
                      : capacity.color === 'amber'
                      ? 'bg-amber-500'
                      : capacity.color === 'rose'
                      ? 'bg-rose-500'
                      : 'bg-slate-400'
                  }`} />
                  <span>{capacity.label}</span>
                </span>
              </div>
            </div>

            {/* Slider de Monto */}
            <div className="space-y-2.5 pt-2">
              <input
                type="range"
                min="2000000"
                max="150000000"
                step="1000000"
                value={need.amount || 35000000}
                onChange={(e) => handleChange('amount', Number(e.target.value))}
                className={`w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer ${
                  capacity.color === 'emerald'
                    ? 'accent-emerald-500'
                    : capacity.color === 'amber'
                    ? 'accent-amber-500'
                    : capacity.color === 'rose'
                    ? 'accent-rose-500'
                    : 'accent-slate-600'
                }`}
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 font-medium px-1">
                <span>$ 2M COP</span>
                <span>$ 75M COP</span>
                <span>$ 150M COP</span>
              </div>
            </div>

            {/* Semáforo Reactivo de Capital Recomendable */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 space-y-2.5 ${
              capacity.color === 'emerald'
                ? 'bg-emerald-500/5 border-emerald-200'
                : capacity.color === 'amber'
                ? 'bg-amber-500/5 border-amber-200'
                : capacity.color === 'rose'
                ? 'bg-rose-500/5 border-rose-200'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <Activity className={`w-4 h-4 shrink-0 ${
                    capacity.color === 'emerald'
                      ? 'text-emerald-600'
                      : capacity.color === 'amber'
                      ? 'text-amber-600'
                      : capacity.color === 'rose'
                      ? 'text-rose-600'
                      : 'text-slate-500'
                  }`} />
                  <span className="text-xs font-bold text-slate-900">
                    Semáforo de Capacidad Financiera:
                  </span>
                  <span className={`text-xs font-black ${
                    capacity.color === 'emerald'
                      ? 'text-emerald-700'
                      : capacity.color === 'amber'
                      ? 'text-amber-700'
                      : capacity.color === 'rose'
                      ? 'text-rose-700'
                      : 'text-slate-600'
                  }`}>
                    {capacity.label}
                  </span>
                </div>

                {profile?.monthlySales > 0 ? (
                  <span className="text-xs font-mono text-slate-700 font-semibold">
                    Cuota est.: <strong className="text-slate-900">{formatCOP(estimatedPayment)}/m</strong> ({capacity.debtRatio}% ventas)
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-mono">
                    Cuota est.: {formatCOP(estimatedPayment)}/m
                  </span>
                )}
              </div>

              {/* Barra de rangos con segmentos tricolor */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300" 
                    style={{ width: '40%' }} 
                    title="Zona Verde: Endeudamiento Saludable (≤20% ventas)" 
                  />
                  <div 
                    className="h-full bg-amber-400 transition-all duration-300" 
                    style={{ width: '30%' }} 
                    title="Zona Amarilla: Endeudamiento Moderado (20% - 35% ventas)" 
                  />
                  <div 
                    className="h-full bg-rose-500 transition-all duration-300" 
                    style={{ width: '30%' }} 
                    title="Zona Roja: Riesgo de Sobreendeudamiento (>35% ventas)" 
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 px-0.5">
                  <span className="text-emerald-700 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Saludable (≤20%)
                  </span>
                  <span className="text-amber-700 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Moderado (20-35%)
                  </span>
                  <span className="text-rose-700 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Riesgo (&gt;35%)
                  </span>
                </div>
              </div>
            </div>

            {/* Presets Rápidos */}
            <div className="pt-2">
              <span className="block text-xs font-bold text-slate-600 mb-2">
                Montos predeterminados frecuentes:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleChange('amount', amt)}
                    className={`py-2 px-2.5 text-xs font-bold font-mono rounded-xl border transition-all text-center select-none ${
                      need.amount === amt
                        ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-glow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-500/40'
                    }`}
                  >
                    ${(amt / 1000000).toFixed(0)}M
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Plazo Deseado */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                    Plazo de Financiación Objetivo
                  </h2>
                  <p className="text-xs text-slate-500">
                    Tiempo estimado para la amortización del capital
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-lg sm:text-xl font-black text-blue-600 font-mono">
                  {need.termMonths} Meses ({(need.termMonths / 12).toFixed(1)} años)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
              {termOptions.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleChange('termMonths', term)}
                  className={`py-2.5 px-2 text-xs font-bold font-mono rounded-xl border transition-all text-center select-none ${
                    need.termMonths === term
                      ? 'bg-blue-600 text-white border-blue-600 shadow-glow-blue'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-500/40'
                  }`}
                >
                  {term}m
                </button>
              ))}
            </div>
          </div>

          {/* Card: Destino de Fondos */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                  Destino Prioritario de los Recursos
                </h2>
                <p className="text-xs text-slate-500">
                  Las entidades financieras ponderan el riesgo según el destino del dinero
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {purposeOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleChange('purpose', opt.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    need.purpose === opt.id
                      ? 'border-emerald-500 bg-emerald-500/5 shadow-glow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {opt.label}
                    </span>
                    {need.purpose === opt.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Especificación del destino del dinero
              </label>
              <textarea
                rows={2}
                value={need.purposeDetails || ''}
                onChange={(e) => handleChange('purposeDetails', e.target.value)}
                placeholder="Describe los activos a adquirir, cantidades o destino específico..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Executive Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Card: Semáforo de Capacidad Recomendada */}
          <div className={`p-6 rounded-3xl border-2 transition-all space-y-4 shadow-xs ${
            capacity.color === 'emerald'
              ? 'bg-emerald-50/50 border-emerald-500/40 text-emerald-950 shadow-emerald-500/5'
              : capacity.color === 'amber'
              ? 'bg-amber-50/50 border-amber-500/40 text-amber-950 shadow-amber-500/5'
              : capacity.color === 'rose'
              ? 'bg-rose-50/50 border-rose-500/40 text-rose-950 shadow-rose-500/5'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2.5">
                {capacity.color === 'emerald' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                {capacity.color === 'amber' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
                {capacity.color === 'rose' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                {capacity.color === 'slate' && <Info className="w-5 h-5 text-slate-500 shrink-0" />}
                <span className="font-extrabold text-sm text-slate-900">
                  Capacidad de Pago
                </span>
              </div>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                capacity.color === 'emerald'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : capacity.color === 'amber'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : capacity.color === 'rose'
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}>
                {capacity.label}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/50 font-mono">
                <span className="text-slate-600 font-sans">Cuota mensual est.:</span>
                <span className="font-bold text-slate-900">{formatCOP(estimatedPayment)}</span>
              </div>

              {profile?.monthlySales > 0 ? (
                <>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/50 font-mono">
                    <span className="text-slate-600 font-sans">Ventas mensuales:</span>
                    <span className="font-bold text-slate-900">{formatCOP(profile.monthlySales)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 font-mono">
                    <span className="text-slate-600 font-sans">Nivel de compromiso:</span>
                    <span className={`font-black text-sm ${
                      capacity.color === 'emerald'
                        ? 'text-emerald-600'
                        : capacity.color === 'amber'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}>
                      {capacity.debtRatio}%
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-slate-500 italic">
                  Registra tus ventas mensuales en el Paso 1 para calcular el porcentaje de endeudamiento.
                </p>
              )}

              {/* Recomendación inteligente contextual */}
              <div className="pt-2 text-[11px] leading-relaxed">
                {capacity.color === 'emerald' && (
                  <p className="text-emerald-900 font-medium">
                    ✅ <strong>Capital Recomendable:</strong> La cuota representa un porcentaje saludable de tus ingresos, lo que facilita la aprobación en banca y fintechs sin asfixiar la operación.
                  </p>
                )}
                {capacity.color === 'amber' && (
                  <p className="text-amber-900 font-medium">
                    ⚡ <strong>Capacidad Moderada:</strong> La cuota es viable pero exigente. Evalúa ampliar el plazo a {Math.min(need.termMonths + 12, 60)} meses para amortiguar el impacto en tu flujo de caja.
                  </p>
                )}
                {capacity.color === 'rose' && (
                  <p className="text-rose-900 font-medium">
                    ⚠️ <strong>Riesgo de Sobreendeudamiento:</strong> La cuota supera el 35% de tus ventas mensuales. Te sugerimos ampliar el plazo o reducir el monto para elevar la probabilidad de aprobación.
                  </p>
                )}
                {capacity.color === 'slate' && (
                  <p className="text-slate-600">
                    💡 Si tu negocio está en etapa de idea o sin ventas formales, en el Paso 3 podrás explorar opciones como <strong>Fondo Emprender (SENA)</strong> o <strong>Inversionistas Ángeles</strong>.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Ficha Técnica de la Solicitud</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500">Monto solicitado:</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">
                  {formatCOP(need.amount)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500">Plazo proyectado:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {need.termMonths} meses
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block mb-1">Destinación:</span>
                <span className="font-bold text-slate-900">
                  {need.purpose}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 leading-relaxed text-[11px]">
                <span className="font-bold block mb-1">Coincidencia en Catálogo:</span>
                Al pasar al Paso 3, se activarán las opciones financieras que acepten solicitudes por {formatCOP(need.amount)}.
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {showValidationErrors && !isStepValid && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>
                  Por favor ingresa un monto válido mayor a $0 y selecciona un plazo antes de continuar.
                </span>
              </div>
            )}

            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-slate-950 font-bold text-sm rounded-2xl transition-all shadow-md shadow-emerald-500/20 focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              <span>Explorar Alternativas (Paso 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-2xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Perfil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}