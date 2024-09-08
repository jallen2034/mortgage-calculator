/* Calculate the interest rate per payment period by dividing the annual interest rate
 * (as a decimal) by the number of periods per year.
 * Example: For an annual rate of 5% (0.05) and monthly payments (12 periods/year):
 * 0.05 / 12 = 0.004167 (monthly interest rate). */
const calculatePerPaymentScheduleInterestRate = (
  annualInterestRateDecimal: number,
  periodsPerYear: number
): number => {
  return annualInterestRateDecimal / periodsPerYear;
}

/* Compute the CMHC insurance premium by multiplying the insurance rate by the mortgage amount before insurance.
 * Example: For an insurance rate of 4.5% (0.045) and a mortgage amount of $200,000:
 * 0.045 * 200,000 = $9,000 insurance premium. */
const calculateCMHCInsurancePremium = (
  insuranceRate: number,
  mortgageAmountBeforeInsurance: number
): number => {
  return insuranceRate * mortgageAmountBeforeInsurance;
}

/* Calculate total number of payments over the amortization period by multiplying the number of
 * payment periods per year by the total number of years in the amortization period.
 * Example: For a 30-year amortization period with monthly payments (12 periods/year):
 * 30 * 12 = 360 payments. */
const calculateTotalNumberOfPaymentsOverAmortizationPeriod = (
  periodsPerYear: number,
  amortizationPeriod: number
): number => {
  return periodsPerYear * amortizationPeriod;
}

/* Convert an annual interest rate percentage to a decimal. Example: For an annual rate of 5%:
 * 5 / 100 = 0.05. */
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
  downPayment: number,
  downPaymentPercentage: number
): number => {
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

/* Check if the down payment is less than 20% of the property price.
 * Returns true if the down payment is less than 20%, otherwise false. */
const isDownPaymentLessThanMinimum = (
  propertyPrice: number,
  downPayment: number
): boolean => {
  const minimumDownPayment: number = 0.20 * propertyPrice;
  return downPayment < minimumDownPayment;
}

/* Calculate the monthly mortgage payment using the principal, interest rate per period, and total number of payments.
 * Formula: M = (P * r * (1 + r)^n) / ((1 + r)^n - 1)
 * - P: Principal amount
 * - r: Interest rate per period
 * - n: Total number of payments */
const calculateMonthlyMortgagePayment = (
  principal: number,
  totalNumberOfPayments: number,
  perPaymentScheduleInterestRate: number
): number => {
  if (perPaymentScheduleInterestRate === 0) {
    return principal / totalNumberOfPayments;
  }

  const factor: number = Math.pow(1 + perPaymentScheduleInterestRate, totalNumberOfPayments);
  const numerator: number = principal * perPaymentScheduleInterestRate * factor;
  const denominator: number = factor - 1;

  return numerator / denominator;
}

// Compute the insurance premium and apply it to the mortgage amount if necessary.
const calculateInsurancePremium = (
  propertyPrice: number,
  downPayment: number,
  CHMCInsuranceRate: number
) => {
  const mortgageAmountBeforeInsurance: number = propertyPrice - downPayment;
  return calculateCMHCInsurancePremium(
    CHMCInsuranceRate,
    mortgageAmountBeforeInsurance
  );
}

// Add the CMHC insurance premium to the current mortgage amount to get the final amount.
const applyCMHCInsurance = (
  propertyPrice: number,
  downPayment: number,
  currentMortgageAmount: number,
  insurancePremium: number
): number => {
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
  applyCMHCInsurance,
  calculateInsurancePremium
}