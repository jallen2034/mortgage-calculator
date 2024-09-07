import {
  calculateMonthlyMortgagePayment,
  calculatePerPaymentScheduleInterestRate,
  calculateTotalNumberOfPaymentsOverAmortizationPeriod,
  convertInterestRateToDecimal, getPeriodsPerYear
} from "@/app/api/calculate/helpers"

// Unit tests for the `calculatePerPaymentScheduleInterestRate` function to verify correct computation of interest rates (r).
describe('calculatePerPaymentScheduleInterestRate', (): void => {
  test('calculates the monthly interest rate correctly', (): void => {
    const annualInterestRate: number = 0.05; // 5%
    const periodsPerYear: number = 12; // Monthly payments
    const expectedRate: number = 0.05 / 12;
    const result: number = calculatePerPaymentScheduleInterestRate(annualInterestRate, periodsPerYear);
    expect(result).toBeCloseTo(expectedRate, 6); // Checking with tolerance for floating-point precision
  });

  test('calculates the bi-weekly interest rate correctly', (): void => {
    const annualInterestRate: number = 0.05; // 5%
    const periodsPerYear: number = 26; // Bi-weekly payments
    const expectedRate: number = 0.05 / 26;
    const result: number = calculatePerPaymentScheduleInterestRate(annualInterestRate, periodsPerYear);
    expect(result).toBeCloseTo(expectedRate, 6); // Checking with tolerance for floating-point precision
  });

  test('calculates the weekly interest rate correctly', (): void => {
    const annualInterestRate: number = 0.05; // 5%
    const periodsPerYear: number = 52; // Weekly payments
    const expectedRate: number = 0.05 / 52;
    const result: number = calculatePerPaymentScheduleInterestRate(annualInterestRate, periodsPerYear);
    expect(result).toBeCloseTo(expectedRate, 6); // Checking with tolerance for floating-point precision
  });

  test('handles zero annual interest rate correctly', (): void => {
    const annualInterestRate: number = 0.0; // 0%
    const periodsPerYear: number = 12; // Monthly payments
    const expectedRate: number = 0.0; // 0% interest rate
    const result: number = calculatePerPaymentScheduleInterestRate(annualInterestRate, periodsPerYear);
    expect(result).toBe(expectedRate); // Exact match for zero rate
  });

  test('handles zero periods per year gracefully', (): void => {
    const annualInterestRate: number = 0.05; // 5%
    const periodsPerYear: number = 0; // Edge case: Zero periods per year
    const result: number = calculatePerPaymentScheduleInterestRate(annualInterestRate, periodsPerYear);
    expect(result).toBe(Infinity); // Should be Infinity or handle error gracefully
  });
});

// Unit tests to test that the interest rate of "5%" can be converted properly into a decimal.
describe('convertInterestRateToDecimal', (): void => {
  test('converts a percentage to a decimal', (): void => {
    expect(convertInterestRateToDecimal(5)).toBe(0.05);
    expect(convertInterestRateToDecimal(0)).toBe(0);
    expect(convertInterestRateToDecimal(100)).toBe(1);
    expect(convertInterestRateToDecimal(50)).toBe(0.5);
  });
});

describe('calculateTotalNumberOfPaymentsOverAmortizationPeriod', (): void => {
  test('calculates the total number of payments for a 30-year period with monthly payments', (): void => {
    const periodsPerYear: number = 12; // Monthly payments.
    const amortizationPeriod: number = 30; // 30 years.
    const expectedPayments: number = 30 * 12; // 360 payments.
    const result: number = calculateTotalNumberOfPaymentsOverAmortizationPeriod(periodsPerYear, amortizationPeriod);
    expect(result).toBe(expectedPayments); // Exact match expected.
  });

  test('calculates the total number of payments for a 5-year period with bi-weekly payments', (): void => {
    const periodsPerYear: number = 26; // Bi-weekly payments.
    const amortizationPeriod: number = 5; // 5 years.
    const expectedPayments: number = 5 * 26; // 130 payments.
    const result: number = calculateTotalNumberOfPaymentsOverAmortizationPeriod(periodsPerYear, amortizationPeriod);
    expect(result).toBe(expectedPayments); // Exact match expected.
  });

  test('calculates the total number of payments for a 1-year period with weekly payments', (): void => {
    const periodsPerYear: number = 52; // Weekly payments.
    const amortizationPeriod: number = 1; // 1 year.
    const expectedPayments: number = 1 * 52; // 52 payments.
    const result: number = calculateTotalNumberOfPaymentsOverAmortizationPeriod(periodsPerYear, amortizationPeriod);
    expect(result).toBe(expectedPayments); // Exact match expected.
  });

  test('handles zero periods per year gracefully', (): void => {
    const periodsPerYear: number = 0; // Zero periods per year.
    const amortizationPeriod: number = 10; // 10 years.
    const expectedPayments: number = 0; // Should be 0 payments.
    const result: number = calculateTotalNumberOfPaymentsOverAmortizationPeriod(periodsPerYear, amortizationPeriod);
    expect(result).toBe(expectedPayments); // Exact match expected.
  });

  test('handles zero amortization period gracefully', (): void => {
    const periodsPerYear: number = 12; // Monthly payments.
    const amortizationPeriod: number = 0; // 0 years.
    const expectedPayments: number = 0; // Should be 0 payments.
    const result: number = calculateTotalNumberOfPaymentsOverAmortizationPeriod(periodsPerYear, amortizationPeriod);
    expect(result).toBe(expectedPayments); // Exact match expected.
  });
});

describe('getPeriodsPerYear', () => {
  it('should return 12 for Monthly payment schedule', (): void => {
    expect(getPeriodsPerYear("Monthly")).toBe(12);
  });

  it('should return 26 for Bi-Weekly payment schedule', (): void => {
    expect(getPeriodsPerYear("Bi-Weekly")).toBe(26);
  });

  it('should return 26 for Accelerated Bi-Weekly payment schedule', (): void => {
    expect(getPeriodsPerYear("Accelerated Bi-Weekly")).toBe(27);
  });

  it('should throw an error for an invalid payment schedule', (): void => {
    expect((): void => {
      // @ts-ignore - This line is intentionally incorrect to test invalid input
      getPeriodsPerYear("Invalid Schedule");
    }).toThrow('Invalid payment schedule: Invalid Schedule');
  });
});

describe('calculateMonthlyMortgagePayment', (): void => {
  it('should correctly calculate the monthly mortgage payment', (): void => {
    const propertyPrice: number = 300000;
    const totalNumberOfPaymentsOverAmortization: number = 360;
    const perPaymentScheduleInterestRate: number = 0.004166666666666667;

    const result: number = calculateMonthlyMortgagePayment(
      propertyPrice,
      totalNumberOfPaymentsOverAmortization,
      perPaymentScheduleInterestRate
    );

    expect(result).toBeCloseTo(1610.4648690364193, 4); // Use toBeCloseTo for floating-point precision
  });
});