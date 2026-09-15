import React from 'react';
import { Building2, DollarSign, TrendingUp, Sparkles, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { formatCOP } from '../utils/financialCalculations';

export default function ProfileStep({ profile, setProfile, onNext, onLoadDemo }) {
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/20">
            <span>Historias de Usuario: HU-01 & HU-02</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
            Paso 1: Perfil del Emprendimiento & Capacidad Financiera
          </h1>
          <p className="text-sm text-blue-100 leading-relaxed">
            Ingresa la identidad de tu negocio y tus cifras básicas. Con esta información, la plataforma 
            evalúa tu capacidad de pago y filtra las fuentes que realmente aceptan tu perfil.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* HU-01: Datos del Negocio */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">HU-01: Registrar Emprendimiento</h2>
                  <p className="text-xs text-slate-500">Datos comerciales y operacionales de tu proyecto</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400">Campos obligatorios</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre del Emprendimiento / Empresa *
                </label>
                <input
                  type="text"
                  value={profile.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ej: EcoModa Sostenible SAS"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre del Fundador / Representante *
                </label>
                <input
                  type="text"
                  value={profile.founder || ''}
                  onChange={(e) => handleChange('founder', e.target.value)}
                  placeholder="Ej: Moises Galindo"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sector o Industria *
                </label>
                <select
                  value={profile.sector || 'Moda y Manufactura'}
                  onChange={(e) => handleChange('sector', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Etapa del Negocio *
                </label>
                <select
                  value={profile.stage || 'Crecimiento Temprano'}
                  onChange={(e) => handleChange('stage', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="Idea / Prototipo">Idea / Prototipo (Menos de 6 meses)</option>
                  <option value="Semilla / Validación">Semilla / Validación (Con ventas iniciales)</option>
                  <option value="Crecimiento Temprano">Crecimiento Temprano (Facturación continua)</option>
                  <option value="Consolidación">Consolidación (Más de 3 años en mercado)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ciudad / Municipio *
                </label>
                <input
                  type="text"
                  value={profile.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Ej: Medellín, Antioquia"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Años operando
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={profile.yearsOperating ?? 2}
                    onChange={(e) => handleChange('yearsOperating', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Empleados
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={profile.employees ?? 3}
                    onChange={(e) => handleChange('employees', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Breve descripción del modelo de negocio
                </label>
                <textarea
                  rows={2}
                  value={profile.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe qué producto o servicio ofreces y a qué clientes atiendes..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* HU-02: Información Financiera */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">HU-02: Información Financiera</h2>
                  <p className="text-xs text-slate-500">Variables mensuales promedio para evaluar capacidad de endeudamiento</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ventas / Ingresos Mensuales Promedio (COP) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    step="500000"
                    min="0"
                    value={profile.monthlySales || ''}
                    onChange={(e) => handleChange('monthlySales', Number(e.target.value))}
                    placeholder="18000000"
                    className="w-full pl-7 pr-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Formato: {formatCOP(profile.monthlySales)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Costos & Gastos Operativos Mensuales (COP) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    step="500000"
                    min="0"
                    value={profile.monthlyCosts || ''}
                    onChange={(e) => handleChange('monthlyCosts', Number(e.target.value))}
                    placeholder="11500000"
                    className="w-full pl-7 pr-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Formato: {formatCOP(profile.monthlyCosts)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Diagnostics Column (1/3) */}
        <div className="space-y-6">
          {/* Quick Financial Health Preview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Diagnóstico Financiero Rápido</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Flujo de Caja Operativo Neto</span>
                <span className="text-base font-bold text-slate-900">
                  {formatCOP(netMonthlyCash)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Dinero libre mensual antes de nueva financiación
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Margen Operativo Bruto</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base font-bold text-emerald-600">{operatingMargin}%</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    operatingMargin >= 25 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {operatingMargin >= 25 ? 'Rentabilidad Fuerte' : 'Rentabilidad Moderada'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-start gap-2 text-xs text-blue-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Con estos números, tu cuota mensual recomendada no debería superar el 30% del flujo libre ({formatCOP(netMonthlyCash * 0.3)}/mes).
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onLoadDemo}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Rellenar con datos de prueba reales
              </button>
            </div>
          </div>

          {/* Next Button Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-5 rounded-2xl text-white shadow-md space-y-3">
            <h3 className="font-bold text-sm">¿Listo con tus datos?</h3>
            <p className="text-xs text-slate-300">
              Avanza para definir cuánto dinero necesitas, el plazo estimado y el destino del crédito.
            </p>
            <button
              onClick={onNext}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/25"
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
