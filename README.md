# FinanEmprende — Búsqueda de Alternativas de Financiamiento para Emprendedores

Mockup funcional e interactivo desarrollado en **React + Vite + Tailwind CSS** para la primera entrega del proyecto académico.

## 👥 Autores del Proyecto
- **Moises Joshua Herrera Galindo**
- **Juan Sebastián Molina Ballesteros**
- **Miguel Angel Gallego Franco**
- **Sebastián Rendón Grisales**

---

## 🎯 Historias de Usuario Implementadas (Entrega 1)

El prototipo se enfoca en el rol de **Emprendedor** y cubre las siguientes historias de usuario clave:

| Código | Historia de Usuario | Descripción en el Mockup |
| :--- | :--- | :--- |
| **HU-01** | Registrar emprendimiento | Formulario con nombre, sector, etapa, ciudad, empleados y tiempo de operación. |
| **HU-02** | Registrar información financiera | Captura de ventas y costos mensuales promedio para evaluar capacidad de pago. |
| **HU-04** | Definir necesidad de financiación | Selector con sliders interactivos de monto ($ COP), plazo (meses) y destino de los fondos. |
| **HU-05** | Consultar alternativas | Catálogo interactivo de opciones de financiación del ecosistema colombiano. |
| **HU-06** | Filtrar alternativas | Filtros por categoría (Bancario, Fintech, Capital Semilla, etc.), monto y buscador. |
| **HU-07** | Comparar alternativas | Modal comparativo lado a lado destacando cuotas, tasas y tiempos de respuesta. |
| **HU-08** | Consultar costos | Desglose de cuota estimada, intereses totales y costo final proyectado. |
| **HU-09** | Consultar ventajas y desventajas | Listado claro de pros y consideraciones de cada fuente financiera. |
| **HU-10** | Consultar entidades | Información de la entidad otorgante (Bancolombia, Sempli, Fondo Emprender, etc.). |
| **HU-11** | Simular financiación | Calculadora en tiempo real con sliders de monto, plazo y tasa (% E.A.), semáforo de capacidad de endeudamiento y desglose visual. |

---

## 🚀 Cómo ejecutar el proyecto localmente

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre en tu navegador la URL que indique la consola (normalmente `http://localhost:5173`).

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## ✨ Funcionalidades destacadas para la sustentación

- **Botón "Cargar Datos Demo":** Ubicado en la barra superior, rellena al instante el perfil con un negocio ejemplo (*EcoModa Sostenible SAS*), facilitando una presentación fluida ante evaluadores.
- **Simulador en tiempo real:** Utiliza fórmulas financieras reales (sistema de amortización francés de cuota fija) y conversión de tasa E.A. a mensual.
- **Semáforo de capacidad de endeudamiento:** Cruza la cuota calculada contra los ingresos del emprendimiento para alertar si el nivel de endeudamiento es saludable (< 20%), moderado (20-35%) o riesgoso (> 35%).
