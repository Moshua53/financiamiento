import React, { useState } from 'react';
import { 
  Building2, DollarSign, TrendingUp, Sparkles, ArrowRight, 
  Info, ShieldCheck, MapPin, Users, Briefcase, Calendar, AlertCircle 
} from 'lucide-react';
import { formatCOP } from '../utils/financialCalculations';

export default function ProfileStep({ profile, setProfile, onNext, onLoadDemo }) {
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const netMonthlyCash = Math.max(0, (Number(profile.monthlySales) || 0) - (Number(profile.monthlyCosts) || 0));
  const operatingMargin = profile.monthlySales > 0 
    ? Math.round((netMonthlyCash / Number(profile.monthlySales)) * 100) 
    : 0;

  const isNameValid = Boolean(profile.name?.trim());
  const isFounderValid = Boolean(profile.founder?.trim());
  const isCityValid = Boolean(profile.city?.trim());
  const isSalesValid = Number(profile.monthlySales) > 0;
  const isCostsValid = Number(profile.monthlyCosts) > 0;

  const isStepValid = isNameValid && isFounderValid && isCityValid && isSalesValid && isCostsValid;

  const handleContinue = () => {
    if (!isStepValid) {
      setShowValidationErrors(true);
      return;
    }
    setShowValidationErrors(false);
    onNext();
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Forms (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* HU-01: Registro del Emprendimiento */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                    1. Información General del Emprendimiento
                  </h2>
                  <p className="text-xs text-slate-500">
                    Información mercantil y operacional del negocio
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                Paso 1.1
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Nombre Comercial o Razón Social *
                </label>
                <input
                  type="text"
                  value={profile.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ej: EcoModa Sostenible SAS"
                  className="w-full px-4 py-3 text-sm bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Fundador / Representante Legal *
                </label>
                <input
                  type="text"
                  value={profile.founder || ''}
                  onChange={(e) => handleChange('founder', e.target.value)}
                  placeholder="Ej: Moises Galindo"
                  className="w-full px-4 py-3 text-sm bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Sector o Industria *
                </label>
                <select
                  value={profile.sector || 'Moda y Manufactura'}
                  onChange={(e) => handleChange('sector', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none cursor-pointer transition-all shadow-2xs"
                >
                  <option value="Moda y Manufactura">Moda y Manufactura</option>
                  <option value="Tecnología y Software">Tecnología y Software</option>
                  <option value="Alimentos y Gastronomía">Alimentos y Gastronomía</option>
                  <option value="Comercio Electrónico / Retail">Comercio Electrónico / Retail</option>
                  <option value="Salud y Bienestar">Salud y Bienestar</option>
                  <option value="Servicios Profesionales">Servicios Profesionales</option>
                  <option value="Agroindustria">Agroindustria</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Etapa del Emprendimiento *
                </label>
                <select
                  value={profile.stage || 'Crecimiento Temprano'}
                  onChange={(e) => handleChange('stage', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none cursor-pointer transition-all shadow-2xs"
                >
                  <option value="Idea / Prototipo">Idea / Prototipo (Menos de 6 meses)</option>
                  <option value="Semilla / Validación">Semilla / Validación (Con ventas iniciales)</option>
                  <option value="Crecimiento Temprano">Crecimiento Temprano (Facturación continua)</option>
                  <option value="Consolidación">Consolidación (Más de 3 años en mercado)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Ciudad / Municipio *
                </label>
                <input
                  type="text"
                  value={profile.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Ej: Medellín, Antioquia"
                  className="w-full px-4 py-3 text-sm bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Años Operando
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={profile.yearsOperating ?? 2}
                    onChange={(e) => handleChange('yearsOperating', Number(e.target.value))}
                    className="w-full px-4 py-3 text-sm bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Empleados
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={profile.employees ?? 3}
                    onChange={(e) => handleChange('employees', Number(e.target.value))}
                    className="w-full px-4 py-3 text-sm bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Descripción del Producto o Propuesta de Valor
                </label>
                <textarea
                  rows={3}
                  value={profile.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Resume brevemente qué vendes y a quién va dirigido tu producto..."
                  className="w-full px-4 py-3 text-sm bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all min-h-[96px] resize-y shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* HU-02: Información Financiera Base */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                    2. Capacidad Financiera & Flujo Mensual
                  </h2>
                  <p className="text-xs text-slate-500">
                    Cifras promedio para evaluar solvencia y liquidez
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                Paso 1.2
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Ventas / Ingresos Mensuales Promedio (COP) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-xs text-slate-400 font-bold select-none">$</span>
                  <input
                    type="number"
                    step="500000"
                    min="0"
                    value={profile.monthlySales || ''}
                    onChange={(e) => handleChange('monthlySales', Number(e.target.value))}
                    placeholder="18000000"
                    className="w-full pl-8 pr-4 py-3 text-sm bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 font-mono tabular-nums focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                  />
                </div>
                <p className="text-[11px] text-emerald-600 font-mono mt-2 font-medium">
                  Equivale a: {formatCOP(profile.monthlySales)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Costos & Gastos Operativos Mensuales (COP) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-xs text-slate-400 font-bold select-none">$</span>
                  <input
                    type="number"
                    step="500000"
                    min="0"
                    value={profile.monthlyCosts || ''}
                    onChange={(e) => handleChange('monthlyCosts', Number(e.target.value))}
                    placeholder="11500000"
                    className="w-full pl-8 pr-4 py-3 text-sm bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 font-mono tabular-nums focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-2 font-medium">
                  Equivale a: {formatCOP(profile.monthlyCosts)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Real-Time Financial Metric Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Diagnóstico de Solvencia en Vivo</span>
            </div>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block font-medium">
                  Flujo de Caja Operativo Neto
                </span>
                <span className="text-xl font-black text-slate-900 font-mono tabular-nums mt-0.5 block">
                  {formatCOP(netMonthlyCash)}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                  Excedente libre mensual antes de deuda
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Margen Operativo Bruto:</span>
                  <span className="font-bold text-emerald-500 font-mono">{operatingMargin}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${Math.min(100, Math.max(0, operatingMargin))}%` }} 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  {operatingMargin >= 25 ? '✓ Saludable para apalancar deuda' : '⚠️ Margen ajustado, requiere plazos amplios'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-950 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Para no comprometer tu operación, la cuota mensual máxima sugerida es de <strong className="text-blue-900 font-mono">{formatCOP(netMonthlyCash * 0.35)}</strong> (35% del flujo neto).
                </p>
              </div>
            </div>

            <button
              onClick={onLoadDemo}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-2xl transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autocompletar con Datos Ejemplo</span>
            </button>
          </div>

          {/* Forward CTA Action */}
          <div className="space-y-3">
            {showValidationErrors && !isStepValid && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Por favor completa todos los campos obligatorios (*) y asegura que las ventas y costos sean mayores a $0 antes de continuar.
                </span>
              </div>
            )}

            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-slate-950 font-bold text-sm rounded-2xl transition-all shadow-md shadow-emerald-500/20 focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
            >
              <span>Continuar al Paso 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}