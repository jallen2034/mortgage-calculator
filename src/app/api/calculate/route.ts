import { NextRequest, NextResponse } from "next/server"
import { NextResponseHandler } from "@/app/api/_apiFactory/nextResponseHandler";
import { MortgageCalculatorFormState } from "@/app/calculator/types";
import {
  calculateMortgageDetails,
  parseInputValues,
  validateUserInputFromClient
} from "@/app/api/calculate/helpers";
import { CalculatedResultFromAPI, ParsedInputValsAsNums, ValidationErrorsFromAPI } from "@/app/api/calculate/types";
import { HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR, HTTP_OK } from "@/app/api/calculate/constants"

// API route to calculate mortgage details based on user input.
export async function POST(
  request: NextRequest
): Promise<NextResponse<CalculatedResultFromAPI | ValidationErrorsFromAPI>> {
  try {
    // Destructure values from the incoming request from the client.
    const {
      propertyPrice, // Principal loan amount (P).
      amortizationPeriod,
      paymentSchedule,
      downPayment,
      interestRate
    }: MortgageCalculatorFormState = await request.json();

    // Validate input fields from the client.
    const errors: ValidationErrorsFromAPI = validateUserInputFromClient(
      propertyPrice,
      downPayment,
      interestRate,
      amortizationPeriod,
      paymentSchedule
    );

    // If there are validation errors, return a 400 with the errors.
    if (Object.keys(errors).length > 0) {
      return NextResponseHandler({ errors }, HTTP_BAD_REQUEST);
    }

    // Parse the incoming values to ensure they're numbers using our helper.
    const {
      parsedPropertyPrice,
      parsedDownPayment,
      parsedInterestRate,
      parsedAmortizationPeriod
    }: ParsedInputValsAsNums = parseInputValues(
      propertyPrice,
      downPayment,
      interestRate,
      amortizationPeriod
    );

    // Response payload from this API on a 200 success response for the UI to use.
    const APIResponsePayload: CalculatedResultFromAPI = calculateMortgageDetails(
      parsedPropertyPrice,
      parsedDownPayment,
      parsedInterestRate,
      parsedAmortizationPeriod,
      paymentSchedule
    );

    // Return the calculated monthly mortgage payment in the success response.
    return NextResponseHandler(APIResponsePayload, HTTP_OK);
  } catch (error) {
    console.error("Unexpected error processing the mortgage calculation:", error);
    const errorMessage: string = error.message;
    return NextResponseHandler({ errorMessage }, HTTP_INTERNAL_SERVER_ERROR);
  }
}
