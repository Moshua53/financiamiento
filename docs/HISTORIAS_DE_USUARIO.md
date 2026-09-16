# Especificación y Cumplimiento de Historias de Usuario — FinanEmprende

**Proyecto:** FinanEmprende — Búsqueda de Alternativas de Financiamiento para Emprendedores  
**Autores del Proyecto:**  
- Moises Joshua Herrera Galindo  
- Juan Sebastián Molina Ballesteros  
- Miguel Angel Gallego Franco  
- Sebastián Rendón Grisales  

**Materia / Contexto:** Entrega 1 — Prototipo Funcional Interactivo  
**Stack Tecnológico:** React 18, Vite, Tailwind CSS, Lucide Icons, Math Financial Engine  
**Estado:** 10 Historias de Usuario Implementadas y Verificadas (100% Cobertura Entrega 1)  

---

## 📊 1. Resumen Ejecutivo de Cobertura

El prototipo se centra en el rol principal de **Emprendedor** y solventa de extremo a extremo la problemática de asimetría de información y sobreendeudamiento al buscar financiamiento en Colombia.

| Código | Historia de Usuario | Módulo / Paso | Estado | Componente Principal |
| :---: | :--- | :---: | :---: | :--- |
| **HU-01** | Registrar emprendimiento | Paso 1 | ✅ Cumplida | `src/components/ProfileStep.jsx` |
| **HU-02** | Registrar información financiera | Paso 1 | ✅ Cumplida | `src/components/ProfileStep.jsx` + `financialCalculations.js` |
| **HU-04** | Definir necesidad de financiación | Paso 2 | ✅ Cumplida | `src/components/NeedStep.jsx` |
| **HU-05** | Consultar alternativas de financiación | Paso 3 | ✅ Cumplida | `src/components/CatalogStep.jsx` + `mockFinancingOptions.js` |
| **HU-06** | Filtrar alternativas de financiación | Paso 3 | ✅ Cumplida | `src/components/CatalogStep.jsx` |
| **HU-07** | Comparar alternativas lado a lado | Paso 3 (Modal) | ✅ Cumplida | `src/components/CompareModal.jsx` |
| **HU-08** | Consultar costos financieros | Pasos 3 y 4 | ✅ Cumplida | `src/utils/financialCalculations.js` |
| **HU-09** | Consultar ventajas y desventajas | Pasos 3 y 4 | ✅ Cumplida | `src/components/CatalogStep.jsx` + `CompareModal.jsx` |
| **HU-10** | Consultar entidades financieras | Pasos 3 y 4 | ✅ Cumplida | `src/components/CatalogStep.jsx` + `SimulatorView.jsx` |
| **HU-11** | Simular financiación y capacidad de pago | Paso 4 | ✅ Cumplida | `src/components/SimulatorView.jsx` + `financialCalculations.js` |

---

## 🔍 2. Fichas Técnicas Detalladas por Historia de Usuario

### 📌 HU-01: Registrar Emprendimiento
* **Enunciado:**  
  *Como* emprendedor,  
  *quiero* registrar la información básica, comercial y operacional de mi negocio,  
  *para* que la plataforma personalice la oferta de alternativas según el sector y estado de madurez de mi empresa.
* **Componente de Implementación:** [`src/components/ProfileStep.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/components/ProfileStep.jsx)
* **Datos Capturados:**
  1. Nombre comercial del negocio.
  2. Nombre del fundador o representante legal.
  3. Sector económico (`Tecnología y Software`, `Comercio y Retail`, `Manufactura e Industria`, `Alimentos y Gastronomía`, `Servicios Profesionales`, `Salud y Bienestar`).
  4. Etapa del negocio (`Idea / Prototipo`, `Temprana / Validación`, `Crecimiento / Tracción`, `Consolidado / Expansión`).
  5. Ciudad sede del negocio.
  6. Años de operación en el mercado.
  7. Número actual de empleados.
  8. Descripción general del modelo de negocio.
* **Criterios de Aceptación Cumplidos:**
  - [x] Validación de campos obligatorios (nombre, fundador, ciudad no vacíos).
  - [x] Si el usuario intenta continuar con campos faltantes, el sistema resalta los inputs en rojo y muestra mensajes de advertencia.
  - [x] Botón *"Cargar Datos Demo"* en la barra superior que precarga instantáneamente un emprendimiento ficticio (*EcoModa Sostenible SAS*).
  - [x] Bloqueo del Paso 2 hasta que este registro esté completo.

---

### 📌 HU-02: Registrar Información Financiera
* **Enunciado:**  
  *Como* emprendedor,  
  *quiero* registrar mis ingresos operacionales mensuales promedio y mis costos mensuales recurrentes,  
  *para* que la plataforma diagnostique mi flujo de caja y calcule mi capacidad real de endeudamiento.
* **Componente de Implementación:** [`src/components/ProfileStep.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/components/ProfileStep.jsx) y [`src/utils/financialCalculations.js`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/utils/financialCalculations.js)
* **Datos Capturados:**
  1. Ventas mensuales promedio en Pesos Colombianos ($ COP).
  2. Costos y gastos operacionales mensuales en Pesos Colombianos ($ COP).
