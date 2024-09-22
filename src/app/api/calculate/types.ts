export interface CalculatedResultFromAPI {
  monthlyMortgagePayment: number;
  insurancePremium: number;
  perPaymentScheduleInterestRate: number;
  totalNumberOfPaymentsOverAmortization: number;
  needsCHMCInsurance: boolean;
  totalMortgageAmount: number;
  downPayment: number;
  parsedPropertyPrice: number;
  downPaymentPercentage: number;
  payPeriodsPerYear: number;
  convertedDecimalInterestRate: number;
  CHMCInsuranceRate: number;
  paymentSchedule: "Monthly" | "Bi-Weekly" | "Accelerated Bi-Weekly";
}

export interface ValidationErrorsFromAPI {
  propertyPriceError?: string;
  downPaymentError?: string;
  interestRateError?: string;
  amortizationPeriodError?: string;
  paymentScheduleError?: string;
}

export interface ParsedInputValsAsNums {
  parsedPropertyPrice: number;
  parsedDownPayment: number;
  parsedInterestRate: number;
  parsedAmortizationPeriod: number
}
