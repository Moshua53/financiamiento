import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Search, SlidersHorizontal, ArrowUpRight, 
  ShieldCheck, AlertTriangle, ShieldAlert, 
  Briefcase, RefreshCw, MapPin, LayoutGrid, Table, Calendar, Users
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  formatCOP, 
  calculateMonthlyPayment, 
  evaluateFinancialCapacity 
} from '../utils/financialCalculations';
import EmprendimientoDetailModal from './EmprendimientoDetailModal';

export default function FinancierDashboard() {
  const { user, profile } = useAuth();
  
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('Todos');
  const [selectedRisk, setSelectedRisk] = useState('Todos'); // 'Todos' | 'A-1' | 'B-2' | 'C-3'
  const [maxAmountFilter, setMaxAmountFilter] = useState(150000000);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'grid'
  const [selectedEmprendimiento, setSelectedEmprendimiento] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Consulta de solicitudes en Supabase con fallback local
  const fetchEmprendimientos = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('emprendimientos')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setEmprendimientos(data);
          setLoading(false);
          return;
        }
      }

      const localSaved = localStorage.getItem('financia_local_emprendimientos');
      let saved = [];
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed)) saved = parsed;
        } catch {
          // ignore
        }
      }
      setEmprendimientos(saved);
    } catch (err) {
      console.warn('Error cargando solicitudes:', err);
      setEmprendimientos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmprendimientos();
  }, []);

  const sectors = useMemo(() => {
    const set = new Set(emprendimientos.map(e => e.sector));
    return ['Todos', ...Array.from(set)];
  }, [emprendimientos]);

  // Filtrado reactivo con semántica de riesgo A-1, B-2, C-3
  const filteredList = useMemo(() => {
    return emprendimientos.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.founder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSector = selectedSector === 'Todos' || item.sector === selectedSector;
      const matchesAmount = Number(item.amount) <= maxAmountFilter;

      // Evaluación del riesgo
      const monthlyPayment = calculateMonthlyPayment(
        item.amount, 
        item.max_acceptable_rate || 22.0, 
        item.term_months || 12
      );
      const capacity = evaluateFinancialCapacity(monthlyPayment, item.monthly_sales, item.monthly_costs);
      const matchesRisk = selectedRisk === 'Todos' || capacity.code === selectedRisk;

      return matchesSearch && matchesSector && matchesAmount && matchesRisk;
    });
  }, [emprendimientos, searchQuery, selectedSector, selectedRisk, maxAmountFilter]);

  // Métricas de mercado en tipografía mono
  const stats = useMemo(() => {
    const totalSolicitudes = emprendimientos.length;
    const totalCapital = emprendimientos.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const avgTicket = totalSolicitudes > 0 ? totalCapital / totalSolicitudes : 0;
    const totalRates = emprendimientos.reduce((acc, curr) => acc + (Number(curr.max_acceptable_rate) || 22), 0);
    const avgRate = totalSolicitudes > 0 ? totalRates / totalSolicitudes : 0;

    return { totalSolicitudes, totalCapital, avgTicket, avgRate };
  }, [emprendimientos]);

  const handleOpenDetail = (emp) => {
    setSelectedEmprendimiento(emp);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Encabezado */}
      <div className="border-b border-neutral-200 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              Solicitudes de financiación
            </h1>
          </div>

          <button
            onClick={fetchEmprendimientos}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer self-start md:self-auto shadow-subtle"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded border border-neutral-200 shadow-subtle">
          <span className="text-[11px] text-neutral-500 block">
            Solicitudes activas
          </span>
          <span className="text-2xl font-bold font-finance tabular-nums text-neutral-900 mt-1 block">
            {stats.totalSolicitudes}
          </span>
        </div>

        <div className="bg-white p-4 rounded border border-neutral-200 shadow-subtle">
          <span className="text-[11px] text-neutral-500 block">
            Capital solicitado
          </span>
          <span className="text-2xl font-bold font-finance tabular-nums text-neutral-900 mt-1 block">
            ${(stats.totalCapital / 1000000).toFixed(0)}M COP
          </span>
        </div>

        <div className="bg-white p-4 rounded border border-neutral-200 shadow-subtle">
          <span className="text-[11px] text-neutral-500 block">
            Ticket promedio
          </span>
          <span className="text-2xl font-bold font-finance tabular-nums text-neutral-900 mt-1 block">
            ${(stats.avgTicket / 1000000).toFixed(1)}M COP
          </span>
        </div>

        <div className="bg-white p-4 rounded border border-neutral-200 shadow-subtle">
          <span className="text-[11px] text-neutral-500 block">
            Tasa promedio
          </span>
          <span className="text-2xl font-bold font-finance tabular-nums text-neutral-900 mt-1 block">
            {stats.avgRate.toFixed(1)}% E.A.
          </span>
        </div>
      </div>

      {/* Barra de Herramientas Analítica: Filtros y Conmutador de Vista */}
      <div className="bg-white p-4 rounded border border-neutral-200 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Búsqueda textual */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por razón social, fundador, sector o ciudad..."
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro de Calificación de Riesgo */}
          <div className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1.5 rounded border border-neutral-200 text-xs">
            <span className="text-neutral-500 text-[11px] font-mono">Riesgo:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-transparent text-neutral-900 text-xs font-semibold outline-none cursor-pointer"
            >
              <option value="Todos">Todos (A-1, B-2, C-3)</option>
              <option value="A-1">A-1 / Solvencia Alta (≤20%)</option>
              <option value="B-2">B-2 / Vigilancia (20-35%)</option>
              <option value="C-3">C-3 / Límite Excedido (&gt;35%)</option>
            </select>
          </div>

          {/* Filtro de Sector */}
          <div className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1.5 rounded border border-neutral-200 text-xs">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-transparent text-neutral-800 text-xs font-medium outline-none cursor-pointer"
            >
              {sectors.map(sec => (
                <option key={sec} value={sec}>
                  {sec === 'Todos' ? 'Todos los Sectores' : sec}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Monto Máximo */}
          <div className="flex items-center gap-2 bg-neutral-50 px-2.5 py-1.5 rounded border border-neutral-200 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <span className="font-mono text-[11px] text-neutral-700">
              Hasta ${(maxAmountFilter / 1000000).toFixed(0)}M COP
            </span>
            <input
              type="range"
              min={10000000}
              max={150000000}
              step={5000000}
              value={maxAmountFilter}
              onChange={(e) => setMaxAmountFilter(Number(e.target.value))}
              className="w-16 h-1 accent-neutral-900 cursor-pointer"
            />
          </div>

          {/* Conmutador de Vista: Tarjetas vs Data Grid */}
          <div className="flex items-center rounded border border-neutral-200 bg-neutral-100 p-0.5">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Vista en Tarjetas de Análisis"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Vista en Tabla Densa (Data Grid)"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Listado de Oportunidades: Tarjetas o Data Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500 bg-white rounded border border-neutral-200">
          Cargando solicitudes...
        </div>
      ) : emprendimientos.length === 0 ? (
        <div className="bg-white p-12 rounded border border-neutral-200 text-center space-y-2">
          <Building2 className="w-8 h-8 text-neutral-400 mx-auto" />
          <h3 className="font-semibold text-neutral-900 text-sm">Aún no hay solicitudes</h3>
          <p className="text-xs text-neutral-500">
            Cuando un emprendedor publique su solicitud, aparecerá aquí.
          </p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white p-12 rounded border border-neutral-200 text-center space-y-3">
          <Building2 className="w-8 h-8 text-neutral-400 mx-auto" />
          <h3 className="font-semibold text-neutral-900 text-sm">No hay solicitudes con los filtros aplicados</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Prueba ajustando los rangos de riesgo, sector económico o monto máximo para ampliar el pipeline.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedSector('Todos'); setSelectedRisk('Todos'); setMaxAmountFilter(150000000); }}
            className="px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded border border-neutral-200 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* VISTA 1: Data Grid (Tabla Densa de Proyectos) */
        <div className="bg-white rounded border border-neutral-200 shadow-subtle overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-100/70 border-b border-neutral-200 text-neutral-600 text-[11px]">
                <th className="py-2.5 px-3">Razón Social & Fundador</th>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3">Calificación</th>
                <th className="py-2.5 px-3 text-right">Monto</th>
                <th className="py-2.5 px-3 text-right">Plazo</th>
                <th className="py-2.5 px-3 text-right">Ventas / mes</th>
                <th className="py-2.5 px-3 text-right">Cuota Proyectada</th>
                <th className="py-2.5 px-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredList.map((emp) => {
                const sales = Number(emp.monthly_sales) || 0;
                const costs = Number(emp.monthly_costs) || 0;
                const amount = Number(emp.amount) || 0;
                const term = Number(emp.term_months) || 12;
                const rateEA = Number(emp.max_acceptable_rate) || 22.0;
                const monthlyPayment = calculateMonthlyPayment(amount, rateEA, term);
                const capacity = evaluateFinancialCapacity(monthlyPayment, sales, costs);

                return (
                  <tr key={emp.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-2 px-3">
                      <span className="font-bold text-neutral-900 block truncate max-w-[200px]">{emp.name}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{emp.founder} • {emp.city}</span>
                    </td>
                    <td className="py-2 px-3 text-neutral-700 text-[11px] whitespace-nowrap">{emp.sector}</td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${capacity.badgeClasses}`}>
                        <span>{capacity.code}</span>
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-finance font-bold tabular-nums text-neutral-900 whitespace-nowrap">
                      {formatCOP(amount)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-neutral-600 whitespace-nowrap">
                      {term}m
                    </td>
                    <td className="py-2 px-3 text-right font-finance tabular-nums text-neutral-700 whitespace-nowrap">
                      {formatCOP(sales)}
                    </td>
                    <td className="py-2 px-3 text-right font-finance font-semibold tabular-nums text-emerald-800 whitespace-nowrap">
                      {formatCOP(monthlyPayment)}
                    </td>
                    <td className="py-2 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetail(emp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <span>Ficha</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* VISTA 2: Tarjetas de Análisis de Oportunidad */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((emp) => {
            const sales = Number(emp.monthly_sales) || 0;
            const costs = Number(emp.monthly_costs) || 0;
            const netFlow = sales - costs;
            const margin = sales > 0 ? ((netFlow / sales) * 100).toFixed(0) : 0;
            const amount = Number(emp.amount) || 0;
            const term = Number(emp.term_months) || 12;
            const rateEA = Number(emp.max_acceptable_rate) || 22.0;
            const monthlyPayment = calculateMonthlyPayment(amount, rateEA, term);
            const capacity = evaluateFinancialCapacity(monthlyPayment, sales, costs);

            return (
              <div
                key={emp.id}
                className="bg-white rounded border border-neutral-200 shadow-subtle hover:border-neutral-300 transition-colors flex flex-col justify-between overflow-hidden"
              >
                {/* Cabecera de la Tarjeta */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {emp.sector}
                    </span>
                    
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${capacity.badgeClasses}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        capacity.color === 'emerald' ? 'bg-emerald-600' :
                        capacity.color === 'amber' ? 'bg-amber-600' : 'bg-rose-600'
                      }`} />
                      <span>{capacity.pillLabel}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 truncate">
                      {emp.name}
                    </h3>
                    <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                      <span>{emp.founder}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        {emp.city}
                      </span>
                    </p>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {emp.description || 'Sin descripción detallada de propuesta de valor.'}
                  </p>

                  {/* Rejilla 2x2 de Métricas Clave */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded bg-neutral-50 border border-neutral-200 text-xs">
                    <div>
                      <span className="text-[11px] text-neutral-400 block">Monto Solicitado</span>
                      <span className="font-finance font-bold tabular-nums text-neutral-900 block mt-0.5">
                        {formatCOP(amount)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-neutral-400 block">Plazo de Pago</span>
                      <span className="font-mono font-medium text-neutral-800 block mt-0.5">
                        {term} meses
                      </span>
                    </div>

                    <div className="pt-2 border-t border-neutral-200">
                      <span className="text-[11px] text-neutral-400 block">Ventas Mensuales</span>
                      <span className="font-finance tabular-nums text-neutral-700 block mt-0.5">
                        {formatCOP(sales)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-neutral-200">
                      <span className="text-[11px] text-neutral-400 block">Cuota Proyectada</span>
                      <span className="font-finance font-bold tabular-nums text-emerald-800 block mt-0.5">
                        {formatCOP(monthlyPayment)}
                      </span>
                    </div>
                  </div>

                  {/* Barra de apalancamiento sobre flujo operativo */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                      <span>Carga sobre facturación:</span>
                      <span className="font-bold text-neutral-900">{capacity.debtRatio}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${Math.min(100, Number(capacity.debtRatio))}%` }} 
                        className={`h-full ${
                          capacity.color === 'emerald' ? 'bg-emerald-600' :
                          capacity.color === 'amber' ? 'bg-amber-600' : 'bg-rose-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Pie de Ficha con Acción */}
                <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-neutral-500">
                    Etapa: {emp.stage}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenDetail(emp)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <span>Auditar Ficha</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detalle de la solicitud */}
      <EmprendimientoDetailModal
        emprendimiento={selectedEmprendimiento}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

    </div>
  );
}
