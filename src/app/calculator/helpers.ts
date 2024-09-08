import { CalculatedResult } from "@/app/api/calculate/types"

// Helper function to make a APi call to the backend to calculate the mortgage.
export async function fetchMortgageCalculation(data: any): Promise<CalculatedResult> {
  try {
    const response: Response = await fetch('http://localhost:3000/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage: string = errorData?.errorMessage || "An unknown error occurred.";
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error fetching data:', error.message || error);
    throw error;
  }
}