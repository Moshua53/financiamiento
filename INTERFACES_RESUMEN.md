# 📋 Documento de Contexto y Resumen de Interfaces: Financia+
> **Propósito del documento:** Este archivo compila la arquitectura visual, estructura de componentes, datos de negocio y flujos de usuario de la plataforma **Financia+**. Está optimizado para servir como contexto de entrada (*prompt context*) a un agente o diseñador UI/UX encargado de rediseñar el producto.

---

## 1. Visión General del Producto

**Financia+** es una plataforma Fintech colombiana diseñada para democratizar el acceso al capital. Conecta de manera bidireccional a dos actores clave del ecosistema productivo:
1. **Emprendedores / MiPymes:** Evalúan su capacidad de endeudamiento, descubren alternativas de financiamiento formal (bancos, fintechs, subsidios estatales, ángeles inversionistas) mediante un flujo paso a paso y publican su solicitud.
2. **Financiadores / Inversionistas:** Exploran un catálogo de proyectos con métricas de salud financiera validadas, evalúan el nivel de riesgo crediticio y manifiestan interés de inversión.

### Stack Tecnológico
* **Frontend:** React 18 (SPA con Vite)
* **Estilos:** Tailwind CSS v3, fuentes `IBM Plex Sans` e íconos de `lucide-react`
* **Persistencia & Auth:** Supabase (PostgreSQL con Row Level Security) + Fallback reactivo con `localStorage`
* **Cálculos Financieros:** Sistema de Amortización Francés (Cuota Fija) y conversión de tasas E.A. a M.V.

---

## 2. Mapa de Navegación y Arquitectura de Pantallas

```
Financia+ App
 │
 ├── [No Autenticado]
 │    └── Pantalla 0: AuthGate (Login / Registro / Demo Fast Access)
 │
 ├── [Rol: Emprendedor] -> Layout Emprendedor (Navbar + Stepper + Contenido + Footer)
 │    ├── Paso 1: Perfil Comercial & Finanzas Base (ProfileStep)
 │    ├── Paso 2: Definición de Necesidad de Fondos (NeedStep)
 │    ├── Paso 3: Catálogo de Fuentes de Financiación (CatalogStep)
 │    │    └── Modal Comparativo Frente a Frente (CompareModal)
 │    └── Paso 4: Simulador Financiero & Dictamen (SimulatorView)
 │
 └── [Rol: Financiador] -> Layout Financiador (Navbar + Contenido + Footer)
      └── Dashboard de Oportunidades & Riesgo (FinancierDashboard)
           └── Modal de Ficha Técnica de Emprendimiento (EmprendimientoDetailModal)
```

---

## 3. Catálogo Exhaustivo de Interfaces y Componentes

---

### Interfaz 0: Pantalla de Autenticación (`AuthGate.jsx`)
* **Ubicación:** `src/components/AuthGate.jsx`
* **Rol / Acceso:** Usuario no autenticado (o primer aterrizaje).
* **Propósito:** Permitir el ingreso o registro con asignación explícita de rol, o ingreso instantáneo con 1 solo clic en modo Demo.

#### Elementos Visuales y Funcionalidades:
1. **Fondo y Atmósfera:** Fondo oscuro (`slate-900` a `slate-950`) con luces de gradiente difusas (*ambient glow*) en tonos verde esmeralda e índigo.
2. **Header de Marca:** Logotipo `financia+`, título *"Búsqueda, Simulación e Inversión"* y badge indicador de conexión en vivo con Supabase PostgreSQL o modo local.
3. **Sección "Acceso Rápido de Prueba (Demo)":**
   * Botón `Emprendedor`: Inicia sesión demo inmediata y abre el flujo de 4 pasos.
   * Botón `Financiador`: Inicia sesión demo inmediata y abre el dashboard de inversión.
