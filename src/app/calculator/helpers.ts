export async function fetchMortgageCalculation(data: any): Promise<number> {
  try {
    const response: Response = await fetch('http://localhost:3000/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log(result)
    return result.payment;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}