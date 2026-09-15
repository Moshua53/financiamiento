import React from 'react';
import { X, CheckCircle2, XCircle, Calculator, ExternalLink, Award, ShieldAlert, Clock, Building } from 'lucide-react';
import { formatCOP, calculateLoanSummary } from '../utils/financialCalculations';

export default function CompareModal({ isOpen, onClose, selectedIds, options, need, onSelectForSimulation }) {
  if (!isOpen) return null;

  const comparedOptions = options.filter(opt => selectedIds.includes(opt.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md uppercase">
                HU-07, HU-08, HU-09, HU-10
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Comparativa Lado a Lado de Alternativas
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparación proyectada para una necesidad de {formatCOP(need.amount)} a {need.termMonths} meses
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {comparedOptions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No has seleccionado ninguna alternativa para comparar.
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-${Math.min(comparedOptions.length, 3)} gap-6`}>
              {comparedOptions.map((opt) => {
                const loanCalc = opt.rateEA > 0
                  ? calculateLoanSummary(need.amount, opt.rateEA, need.termMonths)
                  : null;

                return (
                  <div
                    key={opt.id}
                    className="border-2 border-slate-200 rounded-2xl p-5 bg-white flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors shadow-xs"
                  >
                    {/* Header Info */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {opt.category}
                        </span>
                        {opt.badge && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {opt.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-lg">{opt.name}</h3>
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {opt.institution}
                      </p>
                    </div>

                    {/* HU-08: Costos y Cuotas Estimadas */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
                      <span className="font-bold text-slate-800 block text-xs border-b border-slate-200 pb-1">
                        HU-08: Estructura de Costos Estimada
                      </span>

                      <div className="flex justify-between">
                        <span className="text-slate-500">Tasa Anual:</span>
                        <span className="font-bold text-slate-900">
                          {opt.rateEA === 0 ? '0% E.A. (Semilla/Equity)' : `${opt.rateEA}% E.A.`}
                        </span>
                      </div>

                      {loanCalc ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Cuota Mensual ({need.termMonths}m):</span>
                            <span className="font-extrabold text-blue-700 text-sm">
                              {formatCOP(loanCalc.monthlyPayment)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Intereses Totales:</span>
                            <span className="font-semibold text-slate-800">
                              {formatCOP(loanCalc.totalInterest)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Total a Pagar:</span>
                            <span className="font-bold text-slate-900">
                              {formatCOP(loanCalc.totalPayment)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="p-2 bg-emerald-50 text-emerald-900 rounded-lg text-[11px] font-medium">
                          {opt.repaymentType}
                        </div>
                      )}

                      <div className="flex justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500">Desembolso:</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {opt.approvalTime}
                        </span>
                      </div>
                    </div>

                    {/* HU-09: Ventajas & Desventajas */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Ventajas Clave:
                        </span>
                        <ul className="space-y-1 pl-1">
                          {opt.advantages.map((adv, i) => (
                            <li key={i} className="text-slate-600 text-[11px] flex items-start gap-1">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{adv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-bold text-rose-800 flex items-center gap-1 mb-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                          Desventajas / Consideraciones:
                        </span>
                        <ul className="space-y-1 pl-1">
                          {opt.disadvantages.map((dis, i) => (
                            <li key={i} className="text-slate-600 text-[11px] flex items-start gap-1">
                              <span className="text-rose-500 font-bold">•</span>
                              <span>{dis}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* HU-10: Requisitos Clave & Entidad */}
                    <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5">
                      <span className="font-bold text-slate-700 block">Requisitos de postulación:</span>
                      <ul className="space-y-1 text-[11px] text-slate-500 pl-1">
                        {opt.requirements.map((req, i) => (
                          <li key={i}>• {req}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Action inside Column */}
                    <div className="pt-3">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectForSimulation(opt);
                        }}
                        className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Simular Cuotas con esta Opción</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            Cerrar Comparativa
          </button>
        </div>
      </div>
    </div>
  );
}