4. **Selector de Modalidad (Tabs):** Alternador entre `Iniciar Sesión` y `Crear Cuenta`.
5. **Formulario de Registro / Login:**
   * **Selector de Rol (solo en registro):** Dos tarjetas interactivas seleccionables:
     - *Emprendedor:* "Buscar y solicitar financiamiento para mi negocio" (Color temático: Esmeralda).
     - *Financiador:* "Explorar proyectos y evaluar oportunidades de inversión" (Color temático: Índigo).
   * **Campos de Entrada:** Nombre completo, Nombre del emprendimiento / entidad, Correo electrónico y Contraseña.
   * **Validaciones & Feedback:** Mensajes de alerta dinámicos ante contraseñas cortas, correos duplicados o credenciales erróneas.
   * **Botón CTA de Envío:** Cambia de color y gradiente según el rol elegido (Verde para Emprendedor, Azul/Índigo para Financiador) con estado de carga *loading spinner*.

---

### Componentes Globales de Estructura (Layout)

#### A. Barra de Navegación Superior (`Navbar.jsx`)
* **Ubicación:** `src/components/Navbar.jsx`
* **Presente en:** Vistas de Emprendedor y Financiador.
* **Elementos:**
  * **Brand:** Logo de Financia+ que redirige al inicio al pulsar.
  * **Badge de Rol:** Píldora que indica `Emprendedor` (verde) o `Financiador` (índigo).
  * **Status Pill Central (Desktop):**
    - *En Emprendedor:* Muestra el nombre del negocio registrado, un indicador de pulso verde y el monto solicitado en millones (ej. `EcoModa Sostenible SAS • Solicita: $35M COP`).
    - *En Financiador:* Píldora informativa *"Portal de Financiadores & Inversionistas"*.
  * **Herramientas de Acción (Emprendedor):**
    - Botón **"Publicar Solicitud"**: Guarda el proyecto en Supabase PostgreSQL (y `localStorage`) para que aparezca inmediatamente en el portal de financiadores.
    - Botón **"Datos Demo"**: Autocompleta el formulario con datos reales de una empresa colombiana (*EcoModa Sostenible SAS*) y desbloquea los 4 pasos.
    - Botón **"Reset"**: Limpia los estados a valores por defecto y bloquea los pasos posteriores.
  * **Perfil & Cierre de Sesión:** Nombre/email del usuario autenticado y botón para `signOut()`.

#### B. Barra de Progreso Secuencial (`Stepper.jsx`)
* **Ubicación:** `src/components/Stepper.jsx`
* **Presente en:** Flujo del Emprendedor.
* **Estructura de 4 Pasos:**
  1. *Paso 1: Perfil & Finanzas* (Datos comerciales y solvencia)
  2. *Paso 2: Necesidad de Fondos* (Monto, plazo y destino)
  3. *Paso 3: Catálogo de Opciones* (Fuentes disponibles en Colombia)
  4. *Paso 4: Simulador & Decisión* (Cuotas y comparativa)
* **Comportamiento UX:**
  * Candados secuenciales: Los pasos posteriores al nivel desbloqueado actual (`maxUnlockedStep`) tienen estilo desactivado y muestran ícono de candado.
  * Pasos completados muestran ícono de *check* verde.
  * Paso activo tiene borde resaltado, sombra y anillo esmeralda.

#### C. Pie de Página Institucional (`footer`)
* Contiene el logo institucional, nombres de los autores/equipo universitario y metadatos de la arquitectura (Supabase PostgreSQL / Módulos).

---

### Interfaz 1: Perfil & Finanzas Base (`ProfileStep.jsx`)
* **Ubicación:** `src/components/ProfileStep.jsx`
* **Rol:** Emprendedor — Paso 1 del flujo.
* **Objetivo:** Capturar la información legal, operativa y los ingresos/costos del negocio para evaluar liquidez en tiempo real.
* **Layout:** Grid de 12 columnas (8 columnas para formularios + 4 columnas para diagnóstico en vivo).

#### Secciones del Formulario:
1. **Subsección 1.1: Información General del Emprendimiento**
   * *Razón Social o Nombre Comercial* (Input texto, requerido).
   * *Fundador / Representante Legal* (Input texto, requerido).
   * *Sector o Industria* (Select: Moda y Manufactura, Tecnología y Software, Alimentos y Gastronomía, Comercio Electrónico / Retail, Salud y Bienestar, Servicios Profesionales, Agroindustria).
   * *Etapa del Emprendimiento* (Select: Idea / Prototipo, Semilla / Validación, Crecimiento Temprano, Consolidación).
   * *Ciudad / Municipio* (Input texto, requerido).
   * *Años Operando y Número de Empleados* (Inputs numéricos en grid de 2 columnas).
   * *Descripción de Propuesta de Valor* (Textarea expandible).
