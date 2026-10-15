-- ==============================================================================
-- Financia+ — Esquema de Base de Datos PostgreSQL en Supabase
-- Tablas: profiles, emprendimientos
-- Políticas RLS, Triggers de sincronización de Auth y Datos Semilla
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE PERFILES (Vinculada a auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('emprendedor', 'financiador')),
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Comentarios explicativos
COMMENT ON TABLE public.profiles IS 'Perfiles de usuario extendidos con rol específico en Financia+';
COMMENT ON COLUMN public.profiles.role IS 'Rol del usuario: emprendedor (solicita) o financiador (evalúa e invierte)';

-- 3. TABLA DE EMPRENDIMIENTOS / SOLICITUDES
CREATE TABLE IF NOT EXISTS public.emprendimientos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  founder TEXT NOT NULL,
  sector TEXT NOT NULL,
  stage TEXT NOT NULL,
  city TEXT NOT NULL,
  years_operating INTEGER NOT NULL DEFAULT 0,
  employees INTEGER NOT NULL DEFAULT 1,
  monthly_sales NUMERIC(15, 2) NOT NULL CHECK (monthly_sales >= 0),
  monthly_costs NUMERIC(15, 2) NOT NULL CHECK (monthly_costs >= 0),
  description TEXT,
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  term_months INTEGER NOT NULL CHECK (term_months > 0),
  purpose TEXT NOT NULL,
  purpose_details TEXT,
  max_acceptable_rate NUMERIC(5, 2),
  status TEXT NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'en_revision', 'financiado', 'archivado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.emprendimientos IS 'Solicitudes de financiamiento y características de emprendimientos registrados';

-- 4. ÍNDICES DE RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_emprendimientos_user_id ON public.emprendimientos(user_id);
CREATE INDEX IF NOT EXISTS idx_emprendimientos_sector ON public.emprendimientos(sector);
CREATE INDEX IF NOT EXISTS idx_emprendimientos_status ON public.emprendimientos(status);
CREATE INDEX IF NOT EXISTS idx_emprendimientos_created_at ON public.emprendimientos(created_at DESC);

-- 5. TRIGGER AUTOMÁTICO PARA NUEVOS USUARIOS DE AUTH
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, company_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'emprendedor'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'company_name'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    role = EXCLUDED.role,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emprendimientos ENABLE ROW LEVEL SECURITY;

-- 7. POLÍTICAS RLS PARA PROFILES
-- Cualquier usuario autenticado puede ver perfiles (necesario para mostrar nombres de creadores)
CREATE POLICY "Permitir lectura de perfiles a usuarios autenticados"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Los usuarios solo pueden editar su propio perfil
CREATE POLICY "Permitir actualizar propio perfil"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- 8. POLÍTICAS RLS PARA EMPRENDIMIENTOS
-- Lectura: los financiadores y los propios emprendedores pueden ver emprendimientos activos
CREATE POLICY "Permitir lectura de emprendimientos"
  ON public.emprendimientos FOR SELECT
  TO authenticated, anon
  USING (true);

-- Inserción: usuarios autenticados pueden registrar su emprendimiento
CREATE POLICY "Permitir inserción de emprendimiento al creador"
  ON public.emprendimientos FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IS NULL OR (SELECT auth.uid()) = user_id
  );

-- Actualización: el emprendedor dueño puede actualizar su solicitud
CREATE POLICY "Permitir actualizar propio emprendimiento"
  ON public.emprendimientos FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- 9. DATOS SEMILLA (Seed Data) PARA DEMOSTRACIONES INMEDIATAS
INSERT INTO public.emprendimientos (
  id,
  user_id,
  name,
  founder,
  sector,
  stage,
  city,
  years_operating,
  employees,
  monthly_sales,
  monthly_costs,
  description,
  amount,
  term_months,
  purpose,
  purpose_details,
  max_acceptable_rate,
  status
)
VALUES
(
  'a1111111-1111-1111-1111-111111111111',
  NULL,
  'EcoModa Sostenible SAS',
  'Camila Morales & Moises Galindo',
  'Manufactura e Industria',
  'Crecimiento / Tracción',
  'Medellín, Antioquia',
  2,
  5,
  24000000,
  14500000,
  'Marca de confección textil con algodón orgánico colombiano y fibras recicladas. Canales directos e-commerce y tiendas concepto.',
  35000000,
  24,
  'Maquinaria y Tecnología',
  'Adquisición de cortadora láser industrial de bajo consumo y optimización de cadena de estampado.',
  24.5,
  'activo'
),
(
  'b2222222-2222-2222-2222-222222222222',
  NULL,
  'AgroTech Drones Colombia',
  'Alejandro Restrepo',
  'Tecnología y Software',
  'Temprana / Validación',
  'Manizales, Caldas',
  1,
  3,
  16500000,
  9800000,
  'Servicio de monitoreo satelital y fumigación de precisión mediante drones para caficultores y productores de aguacate Hass.',
  50000000,
  36,
  'Expansión Comercial',
  'Compra de dos drones multiespectrales DJI Agras y apertura de sede satélite en Pereira.',
  22.0,
  'activo'
),
(
  'c3333333-3333-3333-3333-333333333333',
  NULL,
  'BioSnacks Andinos',
  'Valentina Rojas',
  'Alimentos y Gastronomía',
  'Consolidado / Expansión',
  'Bogotá D.C.',
  4,
  8,
  42000000,
  28000000,
  'Snacks saludables deshidratados a base de tubérculos y frutas exóticas colombianas con certificación INVIMA para exportación.',
  80000000,
  48,
  'Capital de Trabajo / Stock',
  'Materia prima y empaques compostables para despachos a cadenas de retail nacional.',
  20.5,
  'activo'
),
(
  'd4444444-4444-4444-4444-444444444444',
  NULL,
  'ClinicaVet Móvil 24/7',
  'Dra. Luisa Fernanda Gómez',
  'Salud y Bienestar',
  'Crecimiento / Tracción',
  'Cali, Valle del Cauca',
  2,
  4,
  19000000,
  11200000,
  'Unidad médica veterinaria móvil equipada con rayos X digital y laboratorio portátil para atención domiciliaria de mascotas.',
  28000000,
  18,
  'Maquinaria y Tecnología',
  'Equipo de ecografía veterinaria doppler de alta resolución y adecuación del vehículo.',
  25.0,
  'activo'
)
ON CONFLICT (id) DO NOTHING;
