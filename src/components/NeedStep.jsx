import React from 'react';
import { Target, DollarSign, Calendar, Compass, ArrowRight, ArrowLeft, Layers, CheckCircle2 } from 'lucide-react';
import { formatCOP } from '../utils/financialCalculations';

const quickAmounts = [10000000, 20000000, 35000000, 50000000, 80000000, 120000000];
const termOptions = [6, 12, 18, 24, 36, 48, 60];

const purposeOptions = [
  { id: 'Maquinaria y Tecnología', label: 'Maquinaria y Tecnología', desc: 'Equipos, computadores, herramientas o software' },
  { id: 'Capital de Trabajo', label: 'Capital de Trabajo / Inventario', desc: 'Materia prima, nómina inicial y compra de stock' },
  { id: 'Expansión Comercial', label: 'Expansión y Mercadeo', desc: 'Apertura de nuevo local, pauta digital o ferias' },
  { id: 'Consolidación de Pasivos', label: 'Consolidación de Deudas', desc: 'Unificar deudas de mayor costo financiero' },
];

export default function NeedStep({ need, setNeed, onNext, onBack }) {
  const handleChange = (field, value) => {
    setNeed(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-400/20">
          <span>Historia de Usuario: HU-04</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Paso 2: Definir Necesidad de Financiación
        </h1>
        <p className="text-sm text-indigo-100 leading-relaxed max-w-2xl">
          Especifica cuánto capital requieres, en qué plazo deseas cancelarlo y en qué lo vas a invertir.
          Estos parámetros filtrarán las opciones idóneas del mercado colombiano.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Monto Requerido */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Monto de Capital Requerido</h2>
                  <p className="text-xs text-slate-500">¿Cuánto dinero necesita tu emprendimiento?</p>
                </div>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-indigo-600">
                {formatCOP(need.amount)}
              </span>
            </div>

            {/* Slider de Monto */}
            <div className="space-y-2 pt-2">
              <input
                type="range"
                min="2000000"
                max="150000000"
                step="1000000"
                value={need.amount || 35000000}
                onChange={(e) => handleChange('amount', Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>$ 2.000.000 COP</span>
                <span>$ 75.000.000 COP</span>
                <span>$ 150.000.000 COP</span>
              </div>
            </div>

            {/* Presets Rápidos de Monto */}
            <div>
              <span className="block text-xs font-semibold text-slate-500 mb-2">Montos habituales para pymes:</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleChange('amount', amt)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                      need.amount === amt
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ${(amt / 1000000).toFixed(0)}M
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Plazo Deseado */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Plazo de Financiación Deseado</h2>
                  <p className="text-xs text-slate-500">¿En cuánto tiempo proyectas amortizar la obligación?</p>
                </div>
              </div>
              <span className="text-lg font-extrabold text-blue-600">
                {need.termMonths} Meses ({(need.termMonths / 12).toFixed(1)} años)
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {termOptions.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleChange('termMonths', term)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all text-center ${
                    need.termMonths === term
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {term}m
                </button>
              ))}
            </div>
          </div>

          {/* Card: Destino de los Recursos */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Destino de los Fondos</h2>
                <p className="text-xs text-slate-500">Las entidades evalúan si el destino genera flujo para pagar</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {purposeOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleChange('purpose', opt.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    need.purpose === opt.id
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{opt.label}</span>
                    {need.purpose === opt.id && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{opt.desc}</p>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detalle específico del uso del dinero
              </label>
              <textarea
                rows={2}
                value={need.purposeDetails || ''}
                onChange={(e) => handleChange('purposeDetails', e.target.value)}
                placeholder="Ej: Adquisición de cortadora láser industrial y compra de tela orgánica para pedidos al por mayor..."
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Summary Card Column (1/3) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Resumen de tu Necesidad</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500">Monto objetivo:</span>
                <span className="font-bold text-slate-900">{formatCOP(need.amount)}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500">Plazo proyectado:</span>
                <span className="font-bold text-slate-900">{need.termMonths} meses</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block mb-1">Destino prioritario:</span>
                <span className="font-bold text-slate-900 block">{need.purpose}</span>
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 leading-relaxed">
                <span className="font-semibold block mb-0.5">Filtro inteligente:</span>
                Al continuar, solo verás alternativas que cubran al menos {formatCOP(need.amount)} y plazos cercanos a {need.termMonths} meses.
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="space-y-2">
            <button
              onClick={onNext}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/25"
            >
              <span>Explorar Alternativas (Paso 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Editar Perfil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