2. **Subsección 1.2: Capacidad Financiera & Flujo Mensual**
   * *Ventas / Ingresos Mensuales Promedio (COP)* (Input numérico formateado).
   * *Costos & Gastos Operativos Mensuales (COP)* (Input numérico formateado).
   * Feedback debajo de cada campo con formateo de moneda en pesos colombianos (`$ XX.XXX.XXX COP`).

#### Barra Lateral de Diagnóstico de Solvencia en Vivo:
* **Flujo de Caja Operativo Neto:** Cálculo dinámico `Ventas - Costos` en tiempo real.
* **Margen Operativo Bruto:** Porcentaje y barra de progreso animada. Indica si el margen es saludable (≥ 25%) o si es ajustado.
* **Recomendación de Cuota Prudente:** Sugerencia automática del 35% del flujo de caja libre como límite máximo de endeudamiento.
* **Botón de Avance:** "Continuar al Paso 2", con validación de campos obligatorios antes de continuar.

---

### Interfaz 2: Necesidad de Fondos & Semáforo de Capacidad (`NeedStep.jsx`)
* **Ubicación:** `src/components/NeedStep.jsx`
* **Rol:** Emprendedor — Paso 2 del flujo.
* **Objetivo:** Definir cuánto capital se necesita, a qué plazo, con qué destino y contrastarlo inmediatamente con la solvencia del Paso 1.
* **Layout:** 8 columnas de controles + 4 columnas de resumen técnico.

#### Controles Principales:
1. **Monto de Capital Requerido:**
   * Slider deslizador continuo de `$ 2.000.000` a `$ 150.000.000 COP`.
   * Píldora de estado con el Semáforo de Capacidad Financiera.
   * Botones de montos predeterminados frecuentes (`$10M`, `$20M`, `$35M`, `$50M`, `$80M`, `$120M`).
2. **Semáforo Reactivo de Capacidad Financiera (Tricolor):**
   * Barra segmentada que ilustra:
     - 🟢 **Saludable:** Cuota proyectada ≤ 20% de las ventas mensuales.
     - 🟡 **Moderado:** Cuota proyectada entre 20% y 35% de las ventas.
     - 🔴 **Riesgo:** Cuota proyectada > 35% de las ventas (riesgo de sobreendeudamiento).
   * Muestra la cuota estimada mensual calculada con la tasa de referencia y el porcentaje exacto de compromiso de ingresos.
3. **Plazo de Financiación Objetivo:**
   * Grid de botones de plazos rápidos (`6m`, `12m`, `18m`, `24m`, `36m`, `48m`, `60m`) con cálculo en años.
4. **Destino Prioritario de los Recursos:**
   * 4 tarjetas seleccionables con ícono y descripción:
     1. *Maquinaria y Tecnología*
     2. *Capital de Trabajo / Stock*
     3. *Expansión & Apertura Comercial*
     4. *Consolidación de Deuda / Sustitución de Pasivos*
   * Campo de texto para detalle específico de los activos a adquirir.

#### Sidebar de Resumen Ejecutivo:
* Tarjeta dinámica con el diagnóstico del semáforo y sugerencias financieras personalizadas (ej. si está en rojo sugiere ampliar plazo o reducir monto).
* Ficha técnica resumen (Monto, Plazo, Destino).
* Botones de acción: "Explorar Alternativas (Paso 3)" y "Volver al Perfil".

---

### Interfaz 3: Catálogo de Alternativas de Financiación (`CatalogStep.jsx`)
* **Ubicación:** `src/components/CatalogStep.jsx`
* **Rol:** Emprendedor — Paso 3 del flujo.
* **Objetivo:** Explorar, filtrar y seleccionar opciones reales del mercado colombiano adaptadas a la necesidad.

