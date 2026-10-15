# 📑 Documento de Entrega — Prototipo Funcional Financia+
**Plataforma de Búsqueda, Comparación y Simulación de Financiamiento para Emprendedores y MiPymes**

---

## 📌 Información General del Proyecto

* **Nombre de la Plataforma:** Financia+ (FinanEmprende)
* **Entregable:** Documento Técnico y Funcional de Entrega del Prototipo (Entrega 1)
* **Integrantes / Autores:**
  * Moises Joshua Herrera Galindo
  * Juan Sebastián Molina Ballesteros
  * Miguel Angel Gallego Franco
  * Sebastián Rendón Grisales
* **Stack Tecnológico:** React 18, Vite 5, Tailwind CSS 3, Lucide React, Motor Matemático Financiero en JavaScript ES6+
* **Repositorio:** [financiamiento (GitHub)](https://github.com/Moshua53/financiamiento)
* **Estado del Prototipo:** 100% Funcional e Interactivo (Cobertura total de Historias de Usuario de la Entrega 1)

---

## 🎯 1. Resumen Ejecutivo

En Colombia, las micro, pequeñas y medianas empresas (MiPymes) y los nuevos emprendimientos enfrentan una barrera crítica al buscar apalancamiento de capital: **la asimetría de información y la falta de educación financiera**. La dispersión de las ofertas, el lenguaje bancario complejo y el desconocimiento de la capacidad real de pago conducen frecuentemente al sobreendeudamiento o al rechazo crediticio.

**Financia+** resuelve esta problemática mediante un prototipo web interactivo, guiado y reactivo. La plataforma permite a los emprendedores:
1. Diagnosticar su salud financiera preliminar a partir de sus ventas y costos.
2. Formular con precisión su necesidad de inversión (monto, plazo y destino).
3. Descubrir y filtrar alternativas de financiación formal adaptadas a su contexto (banca comercial, fintechs, capital semilla estatal, microcréditos y crowdfunding).
4. Comparar ofertas cara a cara identificando ventajas, desventajas y requisitos.
5. Simular la amortización en tiempo real con un **semáforo algorítmico de endeudamiento** que previene comprometer el capital de trabajo de la empresa.

---

## 🚀 2. Funcionalidades Implementadas en el Prototipo

El prototipo fue concebido bajo un enfoque de **Diseño Centrado en el Usuario (UCD)** y arquitectura modular en componentes React, estructurado en un flujo secuencial de 4 pasos con navegación controlada:

```
[ Paso 1: Perfil ] ──> [ Paso 2: Necesidad ] ──> [ Paso 3: Catálogo & Comparador ] ──> [ Paso 4: Simulador & Reporte ]
```

A continuación se desglosan en detalle las capacidades funcionales disponibles:

### 2.1. Gestión de Navegación y Usabilidad Global
* **Stepper Secuencial con Candados de Progresión:** Barra de progreso superior con validación de dependencias. El usuario no puede saltar al catálogo o simulador sin antes haber completado los datos mínimos del negocio y su necesidad de capital, garantizando la consistencia de los cálculos.
* **Modo Demostración Rápida ("Cargar Demo"):** Botón global en la barra de navegación que precarga instantáneamente el perfil empresarial de una empresa modelo (*EcoModa Sostenible SAS*), desbloqueando de inmediato los 4 pasos y facilitando pruebas en vivo durante presentaciones o evaluaciones.
* **Restablecimiento Completo ("Limpiar / Reset"):** Permite vaciar formularios y reiniciar el flujo desde cero para ingresar nuevos datos.
* **Diseño Responsivo y Notificaciones Toast:** Adaptabilidad para dispositivos móviles y de escritorio, con alertas temporales no intrusivas que informan límites de selección y validaciones.

---

### 2.2. Paso 1 — Perfil Comercial y Diagnóstico Financiero (HU-01, HU-02)
* **Registro de Identidad del Emprendimiento:**
  * Nombre de la empresa y del fundador o representante legal.
  * Sector de la economía (Tecnología, Retail, Manufactura, Gastronomía, Servicios, Salud).
  * Etapa de madurez del negocio (Idea/Prototipo, Validación Temprana, Tracción/Crecimiento, Expansión).
  * Ciudad sede, años de operación formal/informal y número actual de empleados.
  * Resumen del modelo de negocio.
* **Diagnóstico Financiero en Tiempo Real:**
  * Captura de ventas mensuales promedio ($ COP) y costos/gastos operacionales fijos ($ COP) con formato monetario automático.
  * **Panel Lateral de Flujo Neto:** Calcula al instante el Flujo de Caja Operativo ($\text{Ventas} - \text{Costos}$) y el Margen Operacional Porcentual.
  * **Alertas Tempranas:** Detección visual si los costos superan las ventas (flujo negativo), advirtiendo al emprendedor antes de continuar.

---

### 2.3. Paso 2 — Definición de la Necesidad de Financiación (HU-04)
* **Parametrización del Requerimiento de Capital:**
  * Slider interactivo y botones de selección rápida de monto ($10M, $20M, $35M, $50M, $80M, $120M COP).
  * Selector de plazo de amortización proyectado (de 6 hasta 60 meses).
  * Selector gráfico de destino de los fondos (Maquinaria/Tecnología, Capital de Trabajo, Expansión Comercial, Sustitución de Pasivos).
  * Campo de descripción cualitativa del destino y tasa máxima anual esperada (% E.A.).
* **Tarjeta Resumen de Solicitud:** Muestra un resumen consolidado de la solicitud que servirá como criterio de filtrado para los siguientes pasos.

---

### 2.4. Paso 3 — Catálogo de Alternativas y Comparador Lado a Lado (HU-05, HU-06, HU-07, HU-09, HU-10)
* **Base de Conocimiento Representativa de Colombia:**
  * Banco tradicional: *Línea Emprendedores y Pymes (Bancolombia)*.
  * Fintech de crédito ágil: *Crédito Digital para Crecimiento (Sempli)*.
  * Capital semilla no reembolsable: *Fondo Emprender (SENA)* — Condonable al 100%.
  * Microfinanzas inclusivas: *Microcrédito Crecer Negocio (Bancamía)*.
  * Crowdfunding de deuda colaborativa: *A2censo (Bolsa de Valores de Colombia)*.
  * Inversión de capital de riesgo: *Inversión Ángel / Smart Money (Red de Ángeles)*.
  * Financiación embebida: *Línea Rotativa de Liquidez (Addi / Bold)*.
* **Filtrado Reactivo Multinivel:**
  * Pestañas por categoría (*Bancario, Fintech, Capital Semilla, Microcrédito, Crowdfunding, Inversionistas*).
  * Filtro de rango de monto: Checkbox dinámico que oculta opciones que no cubran el monto solicitado por el emprendedor.
  * Buscador en tiempo real por palabra clave (entidad, producto o características).
* **Fichas Informativas Transparentes:**
  * Visualización de Tasa Efectiva Anual (% E.A.), tiempos estimados de aprobación (horas, días o semanas), requisitos documentales obligatorios, ventajas competitivas (pros) y desventajas/restricciones (contras).
  * Cálculo dinámico de cuota estimada dentro de la misma tarjeta según el monto del Paso 2.
  * Botón de enlace seguro (`target="_blank"`) hacia el portal oficial de cada entidad para iniciar trámites.
* **Comparador Frente a Frente (HU-07):**
  * Selección de hasta 3 alternativas simultáneas mediante casillas de verificación.
  * Barra inferior flotante con acceso al modal de comparación.
  * Vista en matriz comparativa donde se contrastan cuotas, tasas, plazos, garantías y pros/contras.
  * Detección automática del producto más favorable con la insignia visual *"Tasa Más Baja"*.
  * Botón para transferir directamente los parámetros de cualquiera de las opciones al simulador.

---

### 2.5. Paso 4 — Simulador Financiero Riguroso y Semáforo de Riesgo (HU-08, HU-11)
* **Motor Matemático Francés:**
  * Conversión formal de Tasa Efectiva Anual (E.A.) a Tasa Periódica Mensual Vencida ($i$):
    $$i = (1 + i_{\text{E.A.}})^{1/12} - 1$$
  * Cálculo de cuota fija mensual mediante la fórmula de anualidades ordinarias:
    $$\text{Cuota} = P \times \frac{i \times (1 + i)^n}{(1 + i)^n - 1}$$
* **Sliders Interactivos en Caliente:**
  * Modificación en tiempo real del monto, plazo y tasa para observar inmediatamente el impacto en la cuota y en los intereses totales.
* **Desglose de Costos:**
  * Capital amortizado vs. Total de intereses pagados.
  * Barra de progreso porcentual comparativa del costo financiero.
* **Semáforo Algorítmico de Capacidad de Endeudamiento:**
  * Cruza la cuota proyectada contra las ventas mensuales declaradas en el Paso 1:
    $$\text{Ratio de Endeudamiento} = \left( \frac{\text{Cuota Mensual}}{\text{Ventas Mensuales}} \right) \times 100$$
  * 🟢 **Verde (Endeudamiento Saludable $\le 20\%$):** Riesgo bajo; la cuota no compromete la operatividad del negocio.
  * 🟡 **Amarillo (Endeudamiento Moderado $20\% - 35\%$):** Nivel viable pero que requiere control presupuestal estricto.
  * 🔴 **Rojo (Riesgo de Sobreendeudamiento $> 35\%$):** Alerta crítica indicando que la deuda asfixiará el flujo de caja, sugiriendo extender el plazo o reducir el monto.
* **Exportación y Generación de Reporte:**
  * Botón para imprimir o guardar como PDF la ficha técnica de simulación y el resumen ejecutivo del emprendimiento.

---

## 📐 3. Trazabilidad con BPMN 2.0 y Requisitos

El prototipo se encuentra alineado con la especificación de procesos de negocio estandarizada en los archivos [`docs/BPMN_PROCESO.md`](file:///c:/Users/Asus/Documents/GitHub/financimiento/docs/BPMN_PROCESO.md) y [`docs/bpmn-proceso-finanemprende.html`](file:///c:/Users/Asus/Documents/GitHub/financimiento/docs/bpmn-proceso-finanemprende.html):

| Actividad BPMN | Tipo de Tarea | Historia de Usuario | Módulo en el Prototipo | Resultado / Salida |
| :--- | :--- | :--- | :--- | :--- |
| **T1: Registrar Datos** | User Task | HU-01, HU-02 | `ProfileStep.jsx` | Perfil del negocio y flujo de caja base. |
| **S1: Validar & Diagnosticar** | Service Task | HU-02 | `financialCalculations.js` | Validación de entradas y cálculo de margen operativo. |
| **T2: Definir Necesidad** | User Task | HU-04 | `NeedStep.jsx` | Requerimiento de capital estructurado. |
| **T3: Explorar & Filtrar** | User Task | HU-05, HU-06 | `CatalogStep.jsx` | Catálogo filtrado por categoría y monto. |
| **T4: Comparar Alternativas** | User Task | HU-07, HU-08, HU-09 | `CompareModal.jsx` | Matriz frente a frente de hasta 3 opciones. |
| **T5: Simular Financiación** | User Task | HU-11 | `SimulatorView.jsx` | Calibración de cuotas y plazos en tiempo real. |
| **S2: Motor Financiero** | Script Task | HU-08, HU-11 | `financialCalculations.js` | Amortización francesa y ratio de endeudamiento. |
| **T6: Exportar & Contactar** | User Task | HU-10 | `SimulatorView.jsx` | Ficha técnica en PDF y redirección a la entidad. |

---

## 🗺️ 4. Próximos Pasos a Seguir (Roadmap de Evolución)

Para llevar este prototipo funcional a una solución en producción escalable, se define la siguiente hoja de ruta organizada por fases y áreas de ingeniería:

### 4.1. Fase Inmediata: Backend, Persistencia y Autenticación (Entrega 2)
1. **Arquitectura Backend (API REST / GraphQL):**
   * Implementación de un servidor en Node.js (Express / NestJS) o Python (FastAPI).
   * Persistencia en base de datos relacional (PostgreSQL) para almacenar perfiles de empresas, historial de simulaciones y solicitudes de crédito.
2. **Autenticación y Seguridad (RBAC):**
   * Sistema de registro e inicio de sesión con JWT / OAuth2 (Google / LinkedIn).
   * Diferenciación de roles de usuario:
     * **Emprendedor:** Gestiona su empresa, guarda simulaciones y descarga reportes.
     * **Asesor Financiero / Consultor:** Visualiza y acompaña las métricas de múltiples empresas.
     * **Administrador / Entidad:** Administra el catálogo de productos financieros y tasas vigentes.
3. **Módulo de "Mis Simulaciones Guardadas":**
   * Panel de control (Dashboard) donde el emprendedor pueda guardar diferentes escenarios (ej. *"Escenario A: Crédito Bancolombia a 36 meses"* vs. *"Escenario B: Sempli a 12 meses"*) y consultar su historial.

---

### 4.2. Fase de Integraciones: Datos en Tiempo Real y Ecosistema Financiero
1. **Conexión a Tasas en Tiempo Real (Open Finance & Web Scraping Legal):**
   * Consumo de APIs públicas de la **Superintendencia Financiera de Colombia (SFC)** para mantener actualizadas las tasas de usura y las tasas promedio de colocación comercial.
   * Webhooks y sincronización periódica de productos con entidades aliadas.
2. **Pre-scoring Crediticio Automatizado:**
   * Integración mediante API con burós de crédito (Datacrédito / TransUnion) previa autorización expresa de Habeas Data, permitiendo calcular un índice de probabilidad de aprobación real.
3. **Módulo de Radicación Asistida (Fintech Referrals):**
   * Generación de un paquete digital estandarizado con la información del negocio (RUT, extractos, balance básico) para pre-radicar la solicitud directamente ante la entidad financiera seleccionada.

---

### 4.3. Fase de Inteligencia Artificial y Personalización Avanzada
1. **Motor de Recomendación Inteligente (Matchmaking Algorítmico):**
   * Modelo de Machine Learning que evalúe variables como sector, antigüedad, margen y monto solicitado para rankear las alternativas con mayor probabilidad de éxito (*"92% de afinidad con tu negocio"*).
2. **Asistente Virtual Financiero (AI Financial Copilot):**
   * Integración de un agente conversacional basado en LLMs para explicar en lenguaje sencillo términos técnicos como *pactos de gracia, warrants, dilución de acciones, covenants bancarios y costo financiero total (CFT)*.

---

### 4.4. Fase de Calidad de Software, Seguridad y Despliegue Cloud
1. **Testing Automatizado:**
   * **Pruebas Unitarias:** Cobertura con Vitest sobre las funciones de `financialCalculations.js` (validación de fórmulas matemáticas, bordes de tasas negativas o cero, cuotas extremas).
   * **Pruebas de Componentes e Integración:** React Testing Library para validar el comportamiento del formulario y el Stepper.
   * **Pruebas End-to-End (E2E):** Pruebas automatizadas con Playwright o Cypress que cubran el flujo completo desde el registro hasta la simulación y exportación.
2. **Cumplimiento Normativo y Protección de Datos:**
   * Políticas de tratamiento de datos personales conforme a la **Ley 1581 de 2012 de Colombia** (Habeas Data).
   * Cifrado en tránsito (HTTPS/TLS) y en reposo para información financiera sensible.
3. **Integración Continua y Despliegue Continuo (CI/CD):**
   * Pipeline en GitHub Actions para ejecución automática de linter (`ESLint`), pruebas unitarias y compilación (`npm run build`).
   * Despliegue automatizado en plataformas cloud de alta disponibilidad (Vercel, AWS Amplify o Render).

---

## 💻 5. Guía Rápida para la Evaluación del Prototipo

Para ejecutar y validar el prototipo de manera local durante la revisión:

```bash
# 1. Clonar el repositorio
git clone https://github.com/Moshua53/financiamiento.git
cd financiamiento

# 2. Instalar dependencias
npm install

# 3. Iniciar entorno de desarrollo
npm run dev
```

* El sistema estará disponible en `http://localhost:5173`.
* **Prueba rápida:** Hacer clic en el botón superior **"Cargar Demo"** para cargar de forma inmediata un escenario completo listo para comparar y simular.
* **Documentación complementaria:**
  * Historias de Usuario: [`docs/HISTORIAS_DE_USUARIO.md`](file:///c:/Users/Asus/Documents/GitHub/financimiento/docs/HISTORIAS_DE_USUARIO.md)
  * Proceso BPMN 2.0: [`docs/BPMN_PROCESO.md`](file:///c:/Users/Asus/Documents/GitHub/financimiento/docs/BPMN_PROCESO.md)
  * Visor Interactivo BPMN: [`docs/bpmn-proceso-finanemprende.html`](file:///c:/Users/Asus/Documents/GitHub/financimiento/docs/bpmn-proceso-finanemprende.html)

---

## 🏆 6. Conclusión de la Entrega

El prototipo funcional entregado representa una solución sólida, interactiva y técnicamente sustentada. Supera el concepto de un simple catálogo al incorporar un **motor de evaluación de capacidad de pago y reglas de validación en tiempo real**, proporcionando al emprendedor una herramienta intuitiva que mitiga el riesgo de endeudamiento insostenible y democratiza el acceso a la información financiera en Colombia.
