import React, { useState } from 'react';
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
  const [profile, setProfile] = useState(mockDefaultProfile);
  const [need, setNeed] = useState(mockDefaultNeed);
  const [selectedForCompare, setSelectedForCompare] = useState(['bancolombia-pyme', 'sempli-fintech']);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [activeOptionForSim, setActiveOptionForSim] = useState(null);
  const [notification, setNotification] = useState(null);

  // Muestra una notificación temporal
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Cargar datos demo instantáneos
  const handleLoadDemo = () => {
    setProfile(mockDefaultProfile);
    setNeed(mockDefaultNeed);
    setSelectedForCompare(['bancolombia-pyme', 'sempli-fintech']);
    showNotification('✨ Datos de ejemplo cargados exitosamente (EcoModa Sostenible SAS)');
  };

  // Reiniciar datos a blanco
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
    showNotification('Formularios restablecidos a valores iniciales');
  };

  // Toggle de opción para comparar (máximo 3)
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

  // Ir directo al simulador con una opción
  const handleSelectForSimulation = (option) => {
    setActiveOptionForSim(option);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold animate-fade-in flex items-center gap-2">
          <span>{notification}</span>
        </div>
      )}

      {/* Navbar Superior */}
      <Navbar
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onLoadDemo={handleLoadDemo}
        onReset={handleReset}
        profile={profile}
        need={need}
      />

      {/* Stepper de navegación */}
      <Stepper
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <ProfileStep
            profile={profile}
            setProfile={setProfile}
            onNext={() => setCurrentStep(2)}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {currentStep === 2 && (
          <NeedStep
            need={need}
            setNeed={setNeed}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
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
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <SimulatorView
            options={mockFinancingOptions}
            profile={profile}
            need={need}
            activeOption={activeOptionForSim}
            setActiveOption={setActiveOptionForSim}
            onBackToCatalog={() => setCurrentStep(3)}
          />
        )}
      </main>

      {/* Modal de Comparativa (HU-07) */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        selectedIds={selectedForCompare}
        options={mockFinancingOptions}
        need={need}
        onSelectForSimulation={handleSelectForSimulation}
      />

      {/* Footer Académico */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-700">
              Búsqueda de alternativas de financiamiento para emprendedores
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Equipo: Moises Joshua Herrera Galindo • Juan Sebastián Molina Ballesteros • Miguel Angel Gallego Franco • Sebastián Rendón Grisales
            </p>
          </div>
          <div className="text-[11px] text-slate-400">
            Mockup de primera entrega • Sin dependencias de base de datos
          </div>
        </div>
      </footer>
    </div>
  );
}