#### Elementos Visuales y Funcionalidades:
1. **Barra de Control Superior:**
   * **Buscador:** Filtrado en tiempo real por nombre de entidad, producto o palabra clave.
   * **Checkbox Inteligente:** *"Solo alternativas para mi monto ($XXM COP)"*, oculta opciones cuyos rangos de crédito no cubran la solicitud.
   * **Botón "Simulador General":** Acceso directo para probar valores libres en el Paso 4.
   * **Carrusel de Categorías:** Chips interactivos (`Todas`, `Bancario`, `Fintech`, `Capital Semilla`, `Microcrédito`, `Crowdfunding`, `Inversionistas`).
2. **Grid de Tarjetas de Opciones Financieras:**
   * Cada tarjeta incluye:
     - Categoría e insignia destacada (ej. *"Tasa Competitiva"*, *"Aprobación 48h"*, *"Condonable 100%"*, *"Smart Money"*).
     - Nombre de la alternativa y Entidad (Bancolombia, Sempli, Fondo Emprender, Bancamía, A2censo, Red de Ángeles, Addi).
     - Descripción del instrumento financiero.
     - Strip financiero: Tasa E.A. referencial, tiempo de respuesta/aprobación y rango de montos permitidos.
     - **Caja de Cuota Simulada Automática:** Muestra la cuota exacta que pagaría el emprendedor con su monto y plazo seleccionados.
     - Lista de requisitos clave con checks verdes.
     - Botón **"Comparar"** (permite marcar hasta 3 opciones a la vez).
     - Botón **"Simular"** (traslada la tasa y datos de la entidad directamente al Paso 4).
3. **Drawer Inferior Flotante de Comparación:**
   * Barra flotante inferior (*sticky*) que se activa cuando hay 1 o más opciones seleccionadas.
   * Contador de elementos elegidos y botón llamativo **"Ver Comparativa"**.

---

### Interfaz 4: Matriz Comparativa Frente a Frente (`CompareModal.jsx`)
* **Ubicación:** `src/components/CompareModal.jsx`
* **Rol:** Emprendedor — Modal sobre el Paso 3.
* **Objetivo:** Contrastar de 1 a 3 opciones seleccionadas en una tabla comparativa exhaustiva.

#### Elementos de la Matriz:
1. **Header del Modal:** Muestra el monto y plazo bajo los cuales se calcula la comparativa.
2. **Columnas de Opciones Seleccionadas:**
   * **Badge de "Menor Tasa":** Identifica automáticamente la alternativa con la tasa de interés más económica del grupo.
   * **Bloque de Estructura Financiera:**
     - Tasa de Interés Anual (% E.A.)
     - Cuota Mensual Fija en COP
     - Intereses Totales Proyectados a pagar
     - Costo Total a Desembolsar (Capital + Intereses)
     - Plazo de Desembolso
   * **Ventajas Clave (HU-09):** Lista de beneficios destacados con viñetas verdes.
   * **Consideraciones / Desventajas:** Puntos de atención y alertas con viñetas rojas.
   * **Requisitos de Entrada:** Checklist de documentación exigida por la entidad.
   * **Botón CTA:** "Simular con esta Opción" (cierra el modal y transfiere el contexto al Paso 4).

---

### Interfaz 5: Simulador de Cuotas & Dictamen de Crédito (`SimulatorView.jsx`)
* **Ubicación:** `src/components/SimulatorView.jsx`
* **Rol:** Emprendedor — Paso 4 del flujo.
* **Objetivo:** Ajustar parámetros milimétricamente, visualizar la amortización y emitir una ficha formal de decisión.
* **Layout:** Grid de 12 columnas (6 cols de controles dinámicos + 6 cols de resultados visuales).

#### Herramientas y Secciones:
1. **Barra Superior de Control:**
   * Selector dropdown para alternar entre entidades del catálogo o *"Parámetros Libres / Ajuste Manual"*.
   * Botón **"Imprimir Ficha"** (`window.print()`).
   * Botón **"Volver al Catálogo"**.
2. **Controles Dinámicos (Columna Izquierda):**
   * *Slider de Monto:* $2M a $150M COP.
   * *Slider de Plazo:* 6 a 60 meses con accesos directos numéricos.
   * *Slider de Tasa E.A.:* 0% a 45% E.A. con referencias visuales del mercado (0% Semilla, 21% Banca, 28% Fintech, 45% Usura).
   * Conversor automático a **Tasa Mensual Vencida (% M.V.)**.
