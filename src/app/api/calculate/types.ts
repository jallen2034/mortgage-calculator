export interface CalculatedResult {
  monthlyMortgagePayment: number;
  insurancePremium: number;
  perPaymentScheduleInterestRate: number;
  totalNumberOfPaymentsOverAmortization: number;
  needsCHMCInsurance: boolean;
  totalMortgageAmount: number;
  downPayment: string | null;
  parsedPropertyPrice: number;
  downPaymentPercentage: number;
  payPeriodsPerYear: number;
  convertedDecimalInterestRate: number;
  CHMCInsuranceRate: number
}