* **Criterios de Aceptación Cumplidos:**
  - [x] Formateo monetario en tiempo real con separadores de miles estándar colombiano (`$ COP`).
  - [x] Validación estricta: `monthlySales > 0` y `monthlyCosts > 0`.
  - [x] **Diagnóstico Financiero Inmediato:** Panel lateral reactivo que calcula en tiempo real:
    - **Flujo de Caja Neto Mensual:** $\text{Ventas} - \text{Costos}$.
    - **Margen Operativo Estimado:** $\left(\frac{\text{Flujo Neto}}{\text{Ventas}}\right) \times 100$.
  - [x] Advertencia contextual si los costos superan a las ventas (margen negativo).

---

### 📌 HU-04: Definir Necesidad de Financiación
* **Enunciado:**  
  *Como* emprendedor,  
  *quiero* especificar el monto de capital que necesito, el plazo en meses y el destino de los recursos,  
  *para* filtrar las fuentes de financiamiento acordes a mi meta de inversión.
* **Componente de Implementación:** [`src/components/NeedStep.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/components/NeedStep.jsx)
* **Datos Capturados:**
  1. Monto requerido ($ COP): Selector con slider continuo y botones rápidos ($10M, $20M, $35M, $50M, $80M, $120M COP).
  2. Plazo proyectado en meses (6, 12, 18, 24, 36, 48 o 60 meses).
  3. Destino de los fondos (`Maquinaria y Tecnología`, `Capital de Trabajo / Stock`, `Expansión Comercial`, `Consolidación de Pasivos`).
  4. Detalle cualitativo del destino y tasa máxima de interés esperada (% E.A.).
* **Criterios de Aceptación Cumplidos:**
  - [x] Sliders interactivos con actualización instantánea de cifras.
  - [x] Tarjetas visuales de selección de destino con iconos alusivos.
  - [x] Resumen lateral con tarjeta de solicitud estructurada.
  - [x] Validación: si el monto es $\le 0$, no permite avanzar al Catálogo.

---

### 📌 HU-05: Consultar Alternativas de Financiación
* **Enunciado:**  
  *Como* emprendedor,  
  *quiero* consultar un catálogo completo y estructurado de fuentes de financiamiento del ecosistema colombiano,  
  *para* conocer las diferentes opciones tanto tradicionales como no tradicionales disponibles para mi empresa.
* **Componente de Implementación:** [`src/components/CatalogStep.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/components/CatalogStep.jsx) y [`src/data/mockFinancingOptions.js`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/data/mockFinancingOptions.js)
* **Criterios de Aceptación Cumplidos:**
  - [x] Catálogo con opciones representativas del ecosistema colombiano:
    - **Bancario Tradicional:** Línea Emprendedores y Pymes (Bancolombia).
    - **Fintech Digital:** Crédito Digital para Crecimiento (Sempli).
    - **Capital Semilla Estatal:** Fondo Emprender (SENA - Condonable al 100%).
    - **Microfinanzas:** Microcrédito Crecer Negocio (Bancamía).
    - **Crowdfunding de Deuda:** a2censo (BVC).
    - **Inversionistas Ángeles:** Red de Ángeles Inversionistas Colombia.
  - [x] Presentación en tarjetas legibles con insignia de categoría, plazos, tasa E.A. y tiempo de respuesta.
  - [x] Cálculo dinámico de la cuota mensual aproximada dentro de cada tarjeta con base en la necesidad del emprendedor.

---

### 📌 HU-06: Filtrar Alternativas de Financiación
* **Enunciado:**  
  *Como* emprendedor,  
  *quiero* filtrar y buscar alternativas por categoría, compatibilidad de monto y palabra clave,  
  *para* focalizar mi atención únicamente en las opciones viables para mi negocio.
