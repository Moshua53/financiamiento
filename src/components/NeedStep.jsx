import React from 'react';
import { 
  Target, DollarSign, Calendar, Compass, ArrowRight, ArrowLeft, 
  CheckCircle2, Sparkles, ShieldCheck, Zap 
} from 'lucide-react';
import { formatCOP } from '../utils/financialCalculations';

const quickAmounts = [10000000, 20000000, 35000000, 50000000, 80000000, 120000000];
const termOptions = [6, 12, 18, 24, 36, 48, 60];

const purposeOptions = [
  { id: 'Maquinaria y Tecnología', label: 'Maquinaria y Tecnología', desc: 'Equipos industriales, servidores, software o herramientas' },
  { id: 'Capital de Trabajo', label: 'Capital de Trabajo / Stock', desc: 'Compra de inventario, materia prima o cobertura operativa' },
  { id: 'Expansión Comercial', label: 'Expansión & Apertura', desc: 'Nuevo punto de venta, pauta comercial o ferias de negocios' },
  { id: 'Consolidación de Pasivos', label: 'Consolidación de Deuda', desc: 'Sustituir créditos caros por opciones de menor costo' },
];

export default function NeedStep({ need, setNeed, onNext, onBack }) {
  const handleChange = (field, value) => {
    setNeed(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#0B1120] to-[#020617] border border-slate-800 text-white shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-full bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-3 border border-blue-500/20">
            <Target className="w-3.5 h-3.5" />
            <span>Historia de Usuario: HU-04</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Definir Necesidad de Financiación
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Establece con precisión el capital requerido, el horizonte de amortización y la destinación económica de los recursos. Estos datos estructurarán los filtros del catálogo de crédito.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card: Monto Requerido */}
          <div className="bg-white dark:bg-[#0B1120] p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                    Monto de Capital Requerido
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ajusta el slider o selecciona un monto típico para emprendimientos
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                  {formatCOP(need.amount)}
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
                className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 font-medium px-1">
                <span>$ 2M COP</span>
                <span>$ 75M COP</span>
                <span>$ 150M COP</span>
              </div>
            </div>

            {/* Presets Rápidos */}
            <div className="pt-2">
              <span className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
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
                        : 'bg-slate-50 dark:bg-[#020617] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
                    }`}
                  >
                    ${(amt / 1000000).toFixed(0)}M
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Plazo Deseado */}
          <div className="bg-white dark:bg-[#0B1120] p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                    Plazo de Financiación Objetivo
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tiempo estimado para la amortización del capital
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
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
                      : 'bg-slate-50 dark:bg-[#020617] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-500/40'
                  }`}
                >
                  {term}m
                </button>
              ))}
            </div>
          </div>

          {/* Card: Destino de Fondos */}
          <div className="bg-white dark:bg-[#0B1120] p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                  Destino Prioritario de los Recursos
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
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
                      ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-glow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-[#020617]/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {opt.label}
                    </span>
                    {need.purpose === opt.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Especificación del destino del dinero
              </label>
              <textarea
                rows={2}
                value={need.purposeDetails || ''}
                onChange={(e) => handleChange('purposeDetails', e.target.value)}
                placeholder="Describe los activos a adquirir, cantidades o destino específico..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#020617] border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Executive Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#0B1120] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Ficha Técnica de la Solicitud</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#020617] border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Monto solicitado:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  {formatCOP(need.amount)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#020617] border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Plazo proyectado:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {need.termMonths} meses
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#020617] border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Destinación:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {need.purpose}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-300 leading-relaxed text-[11px]">
                <span className="font-bold block mb-1">Coincidencia en Catálogo:</span>
                Al pasar al Paso 3, se activarán las opciones financieras que acepten solicitudes por {formatCOP(need.amount)}.
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={onNext}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold text-sm rounded-2xl transition-all shadow-md shadow-emerald-500/20 focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Explorar Alternativas (Paso 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-2xl transition-colors"
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