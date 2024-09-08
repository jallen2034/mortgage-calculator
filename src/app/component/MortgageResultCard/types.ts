export interface MortgageResultCardProps {
  calculationResult: {
    monthlyMortgagePayment: number;
    totalMortgageAmount: number;
    needsCHMCInsurance: boolean;
    totalNumberOfPaymentsOverAmortization: number;
    perPaymentScheduleInterestRate: number;
    convertedDecimalInterestRate: number;
    payPeriodsPerYear: number;
    CHMCInsuranceRate: number;
    downPaymentPercentage: number;
    insurancePremium: number;
    parsedPropertyPrice: number;
  };
}