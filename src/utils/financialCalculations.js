// Utilidades de cálculos financieros institucionales para Financia+
// Cumplimiento de estándares de banca comercial y regulación colombiana (SFC)

export const DEFAULT_REFERENCE_RATE_EA = 22.0;

// Tasa de Usura Referencial Superintendencia Financiera de Colombia (SFC)
export const COLOMBIAN_USURY_RATE_EA = 38.5;

/**
 * Formatea un valor monetario en Pesos Colombianos con tipografía y convención institucional
 * Ejemplo: "$ 35.000.000 COP"
 */
export function formatCOP(value) {
  if (value === null || value === undefined || isNaN(value)) return '$ 0 COP';
  const rounded = Math.round(Number(value));
  const formatted = new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(rounded);
  return `$ ${formatted} COP`;
}

/**
 * Convierte Tasa Efectiva Anual (% E.A.) a Tasa Mensual Vencida (decimal)
 * Fórmula: i_MV = (1 + i_EA)^(1/12) - 1
 */
export function eaToMonthlyRate(rateEA) {
  if (!rateEA || rateEA <= 0) return 0;
  return Math.pow(1 + (Number(rateEA) / 100), 1 / 12) - 1;
}

/**
 * Verifica si una tasa sobrepasa el límite legal de usura en Colombia
 */
export function isOverUsuryLimit(rateEA) {
  const numericRate = Number(rateEA) || 0;
  return {
    isUsury: numericRate > COLOMBIAN_USURY_RATE_EA,
    rateEA: numericRate,
    limitEA: COLOMBIAN_USURY_RATE_EA,
    differential: (numericRate - COLOMBIAN_USURY_RATE_EA).toFixed(2),
  };
}

/**
 * Calcula la cuota mensual fija mediante el Sistema Francés de Amortización
 * Fórmula: Cuota = Principal * [ i_MV * (1 + i_MV)^n ] / [ (1 + i_MV)^n - 1 ]
 */
export function calculateMonthlyPayment(principal, rateEA, termMonths) {
  const p = Number(principal);
  const n = Number(termMonths);
  if (!p || p <= 0 || !n || n <= 0) return 0;
  
  if (!rateEA || rateEA <= 0) {
    return Math.round(p / n);
  }

  const i = eaToMonthlyRate(rateEA);
  const factor = Math.pow(1 + i, n);
  const payment = p * (i * factor) / (factor - 1);
  return Math.round(payment);
}

/**
 * Genera el resumen financiero proyectado del crédito
 */
export function calculateLoanSummary(principal, rateEA, termMonths) {
  const p = Number(principal) || 0;
  const n = Number(termMonths) || 12;
  const rEA = Number(rateEA) || 0;
  
  const monthlyPayment = calculateMonthlyPayment(p, rEA, n);
  const totalPayment = monthlyPayment * n;
  const totalInterest = Math.max(0, totalPayment - p);
  const monthlyRatePercent = (eaToMonthlyRate(rEA) * 100).toFixed(2);
  const usuryStatus = isOverUsuryLimit(rEA);

  return {
    principal: p,
    rateEA: rEA,
    monthlyRatePercent,
    termMonths: n,
    monthlyPayment,
    totalPayment,
    totalInterest,
    interestRatio: p > 0 ? ((totalInterest / p) * 100).toFixed(1) : '0.0',
    isUsury: usuryStatus.isUsury,
    usuryLimit: COLOMBIAN_USURY_RATE_EA,
  };
}

/**
 * Evalúa la calificación crediticia institucional de acuerdo al compromiso sobre las ventas
 * Matriz de Solvencia:
 * - A-1 / Solvencia Alta: Cuota <= 20% de ventas
 * - B-2 / Capacidad Aceptable: Cuota entre 20% y 35% de ventas
 * - C-3 / Límite Excedido: Cuota > 35% de ventas
 */
