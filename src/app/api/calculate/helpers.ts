/* Calculate the interest rate per payment period from the annual interest rate getting the per-payment schedule rate:
 * 1. Convert the annual rate to a decimal (e.g., 5% becomes 0.05).
 * 2. Divide this decimal by the number of payment periods per year:
 *    - Monthly payments: divide by 12.
 *    - Bi-weekly payments: divide by 26.
 *    - Weekly payments: divide by 52.
 * Example: For an annual rate of 5% (0.05) and monthly payments:
 * r = 0.05 / 12 = 0.004167 (monthly interest rate). */
const calculatePerPaymentScheduleInterestRate = (
  annualInterestRateDecimal: number,
  periodsPerYear: number
): number => {
  return annualInterestRateDecimal / periodsPerYear;
}

//Calculate the CMHC insurance premium based on the insurance rate and mortgage amount.
const calculateCMHCInsurancePremium = (
  insuranceRate: number,
  mortgageAmountBeforeInsurance: number
): number => {
  return insuranceRate * mortgageAmountBeforeInsurance;
}

/* Calculate the total number of payments over the amortization period.
 * This function calculates the total number of payments to be made over the entire amortization period
 * based on the number of payment periods per year and the total number of years in the amortization period.
 * For example:
 * - For an amortization period of 30 years with monthly payments (12 periods per year),
 *   the total number of payments would be 30 * 12 = 360 payments.
 * - For a 5-year amortization period with bi-weekly payments (26 periods per year),
 *   the total number of payments would be 5 * 26 = 130 payments. */
const calculateTotalNumberOfPaymentsOverAmortizationPeriod = (
  periodsPerYear: number,
  amortizationPeriod: number
): number => {
  return periodsPerYear * amortizationPeriod;
}

/* Converts an annual interest rate percentage to a decimal.
 * This function converts a percentage (e.g., 5%) to a decimal (e.g., 0.05).
 * Example: For an annual rate of 5%:
 * decimalRate = 5 / 100 = 0.05 */
const convertInterestRateToDecimal = (annualInterestRate: number): number => {
  return annualInterestRate / 100
}

// Determine the number of payment periods per year based on the payment schedule.
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

// Calculate the CMHC insurance rate based on the down payment percentage.
const calculateCMHCInsuranceRate = (
  propertyPrice: number,
  downPayment: number
): number => {
  // Calculate the percentage of down payment
  const downPaymentPercentage: number = (downPayment / propertyPrice) * 100;

  // Determine the CMHC insurance rate based on the down payment percentage
  switch (true) {
    case downPaymentPercentage < 10:
      return 0.045; // 4.50%
    case downPaymentPercentage < 15:
      return 0.031; // 3.10%
    case downPaymentPercentage < 20:
      return 0.028; // 2.80%
    default:
      return 0; // 0% if 20% or higher
  }
}

/* Determines if the down payment is less than 20% of the property price.
 * This function checks if the down payment is less than 20% of the property price.
 * If it is, the function returns true, indicating that the down payment is insufficient.
 * Otherwise, it returns false. */
const isDownPaymentLessThanMinimum = (
  propertyPrice: number,
  downPayment: number
): boolean => {
  const minimumDownPayment: number = 0.20 * propertyPrice;
  return downPayment < minimumDownPayment;
}

/* Calculate the monthly mortgage payment based on the principal,
 * interest rate per period, and total number of payments.
 * Uses the formula:
 * M = (P * r * (1 + r)^n) / ((1 + r)^n - 1) */
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

// Apply CMHC insurance premium to the total mortgage amount if needed.
const applyCMHCInsurance = (
  propertyPrice: number,
  downPayment: number,
  currentMortgageAmount: number
): number => {
  const CHMCInsuranceRate: number = calculateCMHCInsuranceRate(propertyPrice, downPayment);

  // Calculate the mortgage amount before insurance.
  const mortgageAmountBeforeInsurance: number = propertyPrice - downPayment;

  // Calculate the CMHC insurance premium.
  const insurancePremium: number = calculateCMHCInsurancePremium(
    CHMCInsuranceRate,
    mortgageAmountBeforeInsurance
  );

  // Add the insurance premium to the total mortgage amount
  return currentMortgageAmount + insurancePremium;
}

export {
  calculatePerPaymentScheduleInterestRate,
  convertInterestRateToDecimal,
  calculateTotalNumberOfPaymentsOverAmortizationPeriod,
  calculateMonthlyMortgagePayment,
  getPeriodsPerYear,
  isDownPaymentLessThanMinimum,
  calculateCMHCInsuranceRate,
  calculateCMHCInsurancePremium,
  applyCMHCInsurance
}