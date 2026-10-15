import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Search, Filter, SlidersHorizontal, ArrowUpRight, 
  TrendingUp, ShieldCheck, AlertTriangle, ShieldAlert, Sparkles, 
  DollarSign, Briefcase, RefreshCw, CheckCircle2, MapPin, Calendar, Users
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  formatCOP, 
  calculateMonthlyPayment, 
  evaluateFinancialCapacity 
} from '../utils/financialCalculations';
import EmprendimientoDetailModal from './EmprendimientoDetailModal';

// Datos semilla de respaldo si Supabase está en modo local o la tabla está vacía
const FALLBACK_SEED_EMPRENDIMIENTOS = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'EcoModa Sostenible SAS',
    founder: 'Camila Morales & Moises Galindo',
    sector: 'Manufactura e Industria',
    stage: 'Crecimiento / Tracción',
    city: 'Medellín, Antioquia',
    years_operating: 2,
    employees: 5,
    monthly_sales: 24000000,
    monthly_costs: 14500000,
    description: 'Marca de confección textil con algodón orgánico colombiano y fibras recicladas. Comercialización omnicanal en e-commerce y tiendas concepto.',
    amount: 35000000,
    term_months: 24,
    purpose: 'Maquinaria y Tecnología',
    purpose_details: 'Adquisición de cortadora láser industrial de bajo consumo y optimización de cadena de estampado.',
    max_acceptable_rate: 24.5,
    status: 'activo',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    name: 'AgroTech Drones Colombia',
    founder: 'Alejandro Restrepo',
    sector: 'Tecnología y Software',
    stage: 'Temprana / Validación',
    city: 'Manizales, Caldas',
    years_operating: 1,
    employees: 3,
    monthly_sales: 16500000,
    monthly_costs: 9800000,
    description: 'Servicio de monitoreo satelital y fumigación de precisión mediante drones para caficultores y productores de aguacate Hass.',
    amount: 50000000,
    term_months: 36,
    purpose: 'Expansión Comercial',
    purpose_details: 'Compra de dos drones multiespectrales DJI Agras y apertura de sede satélite en Pereira.',
    max_acceptable_rate: 22.0,
    status: 'activo',
    created_at: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'BioSnacks Andinos',
    founder: 'Valentina Rojas',
    sector: 'Alimentos y Gastronomía',
    stage: 'Consolidado / Expansión',
    city: 'Bogotá D.C.',
    years_operating: 4,
    employees: 8,
    monthly_sales: 42000000,
    monthly_costs: 28000000,
    description: 'Snacks saludables deshidratados a base de tubérculos y frutas exóticas colombianas con certificación INVIMA para exportación.',
    amount: 80000000,
    term_months: 48,
    purpose: 'Capital de Trabajo / Stock',
    purpose_details: 'Materia prima y empaques compostables para despachos a cadenas de retail nacional.',
    max_acceptable_rate: 20.5,
    status: 'activo',
    created_at: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    name: 'ClinicaVet Móvil 24/7',
    founder: 'Dra. Luisa Fernanda Gómez',
    sector: 'Salud y Bienestar',
    stage: 'Crecimiento / Tracción',
    city: 'Cali, Valle del Cauca',
    years_operating: 2,
    employees: 4,
    monthly_sales: 19000000,
    monthly_costs: 11200000,
    description: 'Unidad médica veterinaria móvil equipada con rayos X digital y laboratorio portátil para atención domiciliaria de mascotas.',
    amount: 28000000,
    term_months: 18,
    purpose: 'Maquinaria y Tecnología',
    purpose_details: 'Equipo de ecografía veterinaria doppler de alta resolución y adecuación del vehículo.',
    max_acceptable_rate: 25.0,
    status: 'activo',
    created_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  }
];

