import React, { useState, useMemo } from 'react';
import { 
  Layers, Search, Check, Plus, Calculator, 
  Clock, ShieldCheck, ArrowRight, ArrowUpDown, X
} from 'lucide-react';
import { formatCOP, calculateMonthlyPayment } from '../utils/financialCalculations';

const categories = [
  'Todas', 
  'Bancario', 
  'Fintech', 
  'Capital Semilla', 
  'Microcrédito', 
  'Crowdfunding', 
  'Inversionistas'
];

export default function CatalogStep({ 
  options, 
  need, 
  selectedForCompare, 
  onToggleCompare, 
  onOpenCompare, 
  onSelectForSimulation,
  onNext, 
  onBack 
}) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyMatchAmount, setOnlyMatchAmount] = useState(false);
  const [sortBy, setSortBy] = useState('rate'); // 'rate' | 'time'

  // Filtrado y ordenamiento reactivo 
  const processedOptions = useMemo(() => {
    let result = options.filter(opt => {
      if (selectedCategory !== 'Todas' && opt.category !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = opt.name.toLowerCase().includes(query);
        const matchesInst = opt.institution.toLowerCase().includes(query);
        const matchesDesc = opt.description?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesInst && !matchesDesc) return false;
      }
      if (onlyMatchAmount && need?.amount) {
        if (need.amount < opt.minAmount || need.amount > opt.maxAmount) {
          return false;
        }
      }
      return true;
    });

    // Ordenamiento
    if (sortBy === 'rate') {
      result.sort((a, b) => a.rateEA - b.rateEA);
    } else if (sortBy === 'time') {
      result.sort((a, b) => (a.approvalTime || '').localeCompare(b.approvalTime || ''));
    }

    return result;
  }, [options, selectedCategory, searchTerm, onlyMatchAmount, sortBy, need]);

  return (
    <div className="space-y-6 pb-20">

      {/* Encabezado Técnico de Sección */}
      <div className="border-b border-neutral-200 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              Opciones de financiación
            </h1>
          </div>
          <button
            onClick={() => onSelectForSimulation(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer self-start sm:self-auto shadow-subtle"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador Libre</span>
          </button>
        </div>
      </div>

      {/* Barra de Herramientas y Filtros Analíticos */}
      <div className="bg-white p-4 rounded border border-neutral-200 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Campo de Búsqueda */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por institución, línea de crédito o palabra clave..."
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-2.5 top-2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle de rango de monto */}
            <label className="inline-flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer bg-neutral-50 px-2.5 py-1.5 rounded border border-neutral-200 hover:border-neutral-300">
              <input
                type="checkbox"
                checked={onlyMatchAmount}
                onChange={(e) => setOnlyMatchAmount(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-neutral-900 focus:ring-0"
              />
              <span className="font-mono text-[11px]">
                Admisibles para {need?.amount ? formatCOP(need.amount) : '$ 0'}
              </span>
            </label>

            {/* Ordenamiento por Tasa / Tiempo */}
            <div className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1.5 rounded border border-neutral-200 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-neutral-800 text-xs font-medium outline-none cursor-pointer"
              >
                <option value="rate">Ordenar: Menor Tasa E.A.</option>
                <option value="time">Ordenar: Tiempo Desembolso</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chips de Categorías */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rejilla de Fichas Técnicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {processedOptions.length === 0 ? (
          <div className="col-span-full bg-white p-10 rounded border border-neutral-200 text-center space-y-3">
            <Layers className="w-8 h-8 text-neutral-400 mx-auto" />
            <h3 className="font-semibold text-neutral-900 text-sm">
              Sin coincidencias con los parámetros especificados
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Ajusta los filtros de búsqueda o desactiva la restricción de rango de monto para visualizar más opciones del mercado colombiano.
            </p>
            <button
              onClick={() => { setSelectedCategory('Todas'); setSearchTerm(''); setOnlyMatchAmount(false); }}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-xs rounded border border-neutral-200 transition-colors"
            >
              Restablecer Criterios
            </button>
          </div>
        ) : (
          processedOptions.map((opt) => {
            const isSelected = selectedForCompare.includes(opt.id);
            const calculatedInstallment = opt.rateEA > 0 && need?.amount
              ? calculateMonthlyPayment(need.amount, opt.rateEA, need.termMonths || 24)
              : 0;

            return (
              <div
                key={opt.id}
                className={`bg-white rounded border flex flex-col justify-between transition-colors shadow-subtle ${
                  isSelected 
                    ? 'border-neutral-900 ring-1 ring-neutral-900' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {/* Cuerpo de la Ficha Técnica */}
                <div className="p-4 space-y-3.5">
                  
                  {/* Encabezado: Institución & Instrumento */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                          {opt.category}
                        </span>
                        {opt.badge && (
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-neutral-900 text-sm mt-1.5 leading-snug">
                        {opt.name}
                      </h3>
                      <p className="text-xs font-medium text-neutral-500">
                        {opt.institution}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {opt.description}
                  </p>

                  {/* Matriz Financiera de Ficha */}
                  <div className="p-3 rounded bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="text-neutral-500 text-[11px]">Tasa de Referencia:</span>
                      <span className="font-finance font-bold tabular-nums text-neutral-900 text-sm">
                        {opt.rateEA === 0 ? '0.00% (Subvención/Equity)' : `${opt.rateEA.toFixed(2)}% E.A.`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-500">Tiempo de Respuesta:</span>
                      <span className="font-medium text-neutral-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        {opt.approvalTime}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-neutral-200 flex justify-between items-center text-[11px]">
                      <span className="text-neutral-500">Rango de Monto:</span>
                      <span className="font-finance font-medium tabular-nums text-neutral-800">
                        ${opt.minAmount / 1000000}M - ${opt.maxAmount / 1000000}M COP
                      </span>
                    </div>
                  </div>

                  {/* Cuota proyectada con los parámetros actuales del usuario */}
                  {opt.rateEA > 0 && need?.amount && (
                    <div className="p-2.5 rounded bg-emerald-50/50 border border-emerald-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-emerald-900 block font-medium">
                          Cuota proyectada ({need.termMonths}m):
                        </span>
                        <span className="font-finance font-bold tabular-nums text-emerald-950 text-sm">
                          {formatCOP(calculatedInstallment)} / mes
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-800 px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-200">
                        Francés
                      </span>
                    </div>
                  )}

                  {/* Lista de Requisitos de Admisibilidad */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-semibold text-neutral-700 block">
                      Requisitos de admisibilidad:
                    </span>
                    {opt.requirements.slice(0, 2).map((req, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-neutral-600">
                        <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{req}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Pie de Acciones de Ficha */}
                <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center gap-2">
                  <button
                    onClick={() => onToggleCompare(opt.id)}
                    className={`flex-1 py-1.5 px-2.5 text-xs font-semibold rounded border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>En Comparativa</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Comparar</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onSelectForSimulation(opt)}
                    className="py-1.5 px-3 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-100 border border-neutral-300 rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="Simular bajo estos parámetros"
                  >
                    <Calculator className="w-3 h-3 text-neutral-600" />
                    <span>Simular</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Docking Bar Flotante de Comparativa */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-2xl bg-neutral-900 text-white p-3 rounded border border-neutral-800 shadow-elevated flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
              {selectedForCompare.length} de 3
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                Alternativas seleccionadas para contraste técnico
              </p>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                Compara costo financiero total, requerimientos de garantías y tiempos de desembolso.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCompare}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-subtle"
          >
            <span>Ver Matriz Comparativa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}