export function evaluateFinancialCapacity(monthlyPayment, monthlySales, monthlyCosts) {
  const sales = Number(monthlySales) || 0;
  const costs = Number(monthlyCosts) || 0;

  if (sales <= 0) {
    return { 
      status: 'neutral', 
      code: 'N/A',
      color: 'neutral',
      label: 'Sin Declaración de Ingresos', 
      pillLabel: 'N/A / Sin Datos',
      description: 'Ingresa las ventas mensuales en el Paso 1 para calcular la calificación crediticia institucional.',
      debtRatio: '0.0',
      badgeClasses: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    };
  }

  const payment = Number(monthlyPayment) || 0;
  const debtRatio = (payment / sales) * 100;
  const freeCashFlow = Math.max(0, sales - costs);
  const maxSafePayment = freeCashFlow * 0.35;

  if (debtRatio <= 20) {
    return {
      status: 'success',
      code: 'A-1',
      color: 'emerald',
      label: 'A-1 / Solvencia Alta',
      pillLabel: 'A-1 • Solvencia Alta',
      description: `Compromiso prudente (${debtRatio.toFixed(1)}% de ventas). Estructura saludable para aprobación en banca corporativa y fintechs.`,
      debtRatio: debtRatio.toFixed(1),
      maxSafePayment,
      badgeClasses: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    };
  } else if (debtRatio <= 35) {
    return {
      status: 'warning',
      code: 'B-2',
      color: 'amber',
      label: 'B-2 / Capacidad Aceptable',
      pillLabel: 'B-2 • Capacidad Aceptable',
      description: `Compromiso en vigilancia (${debtRatio.toFixed(1)}% de ventas). Operación viable pero se recomienda verificar amortiguación de caja.`,
      debtRatio: debtRatio.toFixed(1),
      maxSafePayment,
      badgeClasses: 'bg-amber-50 text-amber-800 border-amber-200',
    };
  } else {
    return {
      status: 'danger',
      code: 'C-3',
      color: 'rose',
      label: 'C-3 / Límite Excedido',
      pillLabel: 'C-3 • Límite Excedido',
      description: `Riesgo de sobreendeudamiento (${debtRatio.toFixed(1)}% de ventas). La cuota proyectada compromete la liquidez operativa.`,
      debtRatio: debtRatio.toFixed(1),
      maxSafePayment,
      badgeClasses: 'bg-rose-50 text-rose-800 border-rose-200',
    };
  }
}

/**
 * Genera la tabla completa de amortización (Sistema Francés)
 * @returns Array con el detalle mes a mes
 */
export function generateAmortizationSchedule(principal, rateEA, termMonths) {
  const p = Number(principal) || 0;
  const n = Number(termMonths) || 12;
  const rEA = Number(rateEA) || 0;

  if (p <= 0 || n <= 0) return [];

  const i = eaToMonthlyRate(rEA);
  const monthlyPayment = calculateMonthlyPayment(p, rEA, n);

  let balance = p;
  const schedule = [];

  for (let month = 1; month <= n; month++) {
    const interestPaid = Math.round(balance * i);
    let principalPaid = monthlyPayment - interestPaid;

    // Ajuste en última cuota para evitar residuos de redondeo
    if (month === n || balance - principalPaid < 0) {
      principalPaid = balance;
    }

    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      period: month,
      monthlyPayment: principalPaid + interestPaid,
      interestPaid,
      principalPaid,
      remainingBalance: balance,
    });

    if (balance <= 0) break;
  }

  return schedule;
}

/**
 * Exporta la tabla de amortización a un archivo CSV descargable en el navegador
 */
export function downloadAmortizationCSV(schedule, fileName = 'tabla_amortizacion_financia.csv') {
  if (!schedule || schedule.length === 0) return;

  const headers = ['Periodo (Mes)', 'Cuota Fija (COP)', 'Interes (COP)', 'Abono Capital (COP)', 'Saldo Restante (COP)'];
  const rows = schedule.map(row => [
    row.period,
    row.monthlyPayment,
    row.interestPaid,
    row.principalPaid,
    row.remainingBalance,
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map(r => r.join(';'))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
