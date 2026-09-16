import React from 'react';
import { 
  X, CheckCircle2, XCircle, Calculator, ExternalLink, Award, 
  ShieldAlert, Clock, Building2, Check 
} from 'lucide-react';
import { formatCOP, calculateLoanSummary } from '../utils/financialCalculations';

export default function CompareModal({ 
  isOpen, 
  onClose, 
  selectedIds, 
  options, 
  need, 
  onSelectForSimulation 
}) {
  if (!isOpen) return null;

  const comparedOptions = options.filter(opt => selectedIds.includes(opt.id));

  // Determinar cuál tiene la menor tasa E.A. (excluyendo subsidios 0%)
  const commercialOptions = comparedOptions.filter(o => o.rateEA > 0);
  const lowestRateOption = commercialOptions.length > 0 
    ? commercialOptions.reduce((prev, curr) => prev.rateEA < curr.rateEA ? prev : curr) 
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-[#0B1120] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-[#020617]/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                Análisis Comparativo
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Matriz Comparativa Frente a Frente
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              Proyección calculada para {formatCOP(need.amount)} a {need.termMonths} meses
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Cerrar modal de comparativa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Matrix */}
        <div className="p-6 overflow-y-auto space-y-6">
          {comparedOptions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No has seleccionado alternativas para comparar. Regresa al catálogo y marca hasta 3 opciones.
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-${Math.min(comparedOptions.length, 3)} gap-6`}>
              {comparedOptions.map((opt) => {
                const loanCalc = opt.rateEA > 0
                  ? calculateLoanSummary(need.amount, opt.rateEA, need.termMonths)
                  : null;

                const isBestRate = lowestRateOption && opt.id === lowestRateOption.id;

                return (
                  <div
                    key={opt.id}
                    className={`rounded-3xl p-6 flex flex-col justify-between space-y-5 border-2 transition-all ${
                      isBestRate
                        ? 'border-emerald-500 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] shadow-glow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-[#020617]/50'
                    }`}
                  >
                    {/* Header Block */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md uppercase">
                          {opt.category}
                        </span>

                        {isBestRate && (
                          <span className="text-[10px] font-black text-emerald-950 bg-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Award className="w-3 h-3" />
                            Menor Tasa
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight">
                        {opt.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {opt.institution}
                      </p>
                    </div>

                    {/* Estructura Financiera y Cuotas */}
                    <div className="bg-white dark:bg-[#0B1120] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white block text-xs border-b border-slate-100 dark:border-slate-800 pb-1.5">
                        Estructura Financiera & Cuotas
                      </span>

                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Tasa Anual:</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          {opt.rateEA === 0 ? '0% (Capital Semilla)' : `${opt.rateEA}% E.A.`}
                        </span>
                      </div>

                      {loanCalc ? (
                        <>
                          <div className="flex justify-between items-baseline">
                            <span className="text-slate-500 dark:text-slate-400">Cuota Mensual:</span>
                            <span className="font-black text-emerald-600 dark:text-emerald-400 text-base font-mono tabular-nums">
                              {formatCOP(loanCalc.monthlyPayment)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Intereses Totales:</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                              {formatCOP(loanCalc.totalInterest)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Total a Pagar:</span>
                            <span className="font-bold text-slate-900 dark:text-white font-mono">
                              {formatCOP(loanCalc.totalPayment)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                          {opt.repaymentType}
                        </div>
                      )}

                      <div className="flex justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">Desembolso:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {opt.approvalTime}
                        </span>
                      </div>
                    </div>

                    {/* HU-09: Ventajas & Desventajas */}
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ventajas Clave:
                        </span>
                        <ul className="space-y-1.5 pl-1">
                          {opt.advantages.map((adv, i) => (
                            <li key={i} className="text-slate-600 dark:text-slate-300 text-[11px] flex items-start gap-1.5">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{adv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mb-1.5">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Consideraciones:
                        </span>
                        <ul className="space-y-1.5 pl-1">
                          {opt.disadvantages.map((dis, i) => (
                            <li key={i} className="text-slate-600 dark:text-slate-400 text-[11px] flex items-start gap-1.5">
                              <span className="text-rose-500 font-bold">•</span>
                              <span>{dis}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* HU-10: Requisitos */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block">
                        Requisitos de entrada:
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 pl-1">
                        {opt.requirements.map((req, i) => (
                          <li key={i}>• {req}</li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Column Action */}
                    <div className="pt-3">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectForSimulation(opt);
                        }}
                        className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Calculator className="w-4 h-4" />
                        <span>Simular con esta Opción</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Cerrar Comparativa
          </button>
        </div>

      </div>
    </div>
  );
}