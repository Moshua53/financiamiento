// Utilidades de cálculos financieros para emprendedores

/**
 * Formatea un número como moneda en Pesos Colombianos (COP)
 */
export function formatCOP(value) {
  if (value === null || value === undefined || isNaN(value)) return '$ 0 COP';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value) + ' COP';
}

/**
 * Convierte Tasa Efectiva Anual (% E.A.) a Tasa Mensual Vencida (decimal)
 */
export function eaToMonthlyRate(rateEA) {
  if (!rateEA || rateEA <= 0) return 0;
  return Math.pow(1 + (rateEA / 100), 1 / 12) - 1;
}

/**
 * Calcula la cuota mensual fija (Sistema Francés)
 * @param {number} principal - Monto solicitado
 * @param {number} rateEA - Tasa Efectiva Anual en porcentaje (ej: 24.5)
 * @param {number} termMonths - Plazo en meses
 */
export function calculateMonthlyPayment(principal, rateEA, termMonths) {
  if (!principal || principal <= 0 || !termMonths || termMonths <= 0) return 0;
  
  if (!rateEA || rateEA <= 0) {
    return principal / termMonths;
  }

  const i = eaToMonthlyRate(rateEA);
  const n = termMonths;
  const factor = Math.pow(1 + i, n);
  const payment = principal * (i * factor) / (factor - 1);
  return Math.round(payment);
}

/**
 * Genera el resumen financiero proyectado
 */
export function calculateLoanSummary(principal, rateEA, termMonths) {
  const monthlyPayment = calculateMonthlyPayment(principal, rateEA, termMonths);
  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalPayment - principal);
  const monthlyRatePercent = (eaToMonthlyRate(rateEA) * 100).toFixed(2);

  return {
    principal,
    rateEA,
    monthlyRatePercent,
    termMonths,
    monthlyPayment,
    totalPayment,
    totalInterest,
    interestRatio: principal > 0 ? ((totalInterest / principal) * 100).toFixed(1) : 0
  };
}

/**
 * Evalúa el semáforo de capacidad financiera
 * @param {number} monthlyPayment - Cuota calculada
 * @param {number} monthlySales - Ventas mensuales declaradas
 * @param {number} monthlyCosts - Costos y gastos mensuales declarados
 */
export function evaluateFinancialCapacity(monthlyPayment, monthlySales, monthlyCosts) {
  if (!monthlySales || monthlySales <= 0) {
    return { status: 'neutral', label: 'Sin datos suficientes', percent: 0 };
  }

  const netIncome = Math.max(0, monthlySales - (monthlyCosts || 0));
  const debtRatio = (monthlyPayment / monthlySales) * 100;

  if (debtRatio <= 20) {
    return {
      status: 'success',
      color: 'emerald',
      label: 'Endeudamiento Saludable',
      description: `La cuota representa el ${debtRatio.toFixed(1)}% de tus ingresos mensuales.`,
      debtRatio: debtRatio.toFixed(1)
    };
  } else if (debtRatio <= 35) {
    return {
      status: 'warning',
      color: 'amber',
      label: 'Endeudamiento Moderado',
      description: `La cuota representa el ${debtRatio.toFixed(1)}% de tus ingresos. Es viable pero requiere control.`,
      debtRatio: debtRatio.toFixed(1)
    };
  } else {
    return {
      status: 'danger',
      color: 'rose',
      label: 'Riesgo de Sobreendeudamiento',
      description: `La cuota compromete el ${debtRatio.toFixed(1)}% de tus ingresos mensuales. Se recomienda mayor plazo o menor monto.`,
      debtRatio: debtRatio.toFixed(1)
    };
  }
}
