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
  
  // Dark mode conforme a MASTER.md de ui-ux-pro-max (Default: Dark OLED)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('theme_preference');
      return saved !== null ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme_preference', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme_preference', 'light');
      }
    } catch {
      // localStorage unavailable, just toggle the class
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-[#0B1120] text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/30 text-xs font-bold animate-fadeIn flex items-center gap-2">
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
        darkMode={darkMode}
        setDarkMode={setDarkMode}
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
      <footer className="bg-white dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800/80 py-8 text-xs text-slate-500 dark:text-slate-400 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white">
                FinanEmprende
              </span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded">
                UI/UX Redesign (ui-ux-pro-max)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
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