import React, { useState } from 'react';
import { 
  X, Building2, MapPin, Calendar, Users, DollarSign, 
  TrendingUp, ShieldAlert, ShieldCheck, CheckCircle2, 
  Send, PhoneCall, Mail, AlertTriangle, FileText
} from 'lucide-react';
import { 
  formatCOP, 
  calculateMonthlyPayment, 
  evaluateFinancialCapacity 
} from '../utils/financialCalculations';

export default function EmprendimientoDetailModal({ emprendimiento, isOpen, onClose }) {
  const [interestSubmitted, setInterestSubmitted] = useState(false);

  if (!isOpen || !emprendimiento) return null;

  // Cálculos financieros
  const sales = Number(emprendimiento.monthly_sales) || 0;
  const costs = Number(emprendimiento.monthly_costs) || 0;
  const netFlow = sales - costs;
  const marginPercent = sales > 0 ? ((netFlow / sales) * 100).toFixed(1) : '0.0';
  
  const amount = Number(emprendimiento.amount) || 0;
  const termMonths = Number(emprendimiento.term_months) || 12;
  const rateEA = Number(emprendimiento.max_acceptable_rate) || 22.0;
  
  const estimatedPayment = calculateMonthlyPayment(amount, rateEA, termMonths);
  const healthAssessment = evaluateFinancialCapacity(estimatedPayment, sales, costs);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'financiado':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">Financiado</span>;
      case 'en_revision':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700">En Evaluación</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">Solicitud Activa</span>;
    }
  };

  const getRiskPill = () => {
    if (healthAssessment.status === 'success') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Riesgo Bajo • Saludable ({healthAssessment.debtRatio}% de ingresos)
        </span>
      );
    }
    if (healthAssessment.status === 'warning') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Riesgo Moderado ({healthAssessment.debtRatio}% de ingresos)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
        Riesgo Elevado ({healthAssessment.debtRatio}% de ingresos)
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-emerald-400 border border-white/10">
                {emprendimiento.sector}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                {emprendimiento.stage}
              </span>
              {getStatusBadge(emprendimiento.status)}
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {emprendimiento.name}
            </h3>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                Fundador: <strong className="text-white">{emprendimiento.founder}</strong>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {emprendimiento.city}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs">
          
          {/* Requerimiento de Capital Prominente */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/80 border border-indigo-100 shadow-xs">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">
                Solicitud de Inversión / Financiamiento
              </span>
              {getRiskPill()}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Monto Solicitado</span>
                <p className="text-base sm:text-lg font-black text-slate-900 tabular-nums">
                  {formatCOP(amount)}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Plazo Proyectado</span>
                <p className="text-base sm:text-lg font-black text-slate-900">
                  {termMonths} meses
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Cuota Estimada</span>
                <p className="text-base sm:text-lg font-black text-emerald-600 tabular-nums">
                  {formatCOP(estimatedPayment)} <span className="text-[10px] text-slate-400 font-normal">/mes</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Tasa Máx. Esperada</span>
                <p className="text-base sm:text-lg font-black text-indigo-600">
                  {rateEA}% <span className="text-[10px] text-slate-400 font-normal">E.A.</span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-100/60 flex items-start gap-2">
              <FileText className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Destino: </strong>
                <span className="font-semibold text-indigo-900">{emprendimiento.purpose}</span>
                {emprendimiento.purpose_details && (
                  <p className="text-slate-600 mt-1 italic">
                    "{emprendimiento.purpose_details}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Salud Financiera y Capacidad Operativa */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Radiografía Financiera del Negocio
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block">Ventas Mensuales</span>
                <span className="text-sm font-black text-slate-900 tabular-nums">
                  {formatCOP(sales)}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block">Costos Operacionales</span>
                <span className="text-sm font-black text-slate-700 tabular-nums">
                  {formatCOP(costs)}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block">Flujo de Caja Neto</span>
                <span className={`text-sm font-black tabular-nums ${netFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatCOP(netFlow)}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block">Margen Operativo</span>
                <span className={`text-sm font-black ${Number(marginPercent) >= 15 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {marginPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Modelo de Negocio & Características Operacionales */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-700" />
              Descripción del Modelo de Negocio
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
              {emprendimiento.description || 'El emprendedor no ha registrado una descripción detallada.'}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              <div className="flex items-center gap-2 p-2.5 bg-slate-100/70 rounded-lg text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Tiempo de Operación: <strong>{emprendimiento.years_operating} años</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-100/70 rounded-lg text-slate-600">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Equipo de Trabajo: <strong>{emprendimiento.employees} colaboradores</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-100/70 rounded-lg text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Sede: <strong>{emprendimiento.city}</strong></span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all"
          >
            Cerrar Ficha
          </button>

          {interestSubmitted ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Interés manifestado! Notificación enviada al emprendedor</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setInterestSubmitted(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-xl shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Manifestar Interés de Inversión</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
