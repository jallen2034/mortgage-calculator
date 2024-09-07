/**
 * Calculate the interest rate per payment period from the annual interest rate.
 *
 * To get the per-payment schedule rate:
 * 1. Convert the annual rate to a decimal (e.g., 5% becomes 0.05).
 * 2. Divide this decimal by the number of payment periods per year:
 *    - Monthly payments: divide by 12.
 *    - Bi-weekly payments: divide by 26.
 *    - Weekly payments: divide by 52.
 *
 * Example:
 * For an annual rate of 5% (0.05) and monthly payments:
 * r = 0.05 / 12 = 0.004167 (monthly interest rate).
 *
 * @param annualInterestRateDecimal - The annual interest rate as a decimal (e.g., 0.05 for 5%).
 * @param periodsPerYear - Number of payment periods per year (e.g., 12 for monthly).
 * @returns The interest rate per payment period as a decimal.
 */
const calculatePerPaymentScheduleInterestRate = (
  annualInterestRateDecimal: number,
  periodsPerYear: number
): number => {
  return annualInterestRateDecimal / periodsPerYear;
}

/**
 * Calculate the total number of payments over the amortization period.
 *
 * This function calculates the total number of payments to be made over the entire amortization period
 * based on the number of payment periods per year and the total number of years in the amortization period.
 *
 * For example:
 * - For an amortization period of 30 years with monthly payments (12 periods per year),
 *   the total number of payments would be 30 * 12 = 360 payments.
 * - For a 5-year amortization period with bi-weekly payments (26 periods per year),
 *   the total number of payments would be 5 * 26 = 130 payments.
 *
 * @param periodsPerYear - The number of payment periods in a year (e.g., 12 for monthly payments).
 * @param amortizationPeriod - The total amortization period in years (e.g., 30 years).
 * @returns The total number of payments over the amortization period.
 */
const calculateTotalNumberOfPaymentsOverAmortizationPeriod = (
  periodsPerYear: number,
  amortizationPeriod: number
) => {
  return periodsPerYear * amortizationPeriod;
}

/**
 * Converts an annual interest rate percentage to a decimal.
 * This function converts a percentage (e.g., 5%) to a decimal (e.g., 0.05).
 * Example:
 * For an annual rate of 5%:
 * decimalRate = 5 / 100 = 0.05
 * @param annualInterestRate - The annual interest rate as a percentage (e.g., 5 for 5%).
 * @returns The annual interest rate as a decimal (e.g., 0.05 for 5%).
 */
const convertInterestRateToDecimal = (annualInterestRate: number) => {
  return annualInterestRate / 100
}

/**
 * Determine the number of payment periods per year based on the payment schedule.
 *
 * @param paymentSchedule - The payment schedule as a string (e.g., "Monthly", "Bi-Weekly", "Accelerated Bi-Weekly").
 * @returns The number of payment periods per year (e.g., 12 for monthly, 26 for bi-weekly).
 * @throws Error if the payment schedule is invalid.
 */
const getPeriodsPerYear = (
  paymentSchedule: "Monthly" | "Bi-Weekly" | "Accelerated Bi-Weekly"
): number => {
  switch (paymentSchedule) {
    case "Monthly":
      return 12;
    case "Bi-Weekly":
      return 26;
    case "Accelerated Bi-Weekly":
      return 27;
    default:
      throw new Error(`Invalid payment schedule: ${paymentSchedule}`);
  }
}

/**
 * Calculate the monthly mortgage payment based on the principal, interest rate per period,
 * and total number of payments.
 *
 * Uses the formula:
 * M = (P * r * (1 + r)^n) / ((1 + r)^n - 1)
 *
 * @param principal - The principal amount (loan amount).
 * @param totalNumberOfPayments - The total number of payments over the amortization period.
 * @param perPaymentScheduleInterestRate - The interest rate per payment period.
 * @returns The payment amount per payment schedule.
 */
const calculateMonthlyMortgagePayment = (
  principal: number,
  totalNumberOfPayments: number,
  perPaymentScheduleInterestRate: number
): number => {
  // Handle the case where the interest rate is zero.
  if (perPaymentScheduleInterestRate === 0) {
    return principal / totalNumberOfPayments;
  }

  // Calculate the factor (1 + r)^n
  const factor: number = Math.pow(1 + perPaymentScheduleInterestRate, totalNumberOfPayments);

  // Calculate the numerator: P * r * (1 + r)^n
  const numerator: number = principal * perPaymentScheduleInterestRate * factor;

  // Calculate the denominator: (1 + r)^n - 1
  const denominator: number = factor - 1;

  // Calculate the monthly mortgage payment: numerator / denominator
  return numerator / denominator;
}

export {
  calculatePerPaymentScheduleInterestRate,
  convertInterestRateToDecimal,
  calculateTotalNumberOfPaymentsOverAmortizationPeriod,
  calculateMonthlyMortgagePayment,
  getPeriodsPerYear
}