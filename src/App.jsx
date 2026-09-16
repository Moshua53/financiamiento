import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Stepper from './components/Stepper';
import ProfileStep from './components/ProfileStep';
import NeedStep from './components/NeedStep';
import CatalogStep from './components/CatalogStep';
import CompareModal from './components/CompareModal';
import SimulatorView from './components/SimulatorView';

import { 
  mockFinancingOptions, 
  mockDefaultProfile, 
  mockDefaultNeed 
} from './data/mockFinancingOptions';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);
  const [profile, setProfile] = useState(mockDefaultProfile);
  const [need, setNeed] = useState(mockDefaultNeed);
  const [selectedForCompare, setSelectedForCompare] = useState(['bancolombia-pyme', 'sempli-fintech']);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [activeOptionForSim, setActiveOptionForSim] = useState(null);
  const [notification, setNotification] = useState(null);
  // Limpieza inicial de preferencias residuales de tema
  useEffect(() => {
    try {
      localStorage.removeItem('theme_preference');
      document.documentElement.classList.remove('dark');
    } catch {
      // ignore
    }
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLoadDemo = () => {
    setProfile(mockDefaultProfile);
    setNeed(mockDefaultNeed);
    setSelectedForCompare(['bancolombia-pyme', 'sempli-fintech']);
    setMaxUnlockedStep(4);
    showNotification('✨ Datos de ejemplo cargados — Flujo completo desbloqueado');
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
      maxAcceptableRate: 25
    });
    setSelectedForCompare([]);
    setActiveOptionForSim(null);
    setCurrentStep(1);
    setMaxUnlockedStep(1);
    showNotification('Formularios restablecidos — Paso 1 activo');
  };

  const handleToggleCompare = (id) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        showNotification('⚠️ Puedes comparar un máximo de 3 alternativas a la vez');
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/60 text-xs font-bold animate-fadeIn flex items-center gap-2">
          <span>{notification}</span>
        </div>
      )}

      {/* Navbar Superior */}
      <Navbar
        currentStep={currentStep}
        setCurrentStep={(step) => {
          if (step <= maxUnlockedStep) {
            setCurrentStep(step);
          } else {
            showNotification(`🔒 Completa los pasos anteriores para acceder al Paso ${step}`);
          }
        }}
        onLoadDemo={handleLoadDemo}
        onReset={handleReset}
        profile={profile}
        need={need}
      />

      {/* Stepper de navegación con candados secuenciales */}
      <Stepper
        currentStep={currentStep}
        setCurrentStep={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        maxUnlockedStep={maxUnlockedStep}
        onLockedClick={(stepId) => {
          showNotification(`🔒 El Paso ${stepId} está bloqueado. Completa el paso actual para continuar.`);
        }}
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <ProfileStep
            profile={profile}
            setProfile={setProfile}
            onNext={() => {
              setMaxUnlockedStep(prev => Math.max(prev, 2));
              setCurrentStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {currentStep === 2 && (
          <NeedStep
            need={need}
            setNeed={setNeed}
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

      {/* Side-by-side Comparison Modal (HU-07) */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        selectedIds={selectedForCompare}
        options={mockFinancingOptions}
        need={need}
        onSelectForSimulation={handleSelectForSimulation}
      />

      {/* Institutional Academic Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-black text-slate-900 text-sm tracking-tight">
                financia<span className="text-emerald-500 font-black">+</span>
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
                Plataforma Fintech
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Equipo: Moises Joshua Herrera Galindo • Juan Sebastián Molina Ballesteros • Miguel Angel Gallego Franco • Sebastián Rendón Grisales
            </p>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Búsqueda de alternativas de financiamiento • Entrega 1
          </div>
        </div>
      </footer>

    </div>
  );
}