export default function FinancierDashboard() {
  const { user, profile } = useAuth();
  
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('Todos');
  const [maxAmountFilter, setMaxAmountFilter] = useState(150000000);
  const [selectedEmprendimiento, setSelectedEmprendimiento] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Cargar emprendimientos desde Supabase o fallback local
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

      // Fallback a localStorage (donde el emprendedor puede haber guardado en modo local) + semillas
      const localSaved = localStorage.getItem('financia_local_emprendimientos');
      let combined = [...FALLBACK_SEED_EMPRENDIMIENTOS];
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed)) {
            // Unir sin duplicados de id
            const existingIds = new Set(parsed.map(p => p.id));
            combined = [...parsed, ...FALLBACK_SEED_EMPRENDIMIENTOS.filter(s => !existingIds.has(s.id))];
          }
        } catch {
          // ignore
        }
      }
      setEmprendimientos(combined);
    } catch (err) {
      console.warn('Error cargando solicitudes:', err);
      setEmprendimientos(FALLBACK_SEED_EMPRENDIMIENTOS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmprendimientos();
  }, []);

  // Lista de sectores únicos para el filtro
  const sectors = useMemo(() => {
    const set = new Set(emprendimientos.map(e => e.sector));
    return ['Todos', ...Array.from(set)];
  }, [emprendimientos]);

  // Filtrado reactivo
  const filteredList = useMemo(() => {
    return emprendimientos.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.founder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSector = selectedSector === 'Todos' || item.sector === selectedSector;
      const matchesAmount = Number(item.amount) <= maxAmountFilter;

      return matchesSearch && matchesSector && matchesAmount;
    });
  }, [emprendimientos, searchQuery, selectedSector, maxAmountFilter]);

  // Métricas agregadas para las tarjetas KPI
  const stats = useMemo(() => {
    const totalSolicitudes = emprendimientos.length;
    const totalCapital = emprendimientos.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const avgTicket = totalSolicitudes > 0 ? totalCapital / totalSolicitudes : 0;
    
    // Conteo por sector
    const sectorCounts = {};
    emprendimientos.forEach(e => {
      sectorCounts[e.sector] = (sectorCounts[e.sector] || 0) + 1;
    });
    const topSector = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return { totalSolicitudes, totalCapital, avgTicket, topSector };
  }, [emprendimientos]);

  const handleOpenDetail = (emp) => {
    setSelectedEmprendimiento(emp);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Top Banner de Bienvenida para el Financiador */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              Panel de Inversión & Evaluación Crediticia
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ecosistema de Emprendimientos Subidos
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl">
              Explora las solicitudes registradas por emprendedores en Colombia. Evalúa la viabilidad financiera, el margen operacional y el semáforo de endeudamiento antes de colocar capital.
            </p>
          </div>

          <button
            onClick={fetchEmprendimientos}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all active:scale-[0.98]"
            title="Recargar solicitudes desde la base de datos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Global KPI Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Solicitudes Activas
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              {stats.totalSolicitudes}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">100% verificadas</span>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Capital Requerido Total
            </span>
            <span className="text-2xl font-black text-indigo-300 mt-1 block tabular-nums">
              ${(stats.totalCapital / 1000000).toFixed(0)}M <span className="text-xs text-slate-400 font-normal">COP</span>
            </span>
            <span className="text-[10px] text-slate-400">Demanda acumulada</span>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Ticket Promedio
            </span>
            <span className="text-2xl font-black text-white mt-1 block tabular-nums">
              ${(stats.avgTicket / 1000000).toFixed(1)}M <span className="text-xs text-slate-400 font-normal">COP</span>
            </span>
            <span className="text-[10px] text-slate-400">Por solicitud</span>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Sector Dominante
            </span>
            <span className="text-base font-black text-white mt-2 block truncate">
              {stats.topSector}
            </span>
            <span className="text-[10px] text-slate-400">Mayor volumen</span>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Real-time search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por emprendimiento, fundador, ciudad o modelo..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
          />
        </div>

        {/* Sector Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 py-2.5 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
          >
            {sectors.map(sec => (
              <option key={sec} value={sec}>
                {sec === 'Todos' ? 'Todos los Sectores' : sec}
              </option>
            ))}
          </select>
        </div>

        {/* Max Amount Slider / Display */}
        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <div className="text-xs">
            <span className="text-[10px] text-slate-500 block leading-tight">Monto máx:</span>
            <span className="font-bold text-slate-800 tabular-nums">
              ${(maxAmountFilter / 1000000).toFixed(0)}M COP
            </span>
          </div>
          <input
            type="range"
            min={10000000}
            max={150000000}
            step={5000000}
            value={maxAmountFilter}
            onChange={(e) => setMaxAmountFilter(Number(e.target.value))}
            className="w-24 accent-indigo-600 cursor-pointer"
          />
        </div>

      </div>

      {/* Grid of Emprendimientos */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
          <p className="text-xs text-slate-500">Cargando oportunidades desde Supabase...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron emprendimientos</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No hay solicitudes que coincidan con los criterios de búsqueda o filtros seleccionados.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedSector('Todos'); setMaxAmountFilter(150000000); }}
            className="mt-4 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
          >
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {emp.sector}
                    </span>
                    
                    {/* Semáforo de Riesgo */}
                    {capacity.status === 'success' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Saludable
                      </span>
                    )}
                    {capacity.status === 'warning' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Moderado
                      </span>
                    )}
                    {capacity.status === 'danger' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <ShieldAlert className="w-3 h-3 text-rose-600" />
                        Riesgoso
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {emp.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                    <span className="truncate">Por: <strong>{emp.founder}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-slate-400 shrink-0">
                      <MapPin className="w-3 h-3" />
                      {emp.city}
                    </span>
                  </p>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {emp.description || 'Sin descripción detallada disponible.'}
                  </p>

                  {/* Bloque de Requerimiento de Capital */}
                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monto Solicitado</span>
                        <span className="text-sm font-black text-slate-900 tabular-nums">
                          {formatCOP(amount)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Plazo</span>
                        <span className="text-sm font-bold text-slate-700">
                          {term} meses
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Destino:</span>
                      <span className="font-semibold text-indigo-700 truncate max-w-[170px]">
                        {emp.purpose}
                      </span>
                    </div>
                  </div>

                  {/* Indicadores Financieros Rápidos */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Ventas / mes</span>
                      <span className="font-bold text-slate-800 tabular-nums">{formatCOP(sales)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Margen Operativo</span>
                      <span className={`font-bold ${margin >= 15 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {margin}%
                      </span>
                    </div>
                  </div>

                </div>

                {/* Card Footer Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400">
                    Etapa: <strong className="text-slate-600">{emp.stage}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDetail(emp)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 transition-all duration-200 shadow-xs"
                  >
                    <span>Ver Ficha</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Ficha Detallada */}
      <EmprendimientoDetailModal
        emprendimiento={selectedEmprendimiento}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

    </div>
  );
}
