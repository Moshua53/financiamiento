import React, { useState } from 'react';
import { 
  Building2, Briefcase, Lock, Mail, User, 
  ArrowRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FinanciaPlusLogo from './FinanciaPlusLogo';

export default function AuthGate() {
  const { signIn, signUp, signInDemo } = useAuth();
  
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('emprendedor'); // 'emprendedor' | 'financiador'
  
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp({
          email,
          password,
          fullName,
          role,
          companyName,
        });
        setSuccessMsg('Cuenta creada exitosamente. Redirigiendo...');
      }
    } catch (err) {
      console.error('Error de autenticación:', err);
      let msg = err.message || 'Ocurrió un error al procesar tu solicitud.';
      if (msg.includes('Invalid login credentials')) {
        msg = 'Credenciales no válidas. Verifica correo y contraseña.';
      } else if (msg.includes('User already registered')) {
        msg = 'Ya existe una cuenta con este correo. Inicia sesión.';
      } else if (msg.includes('Password should be at least')) {
        msg = 'La contraseña debe tener un mínimo de 6 caracteres.';
      }
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      
      {/* Contenedor Principal: Split Layout 45% / 55% */}
      <div className="w-full max-w-5xl bg-white rounded border border-neutral-300 shadow-elevated overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">

        {/* Panel Izquierdo (45% -> 5 cols) */}
        <div className="lg:col-span-5 bg-neutral-900 text-white p-6 sm:p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-neutral-800">
          <div className="space-y-6">
            <FinanciaPlusLogo className="h-8" textClassName="text-2xl text-white tracking-tight" />

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Financiación para tu empresa
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Encuentra, compara y simula opciones de crédito e inversión en un solo lugar.
              </p>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Formulario de Acceso y Registro (55% -> 7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-5">
            
            {/* Conmutador de Modo (Iniciar Sesión vs Registro) */}
            <div className="flex border-b border-neutral-200 pb-1 gap-4">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className={`pb-2 text-xs font-semibold transition-colors cursor-pointer ${
                  mode === 'login'
                    ? 'border-b-2 border-neutral-900 text-neutral-900'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(null); }}
                className={`pb-2 text-xs font-semibold transition-colors cursor-pointer ${
                  mode === 'register'
                    ? 'border-b-2 border-neutral-900 text-neutral-900'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                Crear cuenta
              </button>
            </div>

            {/* Mensajes de Alerta */}
            {errorMsg && (
              <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Selector de Rol Funcional */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Tipo de cuenta
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        onClick={() => setRole('emprendedor')}
                        className={`p-2.5 rounded border cursor-pointer transition-colors ${
                          role === 'emprendedor'
                            ? 'bg-neutral-50 border-neutral-900 ring-1 ring-neutral-900'
                            : 'bg-white border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Building2 className="w-3.5 h-3.5 text-neutral-800" />
                          <span className="text-xs font-bold text-neutral-900">Emprendedor</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-tight">
                          Busco financiación
                        </p>
                      </div>

                      <div
                        onClick={() => setRole('financiador')}
                        className={`p-2.5 rounded border cursor-pointer transition-colors ${
                          role === 'financiador'
                            ? 'bg-neutral-50 border-neutral-900 ring-1 ring-neutral-900'
                            : 'bg-white border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Briefcase className="w-3.5 h-3.5 text-neutral-800" />
                          <span className="text-xs font-bold text-neutral-900">Financiador</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-tight">
                          Quiero invertir o prestar
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      {role === 'emprendedor' ? 'Nombre de la empresa' : 'Entidad o fondo'}
                    </label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={role === 'emprendedor' ? 'Ej. EcoModa SAS' : 'Ej. Red de Ángeles Inversionistas'}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Correo Electrónico */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Correo
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@empresa.com"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 rounded text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-subtle disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-neutral-500">
              Probar demo:{' '}
              <button
                type="button"
                onClick={() => signInDemo('emprendedor')}
                className="font-medium text-neutral-900 hover:underline cursor-pointer"
              >
                Emprendedor
              </button>
              <span className="mx-1.5 text-neutral-300">·</span>
              <button
                type="button"
                onClick={() => signInDemo('financiador')}
                className="font-medium text-neutral-900 hover:underline cursor-pointer"
              >
                Financiador
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
