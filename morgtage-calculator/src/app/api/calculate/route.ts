import { NextRequest } from "next/server";
import { NextResponseHandler } from "@/app/api/_apiFactory/nextResponseHandler";
import { MortgageCalculatorFormState } from "@/app/calculator/types";
import {
  applyCMHCInsurance,
  calculateMonthlyMortgagePayment,
  calculatePerPaymentScheduleInterestRate,
  calculateTotalNumberOfPaymentsOverAmortizationPeriod,
  convertInterestRateToDecimal,
  getPeriodsPerYear,
  isDownPaymentLessThanMinimum
} from "@/app/api/calculate/helpers"

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

    // Calculate the mortgage amount before insurance is applied.
    let totalMortgageAmount: number = propertyPrice - downPayment;

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
      totalMortgageAmount = applyCMHCInsurance(
        propertyPrice,
        downPayment,
        totalMortgageAmount
      );
    }

    // Calculate the mortgage payment amount per payment schedule (M).
    const monthlyMortgagePayment: number = calculateMonthlyMortgagePayment(
      totalMortgageAmount,
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
