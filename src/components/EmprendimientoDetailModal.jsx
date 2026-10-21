import React, { useState } from 'react';
import { 
  X, Building2, MapPin, Calendar, Users, DollarSign, 
  TrendingUp, ShieldCheck, AlertTriangle, ShieldAlert, 
  Send, Printer, FileText, CheckCircle2, Briefcase
} from 'lucide-react';
import { 
  formatCOP, 
  calculateMonthlyPayment, 
  evaluateFinancialCapacity 
} from '../utils/financialCalculations';

export default function EmprendimientoDetailModal({ emprendimiento, isOpen, onClose }) {
  const [interestSubmitted, setInterestSubmitted] = useState(false);
  const [offerNotes, setOfferNotes] = useState('');

  if (!isOpen || !emprendimiento) return null;

  // Cálculos financieros es
  const sales = Number(emprendimiento.monthly_sales) || 0;
  const costs = Number(emprendimiento.monthly_costs) || 0;
  const netFlow = Math.max(0, sales - costs);
  const marginPercent = sales > 0 ? ((netFlow / sales) * 100).toFixed(1) : '0.0';
  
  const amount = Number(emprendimiento.amount) || 0;
  const termMonths = Number(emprendimiento.term_months) || 12;
  const rateEA = Number(emprendimiento.max_acceptable_rate) || 22.0;
  
  const estimatedPayment = calculateMonthlyPayment(amount, rateEA, termMonths);
  const capacity = evaluateFinancialCapacity(estimatedPayment, sales, costs);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded border border-neutral-300 max-w-4xl w-full shadow-elevated overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Cabecera del Dossier de Debida Diligencia */}
        <div className="px-5 py-4 bg-neutral-900 text-white flex items-start justify-between border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                Detalle de la solicitud
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                REF: {emprendimiento.id?.slice(0, 8) || 'EXP-001'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {emprendimiento.name}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-2">
              <span>Fundador: <strong>{emprendimiento.founder}</strong></span>
              <span>•</span>
              <span>{emprendimiento.city}</span>
              <span>•</span>
              <span className="font-mono text-[11px] text-neutral-300">{emprendimiento.sector}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => window.print()}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
              title="Imprimir expediente"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
              title="Cerrar expediente"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cuerpo del Expediente */}
        <div className="p-5 overflow-y-auto space-y-5 text-neutral-800 text-xs">
          
          {/* Sección 1: Ficha de Registro Legal y Comercial */}
          <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs border-b border-neutral-200 pb-2">
              <Building2 className="w-4 h-4 text-neutral-600" />
              <span>1. Estructura Jurídica y Capacidad Operativa</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[11px] text-neutral-500 block">Razón Social</span>
                <span className="font-semibold text-neutral-900 block truncate">{emprendimiento.name}</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 block">Representante Legal</span>
                <span className="font-semibold text-neutral-900 block truncate">{emprendimiento.founder}</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 block">Años de Operación</span>
                <span className="font-mono font-semibold text-neutral-900 block">{emprendimiento.years_operating} años</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 block">Personal Ocupado</span>
                <span className="font-mono font-semibold text-neutral-900 block">{emprendimiento.employees} colaboradores</span>
              </div>
            </div>

            {emprendimiento.description && (
              <div className="pt-2 border-t border-neutral-200">
                <span className="text-[11px] text-neutral-500 block mb-1">
                  Descripción:
                </span>
                <p className="text-[11px] text-neutral-700 leading-relaxed">
                  {emprendimiento.description}
                </p>
              </div>
            )}
          </div>

          {/* Sección 2: Diagnóstico Financiero Integral */}
          <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between text-neutral-900 font-semibold text-xs border-b border-neutral-200 pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-neutral-600" />
                <span>2. Diagnóstico Financiero & Calificación Crediticia</span>
              </div>
              <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${capacity.badgeClasses}`}>
                <span>Calificación: {capacity.code}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded bg-white border border-neutral-200">
                <span className="text-[10px] text-neutral-500 font-mono block">Facturación / Mes</span>
                <span className="font-finance font-bold tabular-nums text-neutral-900 text-sm block mt-0.5">
                  {formatCOP(sales)}
                </span>
              </div>

              <div className="p-2.5 rounded bg-white border border-neutral-200">
                <span className="text-[10px] text-neutral-500 font-mono block">Costos Operativos</span>
                <span className="font-finance font-semibold tabular-nums text-neutral-700 text-sm block mt-0.5">
                  {formatCOP(costs)}
                </span>
              </div>

              <div className="p-2.5 rounded bg-white border border-neutral-200">
                <span className="text-[10px] text-neutral-500 font-mono block">Flujo de Caja Libre</span>
                <span className="font-finance font-bold tabular-nums text-emerald-800 text-sm block mt-0.5">
                  {formatCOP(netFlow)}
                </span>
              </div>

              <div className="p-2.5 rounded bg-white border border-neutral-200">
                <span className="text-[10px] text-neutral-500 font-mono block">Margen Operativo</span>
                <span className="font-finance font-bold tabular-nums text-neutral-900 text-sm block mt-0.5">
                  {marginPercent}%
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-white border border-neutral-200 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-neutral-500">Relación de Apalancamiento Solicitado:</span>
                <span className="font-finance font-bold tabular-nums text-neutral-900">
                  {capacity.debtRatio}% de facturación mensual
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 mt-1 leading-snug">
                {capacity.description}
              </p>
            </div>
          </div>

          {/* Sección 3: Justificación de Uso de Fondos */}
          <div className="p-4 rounded bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs border-b border-neutral-200 pb-2">
              <FileText className="w-4 h-4 text-neutral-600" />
              <span>3. Estructuración del Requerimiento de Capital</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-neutral-500 block">Monto Solicitado</span>
                <span className="font-finance font-bold tabular-nums text-neutral-900 block mt-0.5">
                  {formatCOP(amount)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-neutral-500 block">Plazo Amortización</span>
                <span className="font-mono font-medium text-neutral-900 block mt-0.5">
                  {termMonths} meses
                </span>
              </div>

              <div>
                <span className="text-[11px] text-neutral-500 block">Cuota Mensual Proyectada</span>
                <span className="font-finance font-bold tabular-nums text-emerald-800 block mt-0.5">
                  {formatCOP(estimatedPayment)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-neutral-500 block">Tasa Máxima Aceptada</span>
                <span className="font-finance font-bold tabular-nums text-neutral-900 block mt-0.5">
                  {rateEA.toFixed(2)}% E.A.
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200 text-xs">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-neutral-900 shrink-0">Destino:</span>
                <span className="text-neutral-800">{emprendimiento.purpose}</span>
              </div>
              {emprendimiento.purpose_details && (
                <p className="text-[11px] text-neutral-600 mt-1 italic pl-1 border-l-2 border-neutral-300">
                  "{emprendimiento.purpose_details}"
                </p>
              )}
            </div>
          </div>

          {/* Sección 4: Consola de Acción del Financiador */}
          <div className="p-4 rounded border border-neutral-300 bg-white space-y-3">
            <span className="text-xs font-semibold text-neutral-900 block">
              Tu decisión
            </span>

            {interestSubmitted ? (
              <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Intención de financiamiento registrada satisfactoriamente en la mesa de crédito.
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  rows={2}
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  placeholder="Observaciones de la propuesta de financiamiento, condiciones o tasa indicativa..."
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInterestSubmitted(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded bg-neutral-900 hover:bg-neutral-800 text-white transition-colors cursor-pointer shadow-subtle"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Manifestar Intención de Financiamiento</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Pie del Modal */}
        <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold rounded transition-colors cursor-pointer"
          >
            Cerrar Expediente
          </button>
        </div>

      </div>
    </div>
  );
}
