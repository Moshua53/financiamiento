# 🚀 FinanEmprende — Búsqueda & Simulación de Financiamiento para Emprendedores

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Entrega_1-Completa-10B981)](#-historias-de-usuario-implementadas)

> **FinanEmprende** es una plataforma web interactiva diseñada para guiar a emprendedores y MiPymes colombianas en el descubrimiento, comparación y simulación de alternativas de financiamiento formal (banca tradicional, fintechs, fondos públicos y capital semilla).

---

## 👥 Equipo y Autores
- **Moises Joshua Herrera Galindo**
- **Juan Sebastián Molina Ballesteros**
- **Miguel Angel Gallego Franco**
- **Sebastián Rendón Grisales**

---

## 🎯 Historias de Usuario Implementadas (Entrega 1)

El prototipo se centra en el rol de **Emprendedor** y cubre las historias de usuario clave mediante un flujo guiado en 4 pasos con validaciones en tiempo real:

| Código | Historia de Usuario | Módulo / Componente | Descripción en la Plataforma |
| :--- | :--- | :--- | :--- |
| **HU-01** | Registrar emprendimiento | *Paso 1: Perfil* | Formulario comercial (nombre, NIT, sector, ciudad, tiempo de operación y etapa). |
| **HU-02** | Registrar información financiera | *Paso 1: Perfil* | Captura de ventas, costos fijos y cálculo automático del margen operativo y solvencia. |
| **HU-04** | Definir necesidad de financiación | *Paso 2: Necesidad* | Sliders y selectores interactivos de monto ($ COP), plazo (meses) y destino de inversión. |
| **HU-05** | Consultar alternativas | *Paso 3: Catálogo* | Catálogo interactivo con fichas de entidades bancarias, fintechs y fondos en Colombia. |
| **HU-06** | Filtrar alternativas | *Paso 3: Catálogo* | Filtros dinámicos por categoría (Bancario, Fintech, Gubernamental), monto y búsqueda libre. |
| **HU-07** | Comparar alternativas | *Paso 3: Comparador* | Modal comparativo lado a lado (frente a frente) de hasta 3 alternativas simultáneas. |
| **HU-08** | Consultar costos | *Paso 3 & 4* | Desglose de cuota estimada, costo total proyectado y tasa efectiva anual (E.A.). |
| **HU-09** | Consultar pros y contras | *Paso 3 & Comparador* | Identificación explícita de ventajas, desventajas y requisitos documentales. |
| **HU-10** | Consultar entidades | *Paso 3 & 4* | Fichas institucionales con enlaces directos a las páginas oficiales de cada entidad. |
| **HU-11** | Simular financiación | *Paso 4: Simulador* | Simulador en tiempo real con sistema de amortización francés, semáforo de capacidad de pago y ficha imprimible. |

---

## 💡 Características Principales

1. **Flujo Secuencial Guiado:** Stepper interactivo con validación de campos obligatorios y candados que garantizan que el emprendedor complete su perfil antes de comparar o simular.
2. **Botón "Cargar Demo":** Ubicado en la barra de navegación superior, carga instantáneamente un perfil preconfigurado (*EcoModa Sostenible SAS*) desbloqueando todo el flujo para presentaciones rápidas.
3. **Simulador Financiero Riguroso:** Implementa amortización fija francesa, conversión de tasa Efectiva Anual (E.A.) a tasa periódica mensual y cálculo del Costo Financiero Total (CFT).
4. **Semáforo de Endeudamiento:** Evalúa la cuota proyectada contra el flujo de caja del negocio:
   - 🟢 **Saludable (< 20%):** Riego bajo de sobreendeudamiento.
   - 🟡 **Moderado (20% - 35%):** Nivel manejable con cautela.
   - 🔴 **Riesgoso (> 35%):** Alerta al emprendedor sobre comprometer su capital de trabajo.
5. **Dark Mode OLED & Light Mode:** Paleta de diseño profesional de alto contraste con tipografía IBM Plex Sans / Inter y micro-animaciones fluidas.
6. **Exportación / Impresión:** Función de impresión de ficha técnica optimizada para PDF o papel.

---

## 📐 Modelo de Procesos de Negocio (BPMN 2.0)

La documentación de procesos de la plataforma sigue el estándar internacional **BPMN 2.0**:

- 📄 **Especificación Detallada:** [docs/BPMN_PROCESO.md](docs/BPMN_PROCESO.md) (incluye piscinas, carriles, eventos, compuertas lógicas y matriz de trazabilidad HU-BPMN).
- 🌐 **Diagrama Interactivo Standalone:** [docs/bpmn-proceso-finanemprende.html](docs/bpmn-proceso-finanemprende.html) (visualizable en cualquier navegador moderno con zoom y temas).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS 3](https://tailwindcss.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Modelado:** Mermaid & BPMN 2.0

---

## 📦 Instalación y Ejecución Local

### Prerrequisitos
- [Node.js](https://nodejs.org/) v18.0 o superior
- [npm](https://www.npmjs.com/) v9.0 o superior

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Moshua53/financiamiento.git
   cd financiamiento
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor local de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre tu navegador en `http://localhost:5173`.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

5. **Previsualizar la compilación de producción:**
   ```bash
   npm run preview
   ```

---

## 📁 Estructura del Proyecto

```text
financiamiento/
├── docs/                             # Documentación de procesos y BPMN 2.0
│   ├── BPMN_PROCESO.md               # Modelo BPMN detallado y matriz de trazabilidad
│   └── bpmn-proceso-finanemprende.html # Visualizador HTML del diagrama BPMN
├── src/
│   ├── components/                   # Componentes React modularizados
│   │   ├── CatalogStep.jsx           # Catálogo de alternativas (HU-05, HU-06)
│   │   ├── CompareModal.jsx          # Matriz comparativa lado a lado (HU-07, HU-08, HU-09)
│   │   ├── Navbar.jsx                # Barra de navegación con botón Demo y Dark Mode
│   │   ├── NeedStep.jsx              # Definición de necesidad de capital (HU-04)
│   │   ├── ProfileStep.jsx           # Datos del negocio y finanzas (HU-01, HU-02)
│   │   ├── SimulatorView.jsx         # Simulador de cuotas y semáforo (HU-11)
│   │   └── Stepper.jsx               # Navegación secuencial con candados
│   ├── data/
│   │   └── financingOptions.js       # Base de conocimiento de opciones financieras en Colombia
│   ├── utils/
│   │   └── financialCalculations.js  # Fórmulas de amortización, conversión de tasas y formato COP
│   ├── App.jsx                       # Componente principal y gestión de estado global
│   ├── index.css                     # Estilos globales y utilidades personalizadas
│   └── main.jsx                      # Punto de entrada de React
├── .gitignore                        # Reglas de exclusión de Git y seguridad
├── LICENSE                           # Licencia MIT
├── package.json                      # Dependencias y scripts del proyecto
├── README.md                         # Documentación general del repositorio
└── vite.config.js                    # Configuración de Vite
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).