* **Componente de Implementación:** [`src/components/CatalogStep.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/components/CatalogStep.jsx) (mediante hooks `useMemo` reactivos)
* **Criterios de Aceptación Cumplidos:**
  - [x] **Tabs por Categoría:** *Todas, Bancario, Fintech, Capital Semilla, Microcrédito, Crowdfunding, Inversionistas*.
  - [x] **Filtro de Coincidencia de Monto:** Checkbox *"Sólo opciones que cubran mi monto ($ X COP)"*, evaluando que $\text{minAmount} \le \text{monto} \le \text{maxAmount}$.
  - [x] **Buscador en Tiempo Real:** Input con debouncing para buscar por nombre de entidad, producto o palabra clave con botón de borrado rápido.
  - [x] **Contador Dinámico:** Muestra en tiempo real la cantidad de alternativas que satisfacen los filtros activos.

---

### 📌 HU-07: Comparar Alternativas Lado a Lado
* **Enunciado:**  
  *Como* emprendedor,  
  *quiero* comparar hasta 3 alternativas de financiamiento simultáneamente en una matriz frente a frente,  
  *para* evaluar cuál me ofrece mejores condiciones de tasa, cuota, plazos y requerimientos.
* **Componente de Implementación:** [`src/components/CompareModal.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/components/CompareModal.jsx) y estado global en [`src/App.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/App.jsx)
* **Criterios de Aceptación Cumplidos:**
  - [x] Checkboxes de selección de comparación en cada tarjeta del catálogo.
  - [x] Barra inferior flotante fija con contador de seleccionadas y botón *"Comparar ahora"*.
  - [x] Control de límite: Máximo 3 opciones simultáneas (con notificación Toast si se intenta agregar una cuarta).
  - [x] Modal responsive con visualización en columnas comparativas.
  - [x] **Insignia Automática:** Detección y distinción visual dorada (*"Tasa Más Baja"*) a la alternativa con menor Tasa E.A. del grupo comercial.
  - [x] Botón directo para pasar cualquiera de las opciones al simulador interactivo.

---

### 📌 HU-08: Consultar Costos Financieros
* **Enunciado:**  
  *Como* emprendedor,  
  *quiero* consultar el desglose exacto de los costos financieros (cuota mensual, total a pagar e intereses generados),  
  *para* tener certeza del costo del capital y no comprometer la liquidez de mi empresa.
* **Componentes de Implementación:** [`src/utils/financialCalculations.js`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/utils/financialCalculations.js) y [`src/components/SimulatorView.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/components/SimulatorView.jsx)
* **Criterios de Aceptación Cumplidos:**
  - [x] Cálculo matemático riguroso de la cuota fija mensual mediante el **Sistema Francés de Amortización**:
    $$\text{Cuota} = P \times \frac{i \times (1 + i)^n}{(1 + i)^n - 1}$$
  - [x] Conversión exacta de Tasa Efectiva Anual (% E.A.) a Tasa Mensual Vencida:
    $$i = (1 + i_{\text{E.A.}})^{1/12} - 1$$
  - [x] Desglose de:
    - Cuota fija mensual estimada.
    - Total de intereses acumulados proyectados.
    - Monto total pagado al finalizar el plazo.
    - Porcentaje que representan los intereses respecto al capital prestado.
  - [x] Gráfica de barra de progreso proporcional (Capital vs. Intereses).

---

### 📌 HU-09: Consultar Ventajas y Desventajas
* **Enunciado:**  
  *Como* emprendedor,  
  *quiero* conocer con claridad los pros, contras y requisitos documentales de cada alternativa,  
  *para* tomar una decisión equilibrada considerando no solo la tasa sino los tiempos de desembolso y el esfuerzo administrativo.
* **Componentes de Implementación:** [`src/components/CatalogStep.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/components/CatalogStep.jsx) y [`src/components/CompareModal.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/components/CompareModal.jsx)
* **Criterios de Aceptación Cumplidos:**
  - [x] Bloque de **Ventajas Principales** con iconos de verificación verde (ej: sin garantías hipotecarias, desembolso en 48 horas, acompañamiento técnico gratuito).
  - [x] Bloque de **Desventajas / Consideraciones** con iconos de alerta ámbar/rojo (ej: tasas más elevadas, auditorías estrictas, requisitos de historial comercial).
  - [x] Bloque de **Requisitos Documentales Obligatorios** (ej: Cámara de Comercio > 12 meses, estados financieros auditados, extractos bancarios recientes).

