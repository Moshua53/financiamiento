import React from 'react';
import { 
  X, Calculator, ShieldCheck, Clock, Building2, 
  Award, AlertCircle, Check
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

  // Determinar menor tasa comercial (excluyendo subsidios 0%)
  const commercialOptions = comparedOptions.filter(o => o.rateEA > 0);
  const lowestRateOption = commercialOptions.length > 0 
    ? commercialOptions.reduce((prev, curr) => prev.rateEA < curr.rateEA ? prev : curr) 
    : null;

  // Asignar esquema de garantías según categoría
  const getGuaranteeScheme = (opt) => {
    switch (opt.category) {
      case 'Bancario':
        return 'Garantía FGA (Fondo Nacional de Garantías) / Pagaré formal con codeudor o respaldo patrimonial';
      case 'Fintech':
        return 'Pagaré desmaterializado / Fianza digital institucional (sin hipoteca)';
      case 'Capital Semilla':
        return 'Acuerdo de condonación de deuda contra cumplimiento de metas de empleo (SENA)';
      case 'Microcrédito':
        return 'Firma solidaria / Aval personal y visita domiciliaria al establecimiento';
      case 'Crowdfunding':
        return 'Pagaré colectivo registrado ante la Bolsa de Valores de Colombia (BVC)';
      case 'Inversionistas':
        return 'Pacto de accionistas / Cesión de porcentaje accionario (Equity)';
      default:
        return 'Pagaré en blanco con carta de instrucciones';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded border border-neutral-300 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden shadow-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Cabecera Institucional del Modal */}
        <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 bg-neutral-200 px-1.5 py-0.5 rounded">
                Mesa Técnica
              </span>
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                Matriz Comparativa de Fuentes de Financiación
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              Cálculos proyectados para {formatCOP(need.amount)} a {need.termMonths} meses
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer"
            aria-label="Cerrar modal de comparativa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido: Tabla Comparativa Paralela */}
        <div className="p-5 overflow-y-auto space-y-6">
          {comparedOptions.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              No has seleccionado alternativas para comparar. Regresa al catálogo y marca hasta 3 opciones.
            </div>
          ) : (
            <div className={`grid gap-4 ${
              comparedOptions.length === 1 
                ? 'grid-cols-1 max-w-lg mx-auto' 
                : comparedOptions.length === 2 
                ? 'grid-cols-1 md:grid-cols-2' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {comparedOptions.map((opt) => {
                const loanCalc = opt.rateEA > 0
                  ? calculateLoanSummary(need.amount, opt.rateEA, need.termMonths)
                  : null;

                const isBestRate = lowestRateOption && opt.id === lowestRateOption.id;

                return (
                  <div
                    key={opt.id}
                    className={`rounded border flex flex-col justify-between p-4 space-y-4 ${
                      isBestRate
                        ? 'border-neutral-900 bg-neutral-50/50'
                        : 'border-neutral-200 bg-white'
                    }`}
                  >
                    {/* Encabezado de Opción */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                          {opt.category}
                        </span>

                        {isBestRate && (
                          <span className="text-[10px] font-mono text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                            <Award className="w-3 h-3" />
                            Menor Tasa E.A.
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-neutral-900 text-base leading-tight">
                        {opt.name}
                      </h3>
                      <p className="text-xs font-medium text-neutral-500 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                        {opt.institution}
                      </p>
                    </div>

                    {/* Estructura Financiera y Cuota Fija */}
                    <div className="bg-neutral-50 p-3 rounded border border-neutral-200 space-y-2 text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="text-neutral-500">Tasa Efectiva Anual:</span>
                        <span className="font-finance font-bold tabular-nums text-neutral-900">
                          {opt.rateEA === 0 ? '0.00% (Subvención)' : `${opt.rateEA.toFixed(2)}% E.A.`}
                        </span>
                      </div>

                      {loanCalc ? (
                        <>
                          <div className="flex justify-between items-baseline pt-1 border-t border-neutral-200">
                            <span className="text-neutral-600 font-medium">Cuota Mensual:</span>
                            <span className="font-finance font-bold text-neutral-950 text-sm tabular-nums">
                              {formatCOP(loanCalc.monthlyPayment)}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-neutral-500">Intereses Totales:</span>
                            <span className="font-finance font-medium text-neutral-700 tabular-nums">
                              {formatCOP(loanCalc.totalInterest)}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-neutral-500">Costo Total Financiación:</span>
                            <span className="font-finance font-bold text-neutral-900 tabular-nums">
                              {formatCOP(loanCalc.totalPayment)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="p-2 rounded bg-neutral-100 text-neutral-700 text-[11px] font-medium">
                          {opt.repaymentType}
                        </div>
                      )}

                      <div className="flex justify-between pt-1 border-t border-neutral-200 text-[11px]">
                        <span className="text-neutral-500">Tiempo de Respuesta:</span>
                        <span className="font-medium text-neutral-700 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          {opt.approvalTime}
                        </span>
                      </div>
                    </div>

                    {/* Exigencia de Garantías */}
                    <div className="p-2.5 rounded bg-white border border-neutral-200 space-y-1 text-xs">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                        Exigencia de Garantías:
                      </span>
                      <p className="text-[11px] text-neutral-700 leading-snug">
                        {getGuaranteeScheme(opt)}
                      </p>
                    </div>

                    {/* Ventajas y Consideraciones */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-neutral-900 block text-[11px] mb-1">
                          Ventajas Estructuradas:
                        </span>
                        <ul className="space-y-1">
                          {opt.advantages.map((adv, i) => (
                            <li key={i} className="text-neutral-600 text-[11px] flex items-start gap-1.5">
                              <span className="text-neutral-400 font-mono">•</span>
                              <span>{adv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-semibold text-neutral-900 block text-[11px] mb-1">
                          Consideraciones de Riesgo:
                        </span>
                        <ul className="space-y-1">
                          {opt.disadvantages.map((dis, i) => (
                            <li key={i} className="text-neutral-600 text-[11px] flex items-start gap-1.5">
                              <span className="text-neutral-400 font-mono">•</span>
                              <span>{dis}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Acción de Selección para Simulación */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectForSimulation(opt);
                        }}
                        className="w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-subtle"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Simular con este Instrumento</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold rounded transition-colors cursor-pointer"
          >
            Cerrar Matriz
          </button>
        </div>

      </div>
    </div>
  );
}