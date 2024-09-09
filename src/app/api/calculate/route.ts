import { NextRequest } from "next/server";
import { NextResponseHandler } from "@/app/api/_apiFactory/nextResponseHandler";
import { MortgageCalculatorFormState } from "@/app/calculator/types";
import {
  applyCMHCInsurance,
  calculateCMHCInsuranceRate,
  calculateInsurancePremium,
  calculateMonthlyMortgagePayment,
  calculatePerPaymentScheduleInterestRate,
  calculateTotalNumberOfPaymentsOverAmortizationPeriod,
  convertInterestRateToDecimal,
  getPeriodsPerYear,
  isDownPaymentLessThanMinimum,
  validateUserInputFromClient
} from "@/app/api/calculate/helpers"
import { CalculatedResult } from "@/app/api/calculate/types"

export async function POST(request: NextRequest): Promise<CalculatedResult> {
  try {
    // Destructure values from the incoming request.
    const {
      propertyPrice, // Principal loan amount (P).
      amortizationPeriod,
      paymentSchedule,
      downPayment,
      interestRate
    }: MortgageCalculatorFormState = await request.json();

    // Validate input fields.
    const errors: Record<string, string> = validateUserInputFromClient(
      propertyPrice,
      downPayment,
      interestRate,
      amortizationPeriod,
      paymentSchedule
    );

    // If there are validation errors, return 500 with the errors.
    if (Object.keys(errors).length > 0) {
      return NextResponseHandler({ errors }, 500);
    }

    // Ensure all values are of valid types before proceeding.
    if (
      propertyPrice === null || downPayment === null || interestRate === null ||
      amortizationPeriod === undefined || paymentSchedule === undefined
    ) {
      return NextResponseHandler(
        { errorMessage: "Invalid input. All fields are required." },
        400
      );
    }

    // Parse the incoming values to ensure they're numbers.
    const parsedPropertyPrice: number = parseFloat(propertyPrice);
    const parsedAmortizationPeriod: number = parseFloat(amortizationPeriod);
    const parsedDownPayment: number = parseFloat(downPayment);
    const parsedInterestRate: number = parseFloat(interestRate);

    // Calculate the mortgage amount before insurance is applied.
    let totalMortgageAmount: number = parsedPropertyPrice - parsedDownPayment;
    let CHMCInsuranceRate: number = 0;
    let insurancePremium: number = 0;

    // Calculate the percentage of down payment.
    const downPaymentPercentage: number = (downPayment / propertyPrice) * 100;

    // Determine the number of payment periods per year based on the payment schedule.
    const payPeriodsPerYear: number = getPeriodsPerYear(paymentSchedule);

    // Convert the annual interest rate percentage to a decimal.
    const convertedDecimalInterestRate: number = convertInterestRateToDecimal(parsedInterestRate);

    // Calculate the interest rate per payment period based on the annual rate and payment frequency (r).
    const perPaymentScheduleInterestRate: number = calculatePerPaymentScheduleInterestRate(
      convertedDecimalInterestRate,
      payPeriodsPerYear
    );

    // Calculate the total number of payments over the amortization period (n).
    const totalNumberOfPaymentsOverAmortization: number = calculateTotalNumberOfPaymentsOverAmortizationPeriod(
      payPeriodsPerYear,
      parsedAmortizationPeriod
    );

    // Determine if CMHC insurance is needed.
    const needsCHMCInsurance: boolean = isDownPaymentLessThanMinimum(parsedPropertyPrice, parsedDownPayment);

    // If CMHC insurance is needed, apply it to the mortgage amount.
    if (needsCHMCInsurance) {
      CHMCInsuranceRate = calculateCMHCInsuranceRate(
        parsedPropertyPrice,
        parsedDownPayment,
        downPaymentPercentage
      );
      insurancePremium = calculateInsurancePremium(
        parsedPropertyPrice,
        parsedDownPayment,
        CHMCInsuranceRate
      )
      totalMortgageAmount = applyCMHCInsurance(
        parsedPropertyPrice,
        parsedDownPayment,
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

    // Response payload from this API on a 200 success response for the UI to use.
    const APIResponsePayload: CalculatedResult = {
      monthlyMortgagePayment,
      needsCHMCInsurance,
      totalMortgageAmount,
      totalNumberOfPaymentsOverAmortization,
      perPaymentScheduleInterestRate,
      convertedDecimalInterestRate,
      payPeriodsPerYear,
      parsedPropertyPrice,
      CHMCInsuranceRate,
      insurancePremium,
      downPaymentPercentage,
      downPayment
    }

    // Return the calculated monthly mortgage payment in the success response.
    return NextResponseHandler(APIResponsePayload, 200);
  } catch (error) {
    console.error("Unexpected error processing the mortgage calculation:", error);
    const errorMessage: string = error.message
    return NextResponseHandler({ errorMessage }, 500);
  }
}
