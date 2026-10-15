import React, { useState } from 'react';
import { 
  Building2, DollarSign, TrendingUp, ArrowRight, 
  AlertCircle, ShieldCheck, Info, FileText
} from 'lucide-react';
import { formatCOP } from '../utils/financialCalculations';

const industrySectors = [
  'Moda y Manufactura',
  'Tecnología y Software',
  'Alimentos y Bebidas',
  'Comercio y Retail',
  'Salud y Farmacéutica',
  'Servicios Corporativos',
  'Agroindustria y Pecuario',
  'Construcción e Infraestructura',
];

const businessStages = [
  { id: 'Idea / Prototipo', label: 'Prototipo / Pre-operativo (0 - 6 meses)' },
  { id: 'Semilla / Validación', label: 'Etapa Temprana con Primeras Ventas (6 - 18 meses)' },
  { id: 'Crecimiento Temprano', label: 'Crecimiento y Tracción Continua (18 - 36 meses)' },
  { id: 'Consolidación', label: 'Consolidación y Expansión (> 3 años)' },
];

export default function ProfileStep({ profile, setProfile, onNext }) {
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sales = Number(profile.monthlySales) || 0;
  const costs = Number(profile.monthlyCosts) || 0;
  const netMonthlyCash = Math.max(0, sales - costs);
  const operatingMargin = sales > 0 
    ? Math.round((netMonthlyCash / sales) * 100) 
    : 0;

  // Techo máximo de cuota mensual prudente (35% del flujo de caja operativo neto)
  const maxSafeMonthlyPayment = Math.round(netMonthlyCash * 0.35);

  // Validación de consistencia: costos superan el 150% de las ventas
  const isDeficitExtreme = sales > 0 && costs > sales * 1.5;

  const isNameValid = Boolean(profile.name?.trim());
  const isFounderValid = Boolean(profile.founder?.trim());
  const isCityValid = Boolean(profile.city?.trim());
  const isSalesValid = sales > 0;
  const isCostsValid = costs >= 0;

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
    <div className="space-y-6">

      {/* Encabezado Técnico de Sección */}
      <div className="border-b border-neutral-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
              Módulo 01 / Captura de Solvencia
            </span>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              Perfil Operativo y Declaración Financiera
            </h1>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
            Norma NIIF PYMES
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Columna Izquierda: Entradas Operativas (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tarjeta 1: Información Legal y Comercial */}
          <div className="bg-white p-5 rounded border border-neutral-200 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 text-neutral-900 font-semibold text-sm">
              <Building2 className="w-4 h-4 text-neutral-600" />
              <span>1. Registro Mercantil y Razón Social</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Razón Social o Nombre Comercial *
                </label>
                <input
                  type="text"
                  value={profile.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ej: EcoModa Sostenible SAS"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Fundador / Representante Legal *
                </label>
                <input
                  type="text"
                  value={profile.founder || ''}
                  onChange={(e) => handleChange('founder', e.target.value)}
                  placeholder="Ej: Moises Galindo"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Sector Económico Formal (CIIU) *
                </label>
                <select
                  value={profile.sector || 'Moda y Manufactura'}
                  onChange={(e) => handleChange('sector', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors cursor-pointer"
                >
                  {industrySectors.map((sector) => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Etapa de Madurez del Negocio *
                </label>
                <select
                  value={profile.stage || 'Crecimiento Temprano'}
                  onChange={(e) => handleChange('stage', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors cursor-pointer"
                >
                  {businessStages.map((stage) => (
                    <option key={stage.id} value={stage.id}>{stage.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Ciudad y Departamento de Operación *
                </label>
                <input
                  type="text"
                  value={profile.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Ej: Medellín, Antioquia"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Años Operando
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={profile.yearsOperating ?? 2}
                    onChange={(e) => handleChange('yearsOperating', Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-finance tabular-nums bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    N° Colaboradores
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={profile.employees ?? 3}
                    onChange={(e) => handleChange('employees', Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-finance tabular-nums bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Síntesis del Modelo de Negocio y Mercado Objetivo
                </label>
                <textarea
                  rows={3}
                  value={profile.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe la propuesta de valor comercial, clientes clave y canales de comercialización..."
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors resize-y min-h-[76px]"
                />
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Declaración Financiera y Flujo Mensual */}
          <div className="bg-white p-5 rounded border border-neutral-200 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 text-neutral-900 font-semibold text-sm">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              <span>2. Declaración de Ingresos y Egresos Operativos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Facturación / Ventas Mensuales Promedio (COP) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-neutral-400 font-mono">$</span>
                  <input
                    type="number"
                    step="500000"
                    min="0"
                    value={profile.monthlySales || ''}
                    onChange={(e) => handleChange('monthlySales', Number(e.target.value))}
                    placeholder="18000000"
                    className="w-full pl-7 pr-3 py-2 text-xs font-finance tabular-nums bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] font-finance tabular-nums text-emerald-800 mt-1.5 font-medium">
                  {formatCOP(profile.monthlySales)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Costos & Gastos Operacionales Mensuales (COP) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-neutral-400 font-mono">$</span>
                  <input
                    type="number"
                    step="500000"
                    min="0"
                    value={profile.monthlyCosts || ''}
                    onChange={(e) => handleChange('monthlyCosts', Number(e.target.value))}
                    placeholder="11500000"
                    className="w-full pl-7 pr-3 py-2 text-xs font-finance tabular-nums bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] font-finance tabular-nums text-neutral-600 mt-1.5 font-medium">
                  {formatCOP(profile.monthlyCosts)}
                </p>
              </div>
            </div>

            {/* Advertencia de inconsistencia si egresos superan 150% de ingresos */}
            {isDeficitExtreme && (
              <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold block">Inconsistencia en Estructura de Costos</span>
                  <p className="text-[11px] leading-relaxed text-rose-800">
                    Los costos mensuales declarados superan el 150% de las ventas. Esta condición genera déficit operativo severo y reduce la probabilidad de aprobación en comités de crédito.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Columna Derecha: Cockpit Financiero Flotante Sticky (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
          
          <div className="bg-white p-5 rounded border border-neutral-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wider font-mono">
                Cockpit Financiero
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            </div>

            {/* Métrica 1: Flujo Operativo Neto */}
            <div className="p-3.5 rounded bg-neutral-50 border border-neutral-200">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider block font-medium">
                Flujo Operativo Libre
              </span>
              <span className="text-xl font-bold font-finance tabular-nums text-neutral-900 mt-1 block">
                {formatCOP(netMonthlyCash)}
              </span>
              <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">
                Excedente neto previo a servicio de deuda
              </span>
            </div>

            {/* Métrica 2: Margen Operativo */}
            <div className="p-3.5 rounded bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-600 font-medium">Margen Operativo:</span>
                <span className="font-finance font-bold tabular-nums text-neutral-900">{operatingMargin}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, Math.max(0, operatingMargin))}%` }} 
                  className={`h-full transition-all duration-300 ${
                    operatingMargin >= 20 ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}
                />
              </div>
              <span className="text-[10px] text-neutral-500 font-mono block">
                Referencia sectorial deseada: ≥ 20.0%
              </span>
            </div>

            {/* Métrica 3: Techo Máximo Recomendado */}
            <div className="p-3.5 rounded bg-emerald-50/60 border border-emerald-200 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-900 block">
                Techo de Cuota Prudente (35%)
              </span>
              <span className="text-lg font-bold font-finance tabular-nums text-emerald-950 block">
                {formatCOP(maxSafeMonthlyPayment)} / mes
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed mt-1">
                Límite prudencial sugerido para preservar la liquidez del negocio sin asfixiar capital de trabajo.
              </p>
            </div>
          </div>

          {/* Validaciones y Botón de Avance */}
          <div className="space-y-3">
            {showValidationErrors && !isStepValid && (
              <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <span className="text-[11px]">
                  Completa los campos obligatorios (*) y declara valores de facturación válidos para continuar.
                </span>
              </div>
            )}

            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-white font-semibold text-xs rounded transition-colors cursor-pointer shadow-subtle"
            >
              <span>Continuar a Demanda de Capital (Paso 02)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}