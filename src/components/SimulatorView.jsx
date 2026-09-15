import React, { useState, useEffect } from 'react';
import { 
  Calculator, DollarSign, Calendar, Percent, CheckCircle2, 
  AlertTriangle, AlertCircle, Sparkles, Printer, ArrowLeft, Layers, ShieldCheck
} from 'lucide-react';
import { 
  formatCOP, calculateLoanSummary, evaluateFinancialCapacity 
} from '../utils/financialCalculations';

export default function SimulatorView({ 
  options, 
  profile, 
  need, 
  activeOption, 
  setActiveOption, 
  onBackToCatalog 
}) {
  // Estado local del simulador (inicia con la opción activa o necesidad definida)
  const [simAmount, setSimAmount] = useState(need?.amount || 35000000);
  const [simTerm, setSimTerm] = useState(need?.termMonths || 24);
  const [simRateEA, setSimRateEA] = useState(activeOption ? activeOption.rateEA : 22.5);

  // Si cambia la opción activa desde el catálogo
  useEffect(() => {
    if (activeOption) {
      setSimRateEA(activeOption.rateEA);
    }
  }, [activeOption]);

  // Cálculos reactivos
  const summary = calculateLoanSummary(simAmount, simRateEA, simTerm);
  const capacity = evaluateFinancialCapacity(
    summary.monthlyPayment, 
    profile?.monthlySales || 0, 
    profile?.monthlyCosts || 0
  );

  const capitalPercent = summary.totalPayment > 0 
    ? Math.round((simAmount / summary.totalPayment) * 100) 
    : 100;
  const interestPercent = 100 - capitalPercent;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/20">
          <span>Historia de Usuario: HU-11 (Simulación Financiera)</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              Simulador Interactivo de Financiación
            </h1>
            <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
              Modifica en tiempo real el monto, plazo y tasa para calcular tus pagos mensuales 
              y evaluar cómo impactará el flujo de caja de {profile?.name || 'tu emprendimiento'}.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Resumen</span>
          </button>
        </div>
      </div>

      {/* Selector de Alternativa a Simular */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <span className="text-xs font-bold text-slate-800 block">Opción Base de Simulación:</span>
            <span className="text-xs text-slate-500">
              {activeOption ? `${activeOption.name} (${activeOption.institution})` : 'Simulación Libre / Personalizada'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeOption ? activeOption.id : 'custom'}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setActiveOption(null);
                setSimRateEA(22.5);
              } else {
                const found = options.find(o => o.id === e.target.value);
                if (found) {
                  setActiveOption(found);
                  setSimRateEA(found.rateEA);
                }
              }
            }}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500"
          >
            <option value="custom">⚙️ Parámetros Libres / Personalizado</option>
            {options.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.institution} - {opt.name} ({opt.rateEA}% E.A.)
              </option>
            ))}
          </select>

          <button
            onClick={onBackToCatalog}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
          >
            Ver Catálogo
          </button>
        </div>
      </div>

      {/* Main Grid: Controls (1/2) & Results (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span>Variables de la Simulación</span>
            </h2>

            {/* Slider 1: Monto */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">
                  Monto Solicitado (COP)
                </label>
                <span className="text-base font-extrabold text-indigo-600">
                  {formatCOP(simAmount)}
                </span>
              </div>
              <input
                type="range"
                min="2000000"
                max="150000000"
                step="1000000"
                value={simAmount}
                onChange={(e) => setSimAmount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>$2M</span>
                <span>$50M</span>
                <span>$100M</span>
                <span>$150M</span>
              </div>
            </div>

            {/* Slider 2: Plazo */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">
                  Plazo de Amortización (Meses)
                </label>
                <span className="text-base font-extrabold text-blue-600">
                  {simTerm} Meses ({(simTerm / 12).toFixed(1)} años)
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="60"
                step="6"
                value={simTerm}
                onChange={(e) => setSimTerm(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="grid grid-cols-6 gap-1.5 pt-1">
                {[6, 12, 18, 24, 36, 48].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSimTerm(t)}
                    className={`py-1 text-[11px] font-bold rounded-lg border text-center transition-colors ${
                      simTerm === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t}m
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 3: Tasa de Interés */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">
                  Tasa de Interés Efectiva Anual (% E.A.)
                </label>
                <span className="text-base font-extrabold text-emerald-600">
                  {simRateEA}% E.A.
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                step="0.5"
                value={simRateEA}
                onChange={(e) => setSimRateEA(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>0% (Semilla)</span>
                <span>15% (Banca)</span>
                <span>28% (Fintech)</span>
                <span>45% (Usura)</span>
              </div>
              <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                Tasa mensual equivalente calculada: <strong className="text-slate-800">{summary.monthlyRatePercent}% M.V.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Results (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Card: Monthly Payment Display */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-lg space-y-4">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
              Resultado Proyectado (Sistema Francés)
            </span>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Cuota Mensual Fija Estimada:</span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {formatCOP(summary.monthlyPayment)}
                <span className="text-base font-semibold text-slate-300"> / mes</span>
              </div>
            </div>

            {/* Quick Metrics Ribbon */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px]">Intereses Totales</span>
                <span className="font-bold text-amber-300 text-sm">
                  {formatCOP(summary.totalInterest)}
                </span>
              </div>

              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px]">Total a Pagar Final</span>
                <span className="font-bold text-white text-sm">
                  {formatCOP(summary.totalPayment)}
                </span>
              </div>
            </div>

            {/* Visual Breakdown Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-blue-300">Capital: {capitalPercent}%</span>
                <span className="text-amber-300">Intereses: {interestPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${capitalPercent}%` }} className="bg-blue-500 h-full transition-all" />
                <div style={{ width: `${interestPercent}%` }} className="bg-amber-500 h-full transition-all" />
              </div>
            </div>
          </div>

          {/* Semaforo de Capacidad Financiera (Integración con HU-02) */}
          <div className={`p-5 rounded-2xl border-2 shadow-xs space-y-3 ${
            capacity.color === 'emerald' 
              ? 'bg-emerald-50/70 border-emerald-300'
              : capacity.color === 'amber'
              ? 'bg-amber-50/70 border-amber-300'
              : 'bg-rose-50/70 border-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              {capacity.color === 'emerald' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {capacity.color === 'amber' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {capacity.color === 'rose' && <AlertCircle className="w-5 h-5 text-rose-600" />}
              <span className="font-extrabold text-sm text-slate-900">
                {capacity.label}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {capacity.description}
            </p>

            {profile?.monthlySales > 0 && (
              <div className="pt-2 border-t border-slate-200/60 flex justify-between text-xs font-semibold text-slate-700">
                <span>Ventas registradas: {formatCOP(profile.monthlySales)}</span>
                <span>Compromiso: {capacity.debtRatio}%</span>
              </div>
            )}
          </div>

          {/* Decision Summary Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Conclusión para tu Comité o Pitch</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Para adquirir <strong className="text-slate-900">{need?.purpose || 'los activos requeridos'}</strong>, 
              una financiación de <strong className="text-slate-900">{formatCOP(simAmount)}</strong> a un plazo de <strong className="text-slate-900">{simTerm} meses</strong> con 
              tasa de <strong className="text-slate-900">{simRateEA}% E.A.</strong> exige una caja mensual de <strong className="text-slate-900">{formatCOP(summary.monthlyPayment)}</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
