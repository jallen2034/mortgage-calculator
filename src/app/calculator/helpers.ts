import { CalculatedResultFromAPI, ValidationErrorsFromAPI } from "@/app/api/calculate/types";
import { MortgageCalculatorFormState } from "@/app/calculator/types";

// Helper function to make a APi call to the backend to calculate the mortgage.
export async function fetchMortgageCalculationFromAPI(
  formState: MortgageCalculatorFormState
): Promise<CalculatedResultFromAPI | ValidationErrorsFromAPI> {
  try {
    const response: Response = await fetch('http://localhost:3000/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData?.errors || { errorMessage: "An unknown error occurred." };
    }

    return await response.json(); // If the request is successful, return the calculated result.
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}