---

### 📌 HU-10: Consultar Información de las Entidades Otorgantes
* **Enunciado:**  
  *Como* emprendedor,  
  *quiero* ver información oficial sobre la entidad otorgante y disponer de enlaces directos a sus portales,  
  *para* iniciar el trámite formal de radicación en un canal seguro y verificado.
* **Componentes de Implementación:** [`src/components/CatalogStep.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/components/CatalogStep.jsx), [`src/components/CompareModal.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/components/CompareModal.jsx) y [`src/components/SimulatorView.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/components/SimulatorView.jsx)
* **Criterios de Aceptación Cumplidos:**
  - [x] Nombre institucional visible (Bancolombia, Sempli Fintech, Fondo Emprender SENA, Bancamía, etc.).
  - [x] Categorización formal de la entidad (Banca Tradicional, Fintech vigilada, Entidad Estatal, etc.).
  - [x] Botones de enlace externo con atributo `rel="noopener noreferrer"` y `target="_blank"` para redirigir directamente al portal oficial de créditos de cada entidad.

---

### 📌 HU-11: Simular Financiación y Capacidad de Endeudamiento
* **Enunciado:**  
  *Como* emprendedor,  
  *quiero* una calculadora financiera interactiva donde pueda calibrar monto, plazo y tasa en tiempo real, recibiendo alertas sobre mi capacidad de pago,  
  *para* validar la sostenibilidad de la deuda frente a los ingresos reales de mi negocio.
* **Componentes de Implementación:** [`src/components/SimulatorView.jsx`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/components/SimulatorView.jsx) y [`src/utils/financialCalculations.js`](file:///c:/Users/Asus/Documents/GitHub/financimiento/src/utils/financialCalculations.js)
* **Criterios de Aceptación Cumplidos:**
  - [x] Selector desplegable para cargar automáticamente los parámetros de una alternativa del catálogo o activar el modo *"Parámetros Libres / Ajuste Manual"*.
  - [x] Sliders bidireccionales en tiempo real para:
    - Monto del crédito ($ COP).
    - Plazo de amortización (meses).
    - Tasa Efectiva Anual (% E.A.).
  - [x] **Semáforo Algorítmico de Capacidad de Endeudamiento:**
    $$\text{Ratio de Endeudamiento} = \left( \frac{\text{Cuota Mensual Calculada}}{\text{Ventas Mensuales del Perfil (HU-02)}} \right) \times 100$$
    - **Nivel Verde (Saludable - $\le 20\%$):** Endeudamiento seguro que no compromete la liquidez operativa.
    - **Nivel Amarillo (Moderado - $20\% \text{ a } 35\%$):** Nivel viable pero que requiere control estricto del presupuesto.
    - **Nivel Rojo (Riesgo de Sobreendeudamiento - $> 35\%$):** Alerta crítica con recomendación de ampliar el plazo para amortiguar la cuota o reducir el monto solicitado.
  - [x] **Exportación / Impresión:** Botón *"Imprimir / Guardar PDF"* que invoca `window.print()` con estilos optimizados para reportes ejecutivos.

---

## 🧭 3. Matriz de Trazabilidad: HU vs. Flujo de Navegación vs. BPMN

```
[Inicio: Perfil] ──(HU-01, HU-02)──> [Paso 1: Validación y Margen]
                                             │ (S1, S2, S3)
                                             ▼
[Paso 2: Necesidad] ──(HU-04)───────> [Filtro de Monto/Plazo]
                                             │ (S4, S5)
                                             ▼
[Paso 3: Catálogo] ──(HU-05, HU-06)─> [Exploración y Filtrado]
       │
       ├──(HU-07, HU-08, HU-09)─────> [Modal Comparativo Frente a Frente]
       │                                     │
       ▼                                     ▼
[Paso 4: Simulador] ─(HU-11, HU-08)──> [Cálculo Francés & Semáforo]
       │
       └──(HU-10)────────────────────> [Redirección Externa a Entidad Oficial]
```

---

## 🏆 4. Conclusión de la Entrega 1

El sistema no se limita a un catálogo estático; opera como una **herramienta de diagnóstico y asesoría financiera reactiva**, cumpliendo a cabalidad con las 10 Historias de Usuario establecidas para la Entrega 1 y garantizando una experiencia de usuario (UX) fluida, accesible y respaldada por fórmulas financieras reales.
