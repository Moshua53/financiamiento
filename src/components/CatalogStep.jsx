import React, { useState, useMemo } from 'react';
import { 
  Layers, Search, Filter, Check, Plus, ExternalLink, Calculator, 
  Sparkles, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Clock, ShieldCheck, Tag
} from 'lucide-react';
import { formatCOP, calculateMonthlyPayment } from '../utils/financialCalculations';

const categories = ['Todas', 'Bancario', 'Fintech', 'Capital Semilla', 'Microcrédito', 'Crowdfunding', 'Inversionistas'];

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

  // Filtrado reactivo de alternativas (HU-06)
  const filteredOptions = useMemo(() => {
    return options.filter(opt => {
      // Filtro por categoría
      if (selectedCategory !== 'Todas' && opt.category !== selectedCategory) {
        return false;
      }
      // Filtro por búsqueda de texto
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = opt.name.toLowerCase().includes(query);
        const matchesInst = opt.institution.toLowerCase().includes(query);
        const matchesDesc = opt.description.toLowerCase().includes(query);
        if (!matchesName && !matchesInst && !matchesDesc) return false;
      }
      // Filtro por monto de la necesidad (HU-04)
      if (onlyMatchAmount && need?.amount) {
        if (need.amount < opt.minAmount || need.amount > opt.maxAmount) {
          return false;
        }
      }
      return true;
    });
  }, [options, selectedCategory, searchTerm, onlyMatchAmount, need]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/20">
          <span>Historias de Usuario: HU-05 & HU-06</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              Paso 3: Catálogo y Filtros de Financiación
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explora las fuentes de financiación disponibles en el ecosistema. Filtra según tus necesidades, 
              selecciona hasta 3 opciones para comparar lado a lado, o simula directamente cualquiera de ellas.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectForSimulation(null)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Ir al Simulador Libre</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Input de búsqueda */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por entidad (ej: Bancolombia, Sempli, Fondo Emprender)..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Toggle de monto acorde a necesidad */}
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={onlyMatchAmount}
              onChange={(e) => setOnlyMatchAmount(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 rounded-xs"
            />
            <span>Solo opciones que cubran mi monto ({formatCOP(need.amount)})</span>
          </label>
        </div>

        {/* Categorías (Pills) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Alternativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOptions.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-base">No hay alternativas con los filtros actuales</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Intenta desmarcar el filtro de monto estricto o buscar otra categoría para ver más opciones disponibles.
            </p>
            <button
              onClick={() => { setSelectedCategory('Todas'); setSearchTerm(''); setOnlyMatchAmount(false); }}
              className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          filteredOptions.map((opt) => {
            const isSelected = selectedForCompare.includes(opt.id);
            const estimatedInstallment = opt.rateEA > 0 && need?.amount
              ? calculateMonthlyPayment(need.amount, opt.rateEA, need.termMonths || 24)
              : 0;

            return (
              <div
                key={opt.id}
                className={`bg-white rounded-2xl border-2 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md ${
                  isSelected ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Top */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold tracking-wide uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {opt.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1.5 leading-snug">
                        {opt.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">
                        {opt.institution}
                      </p>
                    </div>

                    {opt.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                        {opt.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {opt.description}
                  </p>

                  {/* Financial Metrics Strip */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-xs border border-slate-100">
                    <div>
                      <span className="text-slate-600 block text-[10px]">Tasa Referencia</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {opt.rateEA === 0 ? '0% (No reembolsable/Equity)' : `${opt.rateEA}% E.A.`}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-600 block text-[10px]">Tiempo Desembolso</span>
                      <span className="font-semibold text-slate-800 text-xs flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-600" />
                        {opt.approvalTime}
                      </span>
                    </div>

                    <div className="col-span-2 pt-1 border-t border-slate-200/60 flex justify-between items-center text-[11px]">
                      <span className="text-slate-600">Rango montos:</span>
                      <span className="font-semibold text-slate-800">
                        ${(opt.minAmount / 1000000).toFixed(0)}M - ${(opt.maxAmount / 1000000).toFixed(0)}M COP
                      </span>
                    </div>
                  </div>

                  {/* Estimación de Cuota para el monto de necesidad */}
                  {opt.rateEA > 0 && need?.amount && (
                    <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-indigo-700 block font-medium">
                          Cuota aprox. ({need.termMonths}m):
                        </span>
                        <span className="font-bold text-indigo-950 text-sm">
                          {formatCOP(estimatedInstallment)} / mes
                        </span>
                      </div>
                      <span className="text-[10px] bg-indigo-200 text-indigo-900 font-semibold px-1.5 py-0.5 rounded">
                        Estimada
                      </span>
                    </div>
                  )}

                  {/* Requisitos clave (2 bullets) */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 block">Requisitos clave:</span>
                    {opt.requirements.slice(0, 2).map((req, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 rounded-b-2xl flex items-center gap-2">
                  <button
                    onClick={() => onToggleCompare(opt.id)}
                    className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Seleccionada</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Comparar</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onSelectForSimulation(opt)}
                    className="py-2 px-3 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors flex items-center gap-1"
                    title="Simular cuotas con esta opción"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Simular</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Compare Action Bar (Sticky at Bottom when items selected) */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-3xl bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-bounce-short">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-xs font-bold">
              {selectedForCompare.length}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold">
                {selectedForCompare.length === 1 ? '1 alternativa seleccionada' : `${selectedForCompare.length} alternativas seleccionadas`}
              </p>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Compara tasas, ventajas, desventajas y costos lado a lado (HU-07).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCompare}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/30 flex items-center gap-1.5"
            >
              <span>Ver Comparativa (HU-07)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
