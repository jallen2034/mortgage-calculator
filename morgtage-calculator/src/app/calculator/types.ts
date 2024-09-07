export interface MortgageCalculatorFormState {
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  amortizationPeriod: number;
  paymentSchedule: "Monthly" | "Bi-Weekly" | "Accelerated Bi-Weekly";
}