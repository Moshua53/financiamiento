import React, { useState } from 'react';
import { 
  Rocket, Briefcase, Lock, Mail, User, Building, 
  ArrowRight, Sparkles, CheckCircle2, AlertCircle, ShieldCheck, Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FinanciaPlusLogo from './FinanciaPlusLogo';

export default function AuthGate() {
  const { signIn, signUp, signInDemo, isSupabaseConfigured } = useAuth();
  
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
        setSuccessMsg('¡Cuenta creada exitosamente! Redirigiendo a tu espacio de trabajo...');
      }
    } catch (err) {
      console.error('Error de autenticación:', err);
      let msg = err.message || 'Ocurrió un error al procesar tu solicitud.';
      if (msg.includes('Invalid login credentials')) {
        msg = 'Credenciales inválidas. Revisa tu correo y contraseña.';
      } else if (msg.includes('User already registered')) {
        msg = 'Ya existe un usuario con este correo. Por favor inicia sesión.';
      } else if (msg.includes('Password should be at least')) {
        msg = 'La contraseña debe tener al menos 6 caracteres.';
      }
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
            <FinanciaPlusLogo className="h-10 text-white" textClassName="text-3xl text-white" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Búsqueda, Simulación e Inversión
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Ecosistema integral que conecta emprendimientos con capital y fuentes formales de financiación
        </p>

        {/* Supabase status indicator */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {isSupabaseConfigured ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Database className="w-3.5 h-3.5" />
              Supabase PostgreSQL Conectado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Modo Local / Demo Disponible
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl border border-slate-800 sm:px-10">
          
          {/* Quick Demo Fast Access */}
          <div className="mb-6 pb-6 border-b border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Acceso Rápido de Prueba (Demo)
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-full">
                1 Clic
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => signInDemo('emprendedor')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-all active:scale-[0.98] shadow-xs"
                title="Accede a la pantalla habitual de 4 pasos para emprendedores"
              >
                <Rocket className="w-4 h-4 text-emerald-400" />
                <span>Emprendedor</span>
              </button>

              <button
                type="button"
                onClick={() => signInDemo('financiador')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/30 transition-all active:scale-[0.98] shadow-xs"
                title="Accede al nuevo dashboard con todos los emprendimientos subidos"
              >
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Financiador</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-950 p-1 mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Si es registro, solicitar nombre y selección de ROL */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* SELECTOR DE ROL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ¿Cuál es tu rol en la plataforma?
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div
                      onClick={() => setRole('emprendedor')}
                      className={`cursor-pointer p-3 rounded-xl border transition-all text-left ${
                        role === 'emprendedor'
                          ? 'bg-emerald-500/15 border-emerald-500 ring-1 ring-emerald-500'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Rocket className={`w-4 h-4 ${role === 'emprendedor' ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-white">Emprendedor</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">
                        Buscar y solicitar financiamiento para mi negocio
                      </p>
                    </div>

                    <div
                      onClick={() => setRole('financiador')}
                      className={`cursor-pointer p-3 rounded-xl border transition-all text-left ${
                        role === 'financiador'
                          ? 'bg-indigo-500/15 border-indigo-500 ring-1 ring-indigo-500'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className={`w-4 h-4 ${role === 'financiador' ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-white">Financiador</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">
                        Explorar proyectos y evaluar oportunidades de inversión
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {role === 'emprendedor' ? 'Nombre de tu Emprendimiento (Opcional)' : 'Entidad o Fondo (Opcional)'}
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={role === 'emprendedor' ? 'Ej. EcoModa SAS' : 'Ej. Fondo Capital Emprendedor'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                mode === 'register' && role === 'financiador'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-indigo-500/25'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-500/25'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                  Procesando...
                </span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Iniciar Sesión' : 'Completar Registro'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-slate-500">
        <p>Financia+ Fintech Platform • Autenticación segura con Supabase PostgreSQL</p>
      </div>

    </div>
  );
}