3. **Resultados Financieros (Columna Derecha):**
   * **Hero Card Oscuro:**
     - Etiqueta *"Sistema Francés de Cuota Fija"*.
     - **Cifra Gigante de Cuota Mensual Fija** en tipografía tabular.
     - Indicadores de *Intereses Totales* y *Total a Desembolsar*.
     - **Barra de Amortización Bicolor:** Proporción porcentual entre Capital (azul) e Intereses (ámbar).
   * **Semáforo de Solvencia Integrado:** Diagnostica en verde, amarillo o rojo el impacto de la cuota simulada sobre las ventas declaradas por el emprendedor.
   * **Dictamen para Comité de Crédito:** Párrafo con redacción formal listo para sustentar la viabilidad ante inversionistas o bancos.

---

### Interfaz 6: Dashboard de Financiadores & Inversionistas (`FinancierDashboard.jsx`)
* **Ubicación:** `src/components/FinancierDashboard.jsx`
* **Rol:** Financiador / Inversionista (pantalla principal exclusiva).
* **Objetivo:** Explorar las solicitudes de financiamiento publicadas por emprendedores, analizar su riesgo y detectar oportunidades de inversión.

#### Elementos Visuales y Funcionalidades:
1. **Banner Superior de Bienvenida:**
   * Gradiente oscuro (`indigo-950` a `slate-900`) con copy enfocado en evaluación crediticia y colocación de capital.
   * Botón para recargar y sincronizar solicitudes en tiempo real desde Supabase.
2. **Grid de KPIs Globales:**
   * *Solicitudes Activas:* Cantidad de proyectos publicados.
   * *Capital Requerido Total:* Demanda acumulada de dinero en millones de pesos.
   * *Ticket Promedio:* Monto medio solicitado por emprendimiento.
   * *Sector Dominante:* Industria con mayor volumen de solicitudes.
3. **Barra de Búsqueda y Filtros:**
   * Campo de búsqueda por nombre, fundador, ciudad o modelo de negocio.
   * Menú desplegable por Sector.
   * Slider para filtrar por Monto Máximo Solicitado.
4. **Grid de Tarjetas de Emprendimientos:**
   * Cada tarjeta de proyecto contiene:
     - Sector de la empresa y Píldora de Semáforo de Riesgo Crediticio:
       * 🟢 *Saludable (Riesgo Bajo)*
       * 🟡 *Moderado*
       * 🔴 *Riesgoso*
     - Nombre de la empresa y Fundador con ícono de ciudad/municipio.
     - Breve descripción del producto o modelo de negocio.
     - Recuadro de Necesidad de Capital: Monto solicitado, plazo deseado y destino prioritario.
     - Métricas Rápidas: Ventas mensuales promedio y Margen operativo estimado.
     - Etapa del negocio y Botón **"Ver Ficha"**.

---

### Interfaz 7: Ficha Técnica Detallada de Emprendimiento (`EmprendimientoDetailModal.jsx`)
* **Ubicación:** `src/components/EmprendimientoDetailModal.jsx`
* **Rol:** Financiador — Modal abierto desde el Dashboard.
* **Objetivo:** Evaluación profunda de una solicitud específica antes de tomar decisiones de inversión.

#### Elementos del Modal:
1. **Cabecera:** Nombre de la empresa, sector, etapa, estado (Solicitud Activa / En Evaluación / Financiado), fundador y ciudad.
2. **Resumen de Inversión Prominente:**
   * Monto solicitado, plazo, cuota proyectada, tasa máxima aceptable por el emprendedor y pill de riesgo financiero.
   * Destino y especificación detallada del uso del dinero.
3. **Radiografía Financiera del Negocio (Grid de 4 Tarjetas):**
   * *Ventas Mensuales*
   * *Costos Operacionales*
   * *Flujo de Caja Neto*
   * *Margen Operativo Bruto (%)*
4. **Ficha Operativa & Modelo de Negocio:**
   * Descripción completa de la propuesta de valor.
   * Años de operación, número de colaboradores y sede física.
