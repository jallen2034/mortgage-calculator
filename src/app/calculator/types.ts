export interface MortgageCalculatorFormState {
  propertyPrice: string | null;
  downPayment: string | null;
  interestRate: string | null ;
  amortizationPeriod?: string;
  paymentSchedule?: "Monthly" | "Bi-Weekly" | "Accelerated Bi-Weekly";
}