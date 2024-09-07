import { NextRequest } from "next/server";
import { NextResponseHandler } from "@/app/api/_apiFactory/nextResponseHandler";
import { MortgageCalculatorFormState } from "@/app/calculator/types";
import {
  calculateMonthlyMortgagePayment,
  calculatePerPaymentScheduleInterestRate,
  calculateTotalNumberOfPaymentsOverAmortizationPeriod,
  convertInterestRateToDecimal,
  getPeriodsPerYear
} from "@/app/api/calculate/helpers";

export async function POST(request: NextRequest) {
  try {
    // Destructure values from the incoming request.
    const {
      propertyPrice, // Principal loan amount (P)
      amortizationPeriod,
      paymentSchedule,
      downPayment,
      interestRate
    }: MortgageCalculatorFormState = await request.json();

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

    // Calculate the mortgage payment amount per payment schedule (M).
    const monthlyMortgagePayment: number = calculateMonthlyMortgagePayment(
      propertyPrice,
      totalNumberOfPaymentsOverAmortization,
      perPaymentScheduleInterestRate
    );

    // Return the calculated monthly mortgage payment in the response.
    return NextResponseHandler(monthlyMortgagePayment, 200);
  } catch (error) {
    console.error("Error processing mortgage calculation:", error);
    return NextResponseHandler({ error: "An unexpected error occurred while processing your request." }, 500);
  }
}
