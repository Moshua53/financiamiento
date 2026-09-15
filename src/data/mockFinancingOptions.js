// Catálogo de alternativas de financiación en Colombia

export const mockFinancingOptions = [
  {
    id: "bancolombia-pyme",
    name: "Línea Emprendedores y Pymes",
    institution: "Bancolombia",
    category: "Bancario",
    badge: "Tasa Competitiva",
    minAmount: 10000000,
    maxAmount: 150000000,
    minTerm: 12,
    maxTerm: 60,
    rateEA: 21.5,
    approvalTime: "5 - 8 días hábiles",
    repaymentType: "Cuota fija mensual",
    requirements: [
      "Mínimo 12 meses de constitución en Cámara de Comercio",
      "Estados financieros de los dos últimos años",
      "Flujo de caja proyectado",
      "Historial crediticio positivo (Datacrédito)"
    ],
    advantages: [
      "Montos altos con plazos de hasta 5 años",
      "Tasas reguladas más bajas del mercado",
      "Posibilidad de período de gracia inicial de 6 meses"
    ],
    disadvantages: [
      "Requisitos documentales estrictos",
      "Requiere historial crediticio y respaldo patrimonial"
    ],
    entityUrl: "https://www.bancolombia.com/negocios/creditos",
    description: "Crédito comercial formal estructurado para expansión de operaciones, maquinaria o liquidez con respaldo bancario tradicional."
  },
  {
    id: "sempli-fintech",
    name: "Crédito Digital para Crecimiento",
    institution: "Sempli Fintech",
    category: "Fintech",
    badge: "Aprobación 48h",
    minAmount: 5000000,
    maxAmount: 80000000,
    minTerm: 6,
    maxTerm: 36,
    rateEA: 26.8,
    approvalTime: "24 - 48 horas",
    repaymentType: "Cuota fija mensual digital",
    requirements: [
      "Mínimo 6 meses de facturación continua",
      "Facturación mensual demostrable > $ 8.000.000 COP",
      "RUT y cédula del representante legal",
      "Extractos bancarios últimos 3 meses"
    ],
    advantages: [
      "Proceso 100% digital sin filas ni papeleo físico",
      "Desembolso ultrarrápido en menos de 48 horas",
      "Sin necesidad de garantías hipotecarias"
    ],
    disadvantages: [
      "Tasa de interés ligeramente superior a la banca tradicional",
      "Plazos máximos más cortos (hasta 36 meses)"
    ],
    entityUrl: "https://sempli.co",
    description: "Financiación digital inteligente diseñada a la medida de pequeñas y medianas empresas en etapa de aceleración comercial."
  },
  {
    id: "fondo-emprender",
    name: "Capital Semilla No Reembolsable",
    institution: "Fondo Emprender (SENA)",
    category: "Capital Semilla",
    badge: "Condonable 100%",
    minAmount: 20000000,
    maxAmount: 95000000,
    minTerm: 12,
    maxTerm: 24,
    rateEA: 0,
    approvalTime: "2 - 4 meses (Convocatorias)",
    repaymentType: "Condonable (No se devuelve al cumplir metas)",
    requirements: [
      "Emprendedor colombiano o egresado SENA/Universidad",
      "Plan de negocio formulado y validado en plataforma SENA",
      "Compromiso de generación de al menos 3 a 5 empleos formales",
      "Dedicación de tiempo completo al proyecto"
    ],
    advantages: [
      "0% de interés y recursos 100% no reembolsables si cumples los hitos",
      "Acompañamiento y mentoría técnica gratuita de gestores expertos",
      "No exige garantías crediticias previas"
    ],
    disadvantages: [
      "Proceso largo y altamente competitivo por convocatorias",
      "Auditorías e interventoría rigurosa sobre cada peso gastado"
    ],
    entityUrl: "https://www.fondoemprender.com",
    description: "Capital inicial del Estado colombiano para proyectos innovadores con alta capacidad de generación de empleo formal."
  },
  {
    id: "bancamia-micro",
    name: "Microcrédito Crecer Negocio",
    institution: "Bancamía",
    category: "Microcrédito",
    badge: "Fácil Acceso",
    minAmount: 1500000,
    maxAmount: 30000000,
    minTerm: 6,
    maxTerm: 36,
    rateEA: 34.5,
    approvalTime: "3 - 5 días hábiles",
    repaymentType: "Cuotas semanales, quincenales o mensuales",
    requirements: [
      "Mínimo 6 meses de actividad comercial (formal o informal)",
      "Visita en el punto de negocio por un asesor de crédito",
      "Cédula de ciudadanía del titular",
      "Referencias personales y comerciales"
    ],
    advantages: [
      "Excelente para negocios informales o con poco historial bancario",
      "Asesoramiento financiero presencial y personalizado",
      "Construcción de historial crediticio positivo"
    ],
    disadvantages: [
      "Tasa de interés de microcrédito más elevada",
      "Montos iniciales más limitados"
    ],
    entityUrl: "https://www.bancamia.com.co",
    description: "Microfinanzas orientadas a microempresarios y trabajadores independientes que necesitan comprar inventario o herramientas."
  },
  {
    id: "a2censo-crowd",
    name: "Campaña de Deuda Colaborativa",
    institution: "A2censo (Bolsa de Valores de Colombia)",
    category: "Crowdfunding",
    badge: "Visibilidad de Marca",
    minAmount: 50000000,
    maxAmount: 300000000,
    minTerm: 12,
    maxTerm: 48,
    rateEA: 19.8,
    approvalTime: "3 - 5 semanas",
    repaymentType: "Pago trimestral o mensual a inversionistas",
    requirements: [
      "Sociedad comercial SAS constituida con 1 año de operación",
      "Ventas anuales superiores a $ 200.000.000 COP",
      "Información financiera dictaminada",
      "Pitch y campaña audiovisual para la comunidad inversionista"
    ],
    advantages: [
      "Financiación colectiva por cientos de pequeños inversionistas",
      "Gran exposición comercial y validación de mercado para tu marca",
      "Tasas competitivas definidas por el mercado"
    ],
    disadvantages: [
      "Requiere esfuerzo de comunicación y campaña de atracción",
      "Comisión de estructuración de la plataforma BVC"
    ],
    entityUrl: "https://a2censo.com",
    description: "Plataforma oficial de crowdfunding financiero de la BVC donde ciudadanos invierten directamente en empresas en crecimiento."
  },
  {
    id: "angeles-inversion",
    name: "Inversión Ángel (Smart Money)",
    institution: "Red de Ángeles Inversionistas",
    category: "Inversionistas",
    badge: "Smart Money & Redes",
    minAmount: 40000000,
    maxAmount: 250000000,
    minTerm: 36,
    maxTerm: 60,
    rateEA: 0,
    approvalTime: "1 - 3 meses de debida diligencia",
    repaymentType: "Participación accionaria (Equity 5% - 15%)",
    requirements: [
      "Modelo de negocio altamente escalable o base tecnológica",
      "Equipo fundador complementario y con tracción demostrable",
      "Pitch deck y modelo financiero de proyecciones a 3-5 años",
      "Disposición a ceder porcentaje accionario y cupo en junta"
    ],
    advantages: [
      "No genera cuotas mensuales ni deudas que ahoguen la liquidez",
      "Contactos de alto nivel comercial, mentoría y gobernanza empresarial",
      "Acompañamiento en rondas futuras de Venture Capital"
    ],
    disadvantages: [
      "Dilución de la propiedad del emprendimiento",
      "Exigencia de altos retornos y rendición periódica de cuentas"
    ],
    entityUrl: "https://colombiacapital.org",
    description: "Empresarios experimentados que invierten capital privado a cambio de acciones y aportan su red de contactos y conocimiento."
  },
  {
    id: "addi-negocios",
    name: "Línea Rotativa de Liquidez Inmediata",
    institution: "Addi / Bold Capital",
    category: "Fintech",
    badge: "100% Automatizado",
    minAmount: 3000000,
    maxAmount: 40000000,
    minTerm: 3,
    maxTerm: 18,
    rateEA: 28.2,
    approvalTime: "Menos de 1 hora",
    repaymentType: "Débito automático sobre ventas diarias",
    requirements: [
      "Procesar cobros con datáfono Bold o Addi Pay",
      "Mínimo 3 meses usando la pasarela de pagos",
      "Cédula y cuenta bancaria colombiana"
    ],
    advantages: [
      "Aprobación instantánea basada en tu historial de cobros",
      "Los pagos se descuentan automáticamente de tus ventas del día a día",
      "Sin trámites notariales ni garantías"
    ],
    disadvantages: [
      "Plazos más reducidos",
      "Solo para comercios que utilicen sus soluciones de cobro"
    ],
    entityUrl: "https://co.addi.com",
    description: "Anticipo de capital de trabajo y cupo rotativo que se amortiza automáticamente conforme cobras a tus clientes."
  }
];

export const mockDefaultProfile = {
  name: "EcoModa Sostenible SAS",
  founder: "Moises Galindo",
  sector: "Moda y Manufactura",
  stage: "Crecimiento Temprano",
  city: "Medellín, Antioquia",
  yearsOperating: 2,
  employees: 4,
  monthlySales: 18000000,
  monthlyCosts: 11500000,
  description: "Marca de ropa urbana confeccionada con textiles reciclados y algodón orgánico nacional, comercializada vía e-commerce y tiendas concepto."
};

export const mockDefaultNeed = {
  amount: 35000000,
  termMonths: 24,
  purpose: "Maquinaria y Tecnología",
  purposeDetails: "Adquisición de cortadora láser industrial y ampliación del inventario de materias primas para atender temporada de fin de año.",
  maxAcceptableRate: 28
};
