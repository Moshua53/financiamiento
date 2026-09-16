import React, { useState, useMemo } from 'react';
import { 
  Layers, Search, Filter, Check, Plus, ExternalLink, Calculator, 
  Sparkles, CheckCircle2, ArrowRight, Clock, ShieldCheck, Tag, X
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

  // Filtrado reactivo de opciones (HU-06)
  const filteredOptions = useMemo(() => {
    return options.filter(opt => {
      if (selectedCategory !== 'Todas' && opt.category !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = opt.name.toLowerCase().includes(query);
        const matchesInst = opt.institution.toLowerCase().includes(query);
        const matchesDesc = opt.description.toLowerCase().includes(query);
        if (!matchesName && !matchesInst && !matchesDesc) return false;
      }
      if (onlyMatchAmount && need?.amount) {
        if (need.amount < opt.minAmount || need.amount > opt.maxAmount) {
          return false;
        }
      }
      return true;
    });
  }, [options, selectedCategory, searchTerm, onlyMatchAmount, need]);

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Control Bar: Filtros, Búsqueda y Acceso a Simulador */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por entidad o palabra clave (ej: Bancolombia, Sempli, Subsidio)..."
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Amount match filter toggle */}
            <label className="inline-flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer select-none bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-500/40 transition-colors">
              <input
                type="checkbox"
                checked={onlyMatchAmount}
                onChange={(e) => setOnlyMatchAmount(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 shrink-0"
              />
              <span className="truncate">Solo alternativas para mi monto ({formatCOP(need?.amount)})</span>
            </label>

            {/* Quick Access to General Simulator */}
            <button
              onClick={() => onSelectForSimulation(null)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Simulador General</span>
            </button>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all select-none ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-glow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Financing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOptions.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
            <Layers className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-lg">
              No hay alternativas con los filtros aplicados
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Desmarca el filtro de monto o prueba con otra categoría para visualizar más opciones de financiamiento.
            </p>
            <button
              onClick={() => { setSelectedCategory('Todas'); setSearchTerm(''); setOnlyMatchAmount(false); }}
              className="px-4 py-2 bg-emerald-500/10 text-emerald-500 font-bold text-xs rounded-xl hover:bg-emerald-500/20 transition-colors"
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
                className={`bg-white rounded-3xl border-2 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                  isSelected 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-glow-sm' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Top */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        {opt.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg mt-2 leading-snug">
                        {opt.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {opt.institution}
                      </p>
                    </div>

                    {opt.badge && (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-500/30 shrink-0">
                        {opt.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {opt.description}
                  </p>

                  {/* Financial Data Strip */}
                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Tasa Referencial</span>
                      <span className="font-black text-slate-900 text-sm font-mono mt-0.5 block">
                        {opt.rateEA === 0 ? '0% (Semilla/Equity)' : `${opt.rateEA}% E.A.`}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Tiempo Respuesta</span>
                      <span className="font-semibold text-slate-800 text-xs flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {opt.approvalTime}
                      </span>
                    </div>

                    <div className="col-span-2 pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Rango montos:</span>
                      <span className="font-bold text-slate-800 font-mono">
                        ${(opt.minAmount / 1000000).toFixed(0)}M - ${(opt.maxAmount / 1000000).toFixed(0)}M COP
                      </span>
                    </div>
                  </div>

                  {/* Estimación de cuota si aplica */}
                  {opt.rateEA > 0 && need?.amount && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-emerald-700 block font-semibold">
                          Cuota aprox. ({need.termMonths}m):
                        </span>
                        <span className="font-black text-slate-950 text-sm font-mono tabular-nums">
                          {formatCOP(estimatedInstallment)} / mes
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-md">
                        Simulada
                      </span>
                    </div>
                  )}

                  {/* Requisitos clave */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Requisitos clave:
                    </span>
                    {opt.requirements.slice(0, 2).map((req, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 rounded-b-3xl flex items-center gap-2">
                  <button
                    onClick={() => onToggleCompare(opt.id)}
                    className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 select-none ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-glow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500/50'
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
                    className="py-2.5 px-3.5 text-xs font-bold text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors flex items-center gap-1.5"
                    title="Simular en tiempo real"
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

      {/* Floating Compare Drawer (Sticky at Bottom) */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-1.5rem)] max-w-3xl bg-slate-900 text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-slate-700/60 flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black shrink-0">
              {selectedForCompare.length}
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white truncate">
                {selectedForCompare.length === 1 ? '1 para comparar' : `${selectedForCompare.length} para comparar`}
              </p>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Contrasta costos, plazos y requisitos lado a lado.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCompare}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-2xl transition-all shadow-glow-sm flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer"
          >
            <span>Ver Comparativa</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}
    </div>
  );
}