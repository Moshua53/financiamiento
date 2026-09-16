import React, { useState, useEffect } from 'react';
import { 
  Calculator, DollarSign, Calendar, Percent, CheckCircle2, 
  AlertTriangle, AlertCircle, Sparkles, Printer, ArrowLeft, Layers, ShieldCheck, Zap
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
  const [simAmount, setSimAmount] = useState(need?.amount || 35000000);
  const [simTerm, setSimTerm] = useState(need?.termMonths || 24);
  const [simRateEA, setSimRateEA] = useState(activeOption ? activeOption.rateEA : 22.5);

  useEffect(() => {
    if (activeOption) {
      setSimRateEA(activeOption.rateEA);
    }
  }, [activeOption]);

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
    <div className="space-y-6 animate-fadeIn">
      {/* Selector & Actions Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 block">
                Simulación de Crédito & Capacidad
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                Paso 4
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {activeOption ? `${activeOption.name} (${activeOption.institution})` : 'Simulación Libre / Parámetros Personalizados'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
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
            className="px-3.5 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 cursor-pointer flex-1 sm:flex-none"
          >
            <option value="custom">⚙️ Parámetros Libres / Ajuste Manual</option>
            {options.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.institution} — {opt.name} ({opt.rateEA}% E.A.)
              </option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ficha</span>
          </button>

          <button
            onClick={onBackToCatalog}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Catálogo</span>
          </button>
        </div>
      </div>

      {/* Main Simulation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders Form (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-500" />
              <span>Controles Dinámicos de Financiación</span>
            </h2>

            {/* Slider 1: Monto */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">
                  Monto Solicitado (COP)
                </label>
                <span className="text-lg font-black text-emerald-600 font-mono tabular-nums">
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
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 font-medium px-1">
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
                  Plazo de Pago (Meses)
                </label>
                <span className="text-lg font-black text-blue-600 font-mono">
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
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="grid grid-cols-6 gap-1.5 pt-1">
                {[6, 12, 18, 24, 36, 48].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSimTerm(t)}
                    className={`py-1.5 text-xs font-bold font-mono rounded-xl border text-center transition-colors ${
                      simTerm === t 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-glow-blue' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-500/40'
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
                  Tasa Efectiva Anual (% E.A.)
                </label>
                <span className="text-lg font-black text-amber-500 font-mono">
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
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 font-medium px-1">
                <span>0% (Semilla)</span>
                <span>21% (Banca)</span>
                <span>28% (Fintech)</span>
                <span>45% (Usura)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                <span>Tasa mensual vencida equivalente:</span>
                <strong className="text-slate-900 font-mono text-sm">{summary.monthlyRatePercent}% M.V.</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Financial Results Display (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Main Hero Calculation Box */}
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-white shadow-2xl space-y-5">
            <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Sistema Francés de Cuota Fija
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {simTerm} cuotas mensuales
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Cuota Mensual Fija Estimada:</span>
              <div className="text-3xl sm:text-5xl font-black text-white tracking-tight font-mono tabular-nums">
                {formatCOP(summary.monthlyPayment)}
                <span className="text-sm sm:text-base font-normal text-slate-400 ml-1">/ mes</span>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Intereses Totales</span>
                <span className="font-extrabold text-amber-400 text-base font-mono tabular-nums mt-0.5 block">
                  {formatCOP(summary.totalInterest)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total a Desembolsar</span>
                <span className="font-extrabold text-white text-base font-mono tabular-nums mt-0.5 block">
                  {formatCOP(summary.totalPayment)}
                </span>
              </div>
            </div>

            {/* Amortization Split Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-blue-400">Capital: {capitalPercent}%</span>
                <span className="text-amber-400">Intereses: {interestPercent}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden flex p-[2px]">
                <div style={{ width: `${capitalPercent}%` }} className="bg-blue-500 h-full rounded-l-full transition-all duration-300" />
                <div style={{ width: `${interestPercent}%` }} className="bg-amber-500 h-full rounded-r-full transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Solvency Semaphore (HU-13 & HU-14 integrated) */}
          <div className={`p-6 rounded-3xl border-2 transition-all space-y-3 ${
            capacity.color === 'emerald' 
              ? 'bg-emerald-500/[0.04] border-emerald-500 shadow-glow-sm'
              : capacity.color === 'amber'
              ? 'bg-amber-500/[0.04] border-amber-500'
              : 'bg-rose-500/[0.04] border-rose-500'
          }`}>
            <div className="flex items-center gap-2.5">
              {capacity.color === 'emerald' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {capacity.color === 'amber' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {capacity.color === 'rose' && <AlertCircle className="w-5 h-5 text-rose-500" />}
              <span className="font-black text-sm text-slate-900">
                {capacity.label}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {capacity.description}
            </p>

            {profile?.monthlySales > 0 && (
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-mono font-bold text-slate-800">
                <span>Ventas mensuales: {formatCOP(profile.monthlySales)}</span>
                <span className="text-emerald-500">Compromiso: {capacity.debtRatio}%</span>
              </div>
            )}
          </div>

          {/* Institutional Pitch Conclusion */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Dictamen para Comité de Crédito</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Para financiar <strong className="text-slate-900">{need?.purpose || 'la inversión de capital'}</strong> por un valor de <strong className="text-slate-900 font-mono">{formatCOP(simAmount)}</strong> a <strong className="text-slate-900 font-mono">{simTerm} meses</strong> con 
              tasa del <strong className="text-slate-900 font-mono">{simRateEA}% E.A.</strong>, el flujo de caja del negocio debe reservar mensualmente <strong className="text-emerald-600 font-mono">{formatCOP(summary.monthlyPayment)}</strong>.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}