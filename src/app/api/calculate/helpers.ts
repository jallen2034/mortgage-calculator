import { CalculatedResultFromAPI, ParsedInputValsAsNums, ValidationErrorsFromAPI } from "@/app/api/calculate/types";

// Parses input values into numbers, ensuring valid numerical results or NaN for invalid inputs.
const parseInputValues = (
  propertyPrice: string | null,
  downPayment: string | null,
  interestRate: string | null,
  amortizationPeriod: string | undefined
): ParsedInputValsAsNums => {
  return {
    parsedPropertyPrice: propertyPrice ? parseFloat(propertyPrice) : NaN,
    parsedDownPayment: downPayment ? parseFloat(downPayment) : NaN,
    parsedInterestRate: interestRate ? parseFloat(interestRate) : NaN,
    parsedAmortizationPeriod: amortizationPeriod ? parseFloat(amortizationPeriod) : NaN
  };
};

// Validates user input for the mortgage calculator, building an object of errors if any inputs are invalid.
const validateUserInputFromClient = (
  propertyPrice: string | null,
  downPayment: string | null,
  interestRate: string | null,
  amortizationPeriod: string | undefined,
  paymentSchedule:  "Monthly" | "Bi-Weekly" | "Accelerated Bi-Weekly" | undefined
): ValidationErrorsFromAPI => {
  let errors: ValidationErrorsFromAPI = {};

  // Destructure the parsed values using helper.
  const {
    parsedPropertyPrice,
    parsedDownPayment,
    parsedInterestRate,
  }: ParsedInputValsAsNums = parseInputValues(
    propertyPrice,
    downPayment,
    interestRate,
    amortizationPeriod
  );

  // Validate Property Price.
  if (!propertyPrice || parsedPropertyPrice <= 0) {
    errors.propertyPriceError = "You must submit a valid property price.";
  }

  // Validate Interest Rate.
  if (!interestRate || parsedInterestRate <= 0) {
    errors.interestRateError = "You must submit a valid interest rate.";
  }

  // Validate Amortization Period.
  if (!amortizationPeriod) {
    errors.amortizationPeriodError = "You must select an amortization period.";
  }

  // Validate Payment Schedule.
  if (!paymentSchedule) {
    errors.paymentScheduleError = "You must select a payment schedule.";
  }

  // Validate down payment.
  if (!downPayment || parsedDownPayment <= 0) {
    errors.downPaymentError = "You must submit a valid deposit.";
    return errors;
  }

  // Make sure the down payment isn't greater than the price of the property.
  if (parsedDownPayment > parsedPropertyPrice) {
    errors.downPaymentError = "The down payment cannot exceed the property's total price.";
    return errors;
  }

  const downPaymentPercentage: number = (downPayment / propertyPrice) * 100;

  // Validate the down payment is not less than 5%.
  if (downPaymentPercentage < 5) {
    errors.downPaymentError = "A deposit for a mortgage cannot be less than 5%";
  }

  return errors;
}

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
  return annualInterestRate / 100;
}

// Determine the number of payment periods per year based on the payment schedule.
const getPeriodsPerYear = (
  paymentSchedule: "Monthly" | "Bi-Weekly" | "Accelerated Bi-Weekly" | undefined
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

/* Calculate the CMHC insurance rate based on the down payment percentage.
 * Calculates this according to the British Columbia Mortgage Default Insurance Rates.
 * https://www.ratehub.ca/cmhc-insurance-british-columbia */
const calculateCMHCInsuranceRate = (
  propertyPrice: number,
  downPayment: number,
  downPaymentPercentage: number
): number => {
  switch (true) {
    case downPaymentPercentage < 10:
      return 0.040; // 4%
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

/* Calculate monthly mortgage payment using the principal, interest rate per period, & total number of payments.
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

export function calculateMortgageDetails(
  propertyPrice: number,
  downPayment: number,
  interestRate: number,
  amortizationPeriod: number,
  paymentSchedule: "Monthly" | "Bi-Weekly" | "Accelerated Bi-Weekly" | undefined
): CalculatedResultFromAPI {
  // Calculate the mortgage amount before insurance is applied.
  let totalMortgageAmount: number = propertyPrice - downPayment;
  let CHMCInsuranceRate: number = 0;
  let insurancePremium: number = 0;

  // Calculate the percentage of down payment.
  const downPaymentPercentage: number = (downPayment / propertyPrice) * 100;

  // Determine the number of payment periods per year based on the payment schedule.
  const payPeriodsPerYear: number = getPeriodsPerYear(paymentSchedule);

  // Convert the annual interest rate percentage to a decimal.
  const convertedDecimalInterestRate: number = convertInterestRateToDecimal(interestRate);

  // Calculate the interest rate per payment period based on the annual rate and payment frequency (r).
  const perPaymentScheduleInterestRate: number = calculatePerPaymentScheduleInterestRate(
    convertedDecimalInterestRate,
    payPeriodsPerYear
  );

  // Calculate the total number of payments over the amortization period (n).
  const totalNumberOfPaymentsOverAmortization: number = calculateTotalNumberOfPaymentsOverAmortizationPeriod(
    payPeriodsPerYear,
    amortizationPeriod
  );

  // Determine if CMHC insurance is needed.
  const needsCHMCInsurance: boolean = isDownPaymentLessThanMinimum(propertyPrice, downPayment);

  // If CMHC insurance is needed, apply it to the mortgage amount.
  if (needsCHMCInsurance) {
    CHMCInsuranceRate = calculateCMHCInsuranceRate(
      propertyPrice,
      downPayment,
      downPaymentPercentage
    );
    insurancePremium = calculateInsurancePremium(
      propertyPrice,
      downPayment,
      CHMCInsuranceRate
    );
    totalMortgageAmount = applyCMHCInsurance(
      propertyPrice,
      downPayment,
      totalMortgageAmount,
      insurancePremium
    );
  }

  // Calculate the mortgage payment amount per payment schedule (M).
  const monthlyMortgagePayment: number = calculateMonthlyMortgagePayment(
    totalMortgageAmount,
    totalNumberOfPaymentsOverAmortization,
    perPaymentScheduleInterestRate
  );

  return <CalculatedResultFromAPI>{
    monthlyMortgagePayment,
    needsCHMCInsurance,
    totalMortgageAmount,
    totalNumberOfPaymentsOverAmortization,
    perPaymentScheduleInterestRate,
    convertedDecimalInterestRate,
    payPeriodsPerYear,
    parsedPropertyPrice: propertyPrice,
    CHMCInsuranceRate,
    insurancePremium,
    downPaymentPercentage,
    downPayment,
    paymentSchedule
  };
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
  calculateInsurancePremium,
  validateUserInputFromClient,
  parseInputValues
}