import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Stepper from './components/Stepper';
import ProfileStep from './components/ProfileStep';
import NeedStep from './components/NeedStep';
import CatalogStep from './components/CatalogStep';
import CompareModal from './components/CompareModal';
import SimulatorView from './components/SimulatorView';
import AuthGate from './components/AuthGate';
import FinancierDashboard from './components/FinancierDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

import { 
  mockFinancingOptions, 
  mockDefaultProfile, 
  mockDefaultNeed 
} from './data/mockFinancingOptions';

function AppContent() {
  const { user, role, loading } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);
  const [profile, setProfile] = useState(mockDefaultProfile);
  const [need, setNeed] = useState(mockDefaultNeed);
  const [selectedForCompare, setSelectedForCompare] = useState(['bancolombia-pyme', 'sempli-fintech']);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [activeOptionForSim, setActiveOptionForSim] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Limpieza inicial de preferencias residuales de tema
  useEffect(() => {
    try {
      localStorage.removeItem('theme_preference');
      document.documentElement.classList.remove('dark');
    } catch {
      // ignore
    }
  }, []);

  const showNotification = (msg, type = 'info') => {
    setNotification({ text: msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Cargar automáticamente el emprendimiento guardado en Supabase si el usuario ya registró uno
  useEffect(() => {
    if (role !== 'emprendedor' || !user) return;

    const loadSavedData = async () => {
      try {
        if (isSupabaseConfigured && supabase && !user.id.startsWith('demo-')) {
          const { data, error } = await supabase
            .from('emprendimientos')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!error && data) {
            setProfile({
              name: data.name,
              founder: data.founder,
              sector: data.sector,
              stage: data.stage,
              city: data.city,
              yearsOperating: data.years_operating,
              employees: data.employees,
              monthlySales: Number(data.monthly_sales),
              monthlyCosts: Number(data.monthly_costs),
              description: data.description || '',
            });
            setNeed({
              amount: Number(data.amount),
              termMonths: Number(data.term_months),
              purpose: data.purpose,
              purposeDetails: data.purpose_details || '',
              maxAcceptableRate: Number(data.max_acceptable_rate) || 24,
            });
            setMaxUnlockedStep(4);
            showNotification('Proyecto cargado', 'success');
          }
        }
      } catch (err) {
        console.warn('Error al consultar proyecto guardado:', err);
      }
    };

    loadSavedData();
  }, [user, role]);

  const handleLoadDemo = () => {
    setProfile(mockDefaultProfile);
    setNeed(mockDefaultNeed);
    setSelectedForCompare(['bancolombia-pyme', 'sempli-fintech']);
    setMaxUnlockedStep(4);
    showNotification('Datos de prueba cargados', 'success');
  };

  const handleReset = () => {
    setProfile({
      name: '',
      founder: '',
      sector: 'Tecnología y Software',
      stage: 'Idea / Prototipo',
      city: '',
      yearsOperating: 0,
      employees: 1,
      monthlySales: 0,
      monthlyCosts: 0,
      description: ''
    });
    setNeed({
      amount: 15000000,
      termMonths: 12,
      purpose: 'Capital de Trabajo',
      purposeDetails: '',
      maxAcceptableRate: 22.0
    });
    setSelectedForCompare([]);
    setActiveOptionForSim(null);
    setCurrentStep(1);
    setMaxUnlockedStep(1);
    showNotification('Formulario restablecido', 'info');
  };

  const handleToggleCompare = (id) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        showNotification('Puedes comparar máximo 3 opciones', 'warning');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSelectForSimulation = (option) => {
    setActiveOptionForSim(option);
    setMaxUnlockedStep(prev => Math.max(prev, 4));
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Guardar y publicar solicitud de emprendimiento en Supabase
  const handlePublish = async () => {
    if (!profile.name || !profile.founder) {
      showNotification('Completa el nombre de la empresa y el fundador antes de publicar.', 'warning');
      setCurrentStep(1);
      return;
    }

    setIsPublishing(true);
    const newRecord = {
      name: profile.name,
      founder: profile.founder,
      sector: profile.sector || 'Tecnología y Software',
      stage: profile.stage || 'Idea / Prototipo',
      city: profile.city || 'Bogotá D.C.',
      years_operating: Number(profile.yearsOperating) || 0,
      employees: Number(profile.employees) || 1,
      monthly_sales: Number(profile.monthlySales) || 0,
      monthly_costs: Number(profile.monthlyCosts) || 0,
      description: profile.description || '',
      amount: Number(need.amount) || 15000000,
      term_months: Number(need.termMonths) || 12,
      purpose: need.purpose || 'Capital de Trabajo',
      purpose_details: need.purposeDetails || '',
      max_acceptable_rate: Number(need.maxAcceptableRate) || 24,
      status: 'activo',
    };

    try {
      if (isSupabaseConfigured && supabase && user && !user.id.startsWith('demo-')) {
        const { error } = await supabase.from('emprendimientos').insert({
          ...newRecord,
          user_id: user.id,
        });
        if (error) throw error;
      }

      // Sincronizar también en almacenamiento local para disponibilidad inmediata
      const localSaved = localStorage.getItem('financia_local_emprendimientos');
      let list = [];
      if (localSaved) {
        try { list = JSON.parse(localSaved); } catch { list = []; }
      }
      const demoId = `emp-${Date.now()}`;
      list.unshift({ ...newRecord, id: demoId, created_at: new Date().toISOString() });
      localStorage.setItem('financia_local_emprendimientos', JSON.stringify(list));

      showNotification('Solicitud publicada con éxito. Visible en la mesa de financiadores.', 'success');
    } catch (err) {
      console.error('Error publicando emprendimiento:', err);
      showNotification(`Error al publicar: ${err.message || 'Intenta de nuevo'}`, 'danger');
    } finally {
      setIsPublishing(false);
    }
  };

  // 1. Estado de Carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        <div className="text-center space-y-2">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <p className="text-xs text-neutral-400">
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  // 2. Si no hay sesión autenticada -> mostrar AuthGate
  if (!user) {
    return <AuthGate />;
  }

  // 3. Si el rol es Financiador -> Dashboard de Financiador
  if (role === 'financiador') {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
        
        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-16 right-4 z-50 bg-neutral-900 text-white px-3.5 py-2.5 rounded border border-neutral-700 shadow-elevated text-xs font-medium flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {notification.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
            {notification.type === 'danger' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-neutral-400 shrink-0" />}
            <span>{notification.text}</span>
          </div>
        )}

        {/* Navbar para Financiador */}
        <Navbar />

        {/* Main Content: Dashboard de Financiador */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <FinancierDashboard />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-neutral-200 py-6 text-xs text-neutral-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-bold text-neutral-900 text-sm tracking-tight">
                  financia<span className="text-emerald-600 font-bold">+</span>
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Equipo de Desarrollo: Moises Joshua Herrera Galindo • Juan Sebastián Molina Ballesteros • Miguel Angel Gallego Franco • Sebastián Rendón Grisales
              </p>
            </div>
          </div>
        </footer>

      </div>
    );
  }

  // 4. Si el rol es Emprendedor -> Flujo de 4 pasos
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 bg-neutral-900 text-white px-3.5 py-2.5 rounded border border-neutral-700 shadow-elevated text-xs font-medium flex items-center gap-2">
          {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {notification.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
          {notification.type === 'danger' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {notification.type === 'info' && <Info className="w-4 h-4 text-neutral-400 shrink-0" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Navbar Superior con botón Publicar */}
      <Navbar
        currentStep={currentStep}
        setCurrentStep={(step) => {
          if (step <= maxUnlockedStep) {
            setCurrentStep(step);
          } else {
            showNotification('Completa el paso anterior para continuar', 'warning');
          }
        }}
        onLoadDemo={handleLoadDemo}
        onReset={handleReset}
        profile={profile}
        need={need}
        onPublish={handlePublish}
        isPublishing={isPublishing}
      />

      {/* Stepper de navegación técnica */}
      <Stepper
        currentStep={currentStep}
        setCurrentStep={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        maxUnlockedStep={maxUnlockedStep}
        onLockedClick={(stepId) => {
          showNotification('Completa el paso actual para continuar', 'warning');
        }}
      />

      {/* Contenido Principal (4 Pasos para el Emprendedor) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentStep === 1 && (
          <ProfileStep
            profile={profile}
            setProfile={setProfile}
            onNext={() => {
              setMaxUnlockedStep(prev => Math.max(prev, 2));
              setCurrentStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 2 && (
          <NeedStep
            need={need}
            setNeed={setNeed}
            profile={profile}
            onNext={() => {
              setMaxUnlockedStep(prev => Math.max(prev, 3));
              setCurrentStep(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBack={() => {
              setCurrentStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 3 && (
          <CatalogStep
            options={mockFinancingOptions}
            need={need}
            selectedForCompare={selectedForCompare}
            onToggleCompare={handleToggleCompare}
            onOpenCompare={() => setIsCompareOpen(true)}
            onSelectForSimulation={handleSelectForSimulation}
            onNext={() => {
              setMaxUnlockedStep(prev => Math.max(prev, 4));
              setCurrentStep(4);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBack={() => {
              setCurrentStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 4 && (
          <SimulatorView
            options={mockFinancingOptions}
            profile={profile}
            need={need}
            activeOption={activeOptionForSim}
            setActiveOption={setActiveOptionForSim}
            onBackToCatalog={() => {
              setCurrentStep(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Modal Comparativo Paralelo */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        selectedIds={selectedForCompare}
        options={mockFinancingOptions}
        need={need}
        onSelectForSimulation={handleSelectForSimulation}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-6 text-xs text-neutral-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-bold text-neutral-900 text-sm tracking-tight">
                financia<span className="text-emerald-600 font-bold">+</span>
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Equipo de Desarrollo: Moises Joshua Herrera Galindo • Juan Sebastián Molina Ballesteros • Miguel Angel Gallego Franco • Sebastián Rendón Grisales
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}