5. **Acciones del Financiador:**
   * Botón para cerrar la ficha.
   * Botón destacado **"Manifestar Interés de Inversión"**: Al hacer clic, envía confirmación visual de notificación enviada al emprendedor.

---

## 4. Resumen de Modelos de Datos & Lógica de Negocio

### Entidad: `Emprendimiento` (Tabla `emprendimientos` en PostgreSQL)
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `user_id` | UUID | Usuario creador en Supabase Auth |
| `name` | TEXT | Nombre comercial o razón social |
| `founder` | TEXT | Fundador o representante legal |
| `sector` | TEXT | Industria (Manufactura, Tecnología, Alimentos, etc.) |
| `stage` | TEXT | Etapa (Idea, Semilla, Crecimiento, Consolidación) |
| `city` | TEXT | Ciudad o municipio de operación |
| `years_operating` | INTEGER | Años de trayectoria |
| `employees` | INTEGER | Número de empleados |
| `monthly_sales` | NUMERIC | Ventas promedio mensuales en COP |
| `monthly_costs` | NUMERIC | Costos y gastos mensuales en COP |
| `description` | TEXT | Propuesta de valor o descripción del negocio |
| `amount` | NUMERIC | Monto de financiamiento solicitado |
| `term_months` | INTEGER | Plazo deseado en meses |
| `purpose` | TEXT | Destino (Maquinaria, Capital de trabajo, Expansión, etc.) |
| `purpose_details` | TEXT | Detalle específico de los activos o inversión |
| `max_acceptable_rate`| NUMERIC | Tasa máxima esperada por el emprendedor (% E.A.) |
| `status` | TEXT | `activo`, `en_revision`, `financiado`, `archivado` |

### Fórmulas Financieras Aplicadas
1. **Tasa Mensual Vencida (M.V.):**
   $$i_{MV} = (1 + i_{EA})^{1/12} - 1$$
2. **Cuota Fija Mensual (Sistema Francés):**
   $$Cuota = Monto \cdot \frac{i_{MV} \cdot (1 + i_{MV})^n}{(1 + i_{MV})^n - 1}$$
3. **Ratio de Endeudamiento:**
   $$Ratio = \left( \frac{Cuota}{Ventas\ Mensuales} \right) \cdot 100$$
   - $\le 20\%$: Saludable (Verde)
   - $20\% < x \le 35\%$: Moderado (Amarillo)
   - $> 35\%$: Riesgoso (Rojo)

---

## 5. Directrices y Oportunidades Clave para el Rediseño

Al presentar este contexto a un agente de rediseño UI/UX, las siguientes son las oportunidades de mejora sugeridas:

1. **Jerarquía Visual y Densidad de Información:**
   * Actualmente muchas pantallas utilizan estructuras densas de tarjetas blancas con bordes `slate-200`. Se puede modernizar hacia un diseño más limpio (*clean modern fintech*), con mejor espaciado negativo, micro-interacciones suaves y tipografías expresivas para las cifras numéricas.
2. **Consistencia de Design Tokens:**
   * El rol Emprendedor utiliza acentos en **Esmeralda / Verde** (`#22C55E` / `#10B981`), mientras que el rol Financiador utiliza **Índigo / Azul** (`#6366F1` / `#4F46E5`). Mantener esta distinción semántica es vital para que el usuario siempre sepa en qué modo está.
3. **Experiencia Móvil y Responsive:**
   * Mejorar la adaptación del Stepper en pantallas pequeñas (actualmente es un grid 2x2 que puede convertirse en un stepper compacto con scroll horizontal o barra de progreso tipo app bancaria).
   * Hacer el Drawer de Comparativa y los modales más ergonómicos en móviles (tipo *bottom-sheet*).
4. **Visualizaciones de Datos & Gráficos:**
   * Reemplazar las barras CSS simples por componentes gráficos interactivos (curva de amortización mes a mes, gráfico de dona para la división Capital vs Intereses).
5. **Empty States y Micro-animaciones:**
   * Incorporar estados vacíos ilustrados y transiciones suaves al alternar filtros en el catálogo de opciones y en el dashboard de inversionistas.
