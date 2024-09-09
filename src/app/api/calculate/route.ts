import { NextRequest, NextResponse } from "next/server"
import { NextResponseHandler } from "@/app/api/_apiFactory/nextResponseHandler";
import { MortgageCalculatorFormState } from "@/app/calculator/types";
import {
  calculateMortgageDetails,
  validateUserInputFromClient
} from "@/app/api/calculate/helpers"
import { CalculatedResultFromAPI, ValidationErrorsFromAPI } from "@/app/api/calculate/types"

// API route to calculate mortgage details based on user input.
export async function POST(
  request: NextRequest
): Promise<NextResponse<CalculatedResultFromAPI | ValidationErrorsFromAPI>> {
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
    const errors: ValidationErrorsFromAPI = validateUserInputFromClient(
      propertyPrice,
      downPayment,
      interestRate,
      amortizationPeriod,
      paymentSchedule
    );

    // If there are validation errors, return a 500 with the errors.
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

    // Response payload from this API on a 200 success response for the UI to use.
    const APIResponsePayload: CalculatedResultFromAPI = calculateMortgageDetails(
      parsedPropertyPrice,
      parsedDownPayment,
      parsedInterestRate,
      parsedAmortizationPeriod,
      paymentSchedule
    )

    // Return the calculated monthly mortgage payment in the success response.
    return NextResponseHandler(APIResponsePayload, 200);
  } catch (error) {
    console.error("Unexpected error processing the mortgage calculation:", error);
    const errorMessage: string = error.message
    return NextResponseHandler({ errorMessage }, 500);
  }
}
