import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'https://tu-proyecto.supabase.co'
);

if (!isSupabaseConfigured) {
  console.info(
    'ℹ️ [Financia+] Supabase no está configurado o faltan credenciales en .env. Se usará el modo simulado / demostración local.'
  );
}

// Cliente oficial de Supabase
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Sesión solo en memoria: al recargar o volver a entrar se pide iniciar sesión
        persistSession: false,
        autoRefreshToken: true,
      },
    })
  : null;
