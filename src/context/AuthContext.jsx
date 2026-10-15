import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

const DEMO_STORAGE_KEY = 'financia_demo_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener perfil desde la tabla public.profiles de Supabase
  const fetchProfile = async (userId, userEmail, userMetaRole) => {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Advertencia al consultar perfil:', error.message);
      }

      if (data) {
        return data;
      }

      // Si no existe el registro en profiles (por ejemplo, si no corrió el trigger), crear uno
      const fallbackRole = userMetaRole || 'emprendedor';
      const fallbackProfile = {
        id: userId,
        role: fallbackRole,
        full_name: splitEmailName(userEmail),
      };

      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .upsert(fallbackProfile)
        .select()
        .single();

      if (!insertError && inserted) {
        return inserted;
      }

      return fallbackProfile;
    } catch (err) {
      console.error('Error al obtener perfil:', err);
      return null;
    }
  };

  const splitEmailName = (email) => {
    if (!email) return 'Usuario';
    return email.split('@')[0].replace(/[._]/g, ' ');
  };

  // Cargar sesión inicial
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      // 1. Revisar si hay sesión demo en localStorage
      const savedDemo = localStorage.getItem(DEMO_STORAGE_KEY);
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          if (mounted && parsed?.user && parsed?.profile) {
            setUser(parsed.user);
            setProfile(parsed.profile);
            setLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem(DEMO_STORAGE_KEY);
        }
      }

      // 2. Revisar sesión en Supabase si está configurado
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            setUser(session.user);
            const userProf = await fetchProfile(
              session.user.id,
              session.user.email,
              session.user.user_metadata?.role
            );
            if (mounted) {
              setProfile(userProf || {
                id: session.user.id,
                role: session.user.user_metadata?.role || 'emprendedor',
                full_name: session.user.user_metadata?.full_name || session.user.email,
              });
            }
          }
        } catch (err) {
          console.warn('Error al verificar sesión de Supabase:', err);
        }

        // Suscribirse a cambios de estado de autenticación
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            if (session?.user) {
              setUser(session.user);
              const userProf = await fetchProfile(
                session.user.id,
                session.user.email,
                session.user.user_metadata?.role
              );
              setProfile(userProf || {
                id: session.user.id,
                role: session.user.user_metadata?.role || 'emprendedor',
                full_name: session.user.user_metadata?.full_name || session.user.email,
              });
            } else {
              // No borrar si es una sesión demo
              if (!localStorage.getItem(DEMO_STORAGE_KEY)) {
                setUser(null);
                setProfile(null);
              }
            }
            setLoading(false);
          }
        );

        if (mounted) setLoading(false);
        return () => {
          authListener?.subscription?.unsubscribe();
        };
      } else {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Iniciar sesión con email y contraseña
  const signIn = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        'Supabase no está configurado. Agrega tus credenciales en el archivo .env o usa el modo Demo.'
      );
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    if (data?.user) {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      const userProf = await fetchProfile(
        data.user.id,
        data.user.email,
        data.user.user_metadata?.role
      );
      setUser(data.user);
      setProfile(userProf || {
        id: data.user.id,
        role: data.user.user_metadata?.role || 'emprendedor',
        full_name: data.user.user_metadata?.full_name || data.user.email,
      });
    }
    return data;
  };

  // Registrarse seleccionando el rol
  const signUp = async ({ email, password, fullName, role, companyName }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        'Supabase no está configurado. Agrega tus credenciales en el archivo .env o usa el modo Demo.'
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
          company_name: companyName,
        },
      },
    });

    if (error) throw error;

    if (data?.user) {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      // Crear o actualizar en profiles explícitamente
      const newProfile = {
        id: data.user.id,
        role,
        full_name: fullName || splitEmailName(email),
        company_name: companyName || null,
      };

      try {
        await supabase.from('profiles').upsert(newProfile);
      } catch (e) {
        console.warn('Upsert de perfil posterior:', e);
      }

      setUser(data.user);
      setProfile(newProfile);
    }

    return data;
  };

  // Ingreso directo con rol Demo (sin necesidad de email/password)
  const signInDemo = (selectedRole) => {
    const isFinancier = selectedRole === 'financiador';
    const demoUser = {
      id: isFinancier ? 'demo-financiador-id' : 'demo-emprendedor-id',
      email: isFinancier ? 'inversionista.demo@financia.co' : 'emprendedor.demo@financia.co',
      user_metadata: {
        role: selectedRole,
        full_name: isFinancier ? 'Dr. Santiago Mendoza' : 'Moises Galindo (EcoModa)',
      },
    };

    const demoProfile = {
      id: demoUser.id,
      role: selectedRole,
      full_name: isFinancier ? 'Dr. Santiago Mendoza' : 'Moises Galindo (EcoModa)',
      company_name: isFinancier ? 'Red Ángeles & Capital Semilla' : 'EcoModa Sostenible SAS',
    };

    localStorage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify({ user: demoUser, profile: demoProfile })
    );

    setUser(demoUser);
    setProfile(demoProfile);
  };

  // Cerrar sesión
  const signOut = async () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Error al cerrar sesión en Supabase:', err);
      }
    }
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    role: profile?.role || user?.user_metadata?.role || null,
    loading,
    isSupabaseConfigured,
    signIn,
    signUp,
    signInDemo,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
