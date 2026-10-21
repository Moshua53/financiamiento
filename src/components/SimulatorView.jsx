import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, Printer, ArrowLeft, Download, AlertTriangle, 
  ShieldCheck, FileText, ChevronDown, ChevronUp, Layers, Check
} from 'lucide-react';
import { 
  formatCOP, 
  calculateLoanSummary, 
  evaluateFinancialCapacity,
  generateAmortizationSchedule,
  downloadAmortizationCSV,
  COLOMBIAN_USURY_RATE_EA
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
  const [simRateEA, setSimRateEA] = useState(activeOption ? activeOption.rateEA : 22.0);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

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

  const schedule = useMemo(() => {
    return generateAmortizationSchedule(simAmount, simRateEA, simTerm);
  }, [simAmount, simRateEA, simTerm]);

  const capitalPercent = summary.totalPayment > 0 
    ? Math.round((simAmount / summary.totalPayment) * 100) 
    : 100;
  const interestPercent = 100 - capitalPercent;

  const handleDownloadCSV = () => {
    const fileName = `amortizacion_${profile?.name ? profile.name.replace(/\s+/g, '_') : 'proyecto'}.csv`;
    downloadAmortizationCSV(schedule, fileName);
  };

  const displayedSchedule = showFullSchedule ? schedule : schedule.slice(0, 12);

  return (
    <div className="space-y-6">

      {/* Encabezado Técnico de Sección */}
      <div className="border-b border-neutral-200 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              Simulador de crédito
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Selector de Fuente */}
            <select
              value={activeOption ? activeOption.id : 'custom'}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setActiveOption(null);
                  setSimRateEA(22.0);
                } else {
                  const found = options.find(o => o.id === e.target.value);
                  if (found) {
                    setActiveOption(found);
                    setSimRateEA(found.rateEA);
                  }
                }
              }}
              className="px-2.5 py-1.5 text-xs font-medium border border-neutral-300 rounded bg-neutral-50 text-neutral-900 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="custom">Ajuste Manual / Parámetros Libres</option>
              {options.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.institution} — {opt.name} ({opt.rateEA.toFixed(2)}% E.A.)
                </option>
              ))}
            </select>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded transition-colors cursor-pointer"
              title="Imprimir ficha formal"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Ficha</span>
            </button>

            <button
              onClick={onBackToCatalog}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catálogo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Espacio de Trabajo: Parámetros y Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Panel Izquierdo: Controles de Parámetros (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-5 rounded border border-neutral-200 shadow-subtle space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 text-neutral-900 font-semibold text-sm">
              <Calculator className="w-4 h-4 text-neutral-700" />
              <span>Parámetros de Amortización</span>
            </div>

            {/* Slider 1: Monto */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-neutral-700">Monto Principal (COP):</label>
                <span className="font-finance font-bold tabular-nums text-neutral-900">
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
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>$ 2M</span>
                <span>$ 75M</span>
                <span>$ 150M COP</span>
              </div>
            </div>

            {/* Slider 2: Plazo */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-neutral-700">Plazo en Meses:</label>
                <span className="font-mono font-bold text-neutral-900">
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
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
              <div className="grid grid-cols-6 gap-1 pt-1">
                {[6, 12, 18, 24, 36, 48].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSimTerm(t)}
                    className={`py-1 text-[11px] font-mono rounded border transition-colors ${
                      simTerm === t 
                        ? 'bg-neutral-900 text-white border-neutral-900 font-bold' 
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {t}m
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 3: Tasa Efectiva Anual */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-neutral-700">Tasa Efectiva Anual (% E.A.):</label>
                <span className="font-finance font-bold tabular-nums text-neutral-900">
                  {simRateEA.toFixed(2)}% E.A.
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                step="0.25"
                value={simRateEA}
                onChange={(e) => setSimRateEA(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>0.00%</span>
                <span>21.00% (Banca)</span>
                <span>Límite legal</span>
              </div>

              {/* Conversión Explícita a Tasa Mensual Vencida */}
              <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200 text-xs flex justify-between items-center">
                <span className="text-neutral-500 text-[11px]">Tasa Mensual Vencida (i_MV):</span>
                <span className="font-finance font-bold tabular-nums text-neutral-900">
                  {summary.monthlyRatePercent}% M.V.
                </span>
              </div>
            </div>

            {/* Advertencia de tasa de usura */}
            {summary.isUsury && (
              <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <span>
                  <span className="font-semibold">Tasa por encima del límite legal</span> ({simRateEA.toFixed(2)}% vs. {COLOMBIAN_USURY_RATE_EA}% E.A.)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Panel Derecho: Resultados Analíticos y Amortización (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Bloque Monumental de Cuota Fija */}
          <div className="bg-neutral-900 text-white p-5 rounded border border-neutral-800 shadow-elevated space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Cuota fija</span>
              <span className="font-mono text-neutral-400">
                {simTerm} periodos mensuales
              </span>
            </div>

            <div>
              <span className="text-xs text-neutral-400 block">Cuota mensual</span>
              <div className="text-3xl sm:text-4xl font-bold font-finance tabular-nums text-white mt-1">
                {formatCOP(summary.monthlyPayment)}
                <span className="text-xs font-normal font-sans text-neutral-400 ml-1.5">/ mes</span>
              </div>
            </div>

            {/* Cinta de Métricas Financieras */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-800 text-xs">
              <div className="p-2.5 rounded bg-neutral-800/60 border border-neutral-700">
                <span className="text-[11px] text-neutral-400 block">
                  Intereses totales
                </span>
                <span className="font-finance font-bold tabular-nums text-amber-400 text-sm mt-0.5 block">
                  {formatCOP(summary.totalInterest)}
                </span>
              </div>

              <div className="p-2.5 rounded bg-neutral-800/60 border border-neutral-700">
                <span className="text-[11px] text-neutral-400 block">
                  Costo total
                </span>
                <span className="font-finance font-bold tabular-nums text-white text-sm mt-0.5 block">
                  {formatCOP(summary.totalPayment)}
                </span>
              </div>
            </div>

            {/* Barra Segmentada de Composición Proporcional */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                <span>Amortización Capital: {capitalPercent}%</span>
                <span className="text-amber-400">Intereses totales: {interestPercent}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${capitalPercent}%` }} className="bg-blue-600 h-full transition-all duration-300" />
                <div style={{ width: `${interestPercent}%` }} className="bg-amber-500 h-full transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Dictamen de Comité de Crédito */}
          <div className="bg-white p-5 rounded border border-neutral-200 shadow-subtle space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-800" />
                <span className="text-xs font-semibold text-neutral-900">
                  Viabilidad
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${capacity.badgeClasses}`}>
                {capacity.code}
              </span>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed">
              Para financiar la necesidad de <strong className="text-neutral-900">{need?.purpose || 'inversión'}</strong> por <strong className="font-finance tabular-nums text-neutral-900">{formatCOP(simAmount)}</strong> en un horizonte de <strong className="font-mono text-neutral-900">{simTerm} meses</strong> a una tasa de <strong className="font-finance tabular-nums text-neutral-900">{simRateEA.toFixed(2)}% E.A.</strong>, el negocio debe comprometer mensualmente <strong className="font-finance tabular-nums text-neutral-900">{formatCOP(summary.monthlyPayment)}</strong>.
            </p>

            <div className="p-3 rounded bg-neutral-50 border border-neutral-200 text-xs space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-neutral-500">Carga proyectada sobre ventas:</span>
                <span className="font-finance font-bold tabular-nums text-neutral-900">
                  {capacity.debtRatio}% de facturación mensual
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-snug pt-1">
                {capacity.description}
              </p>
            </div>
          </div>

          {/* Tabla de Amortización Dinámica Expandible con Descarga CSV */}
          <div className="bg-white rounded border border-neutral-200 shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <h3 className="text-xs font-semibold text-neutral-900">
                  Tabla de Amortización ({simTerm} periodos)
                </h3>
                <span className="text-[11px] text-neutral-500">
                  Evolución detallada de abono a capital e intereses
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadCSV}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded transition-colors cursor-pointer"
                  title="Descargar tabla en formato CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exportar CSV</span>
                </button>

                <button
                  onClick={() => setShowFullSchedule(!showFullSchedule)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded transition-colors cursor-pointer"
                >
                  <span>{showFullSchedule ? 'Ver 12 meses' : `Ver ${simTerm} meses`}</span>
                  {showFullSchedule ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-100/70 border-b border-neutral-200 text-neutral-600 text-[11px]">
                    <th className="py-2 px-3">Mes</th>
                    <th className="py-2 px-3 text-right">Cuota Fija</th>
                    <th className="py-2 px-3 text-right">Interés</th>
                    <th className="py-2 px-3 text-right">Abono Capital</th>
                    <th className="py-2 px-3 text-right">Saldo Deuda</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 font-finance tabular-nums">
                  {displayedSchedule.map((row) => (
                    <tr key={row.period} className="hover:bg-neutral-50 text-neutral-800">
                      <td className="py-1.5 px-3 font-mono text-neutral-500">{row.period}</td>
                      <td className="py-1.5 px-3 text-right font-medium text-neutral-900">{formatCOP(row.monthlyPayment)}</td>
                      <td className="py-1.5 px-3 text-right text-amber-700">{formatCOP(row.interestPaid)}</td>
                      <td className="py-1.5 px-3 text-right text-blue-700">{formatCOP(row.principalPaid)}</td>
                      <td className="py-1.5 px-3 text-right font-medium text-neutral-900">{formatCOP(row.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!showFullSchedule && schedule.length > 12 && (
              <div className="p-2.5 bg-neutral-50 text-center border-t border-neutral-200 text-[11px] text-neutral-500">
                Mostrando los primeros 12 meses. Pulsa "Ver {simTerm} meses" o "Exportar CSV" para consultar el plan completo.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}