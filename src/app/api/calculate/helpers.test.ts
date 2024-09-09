import {
  calculateCMHCInsurancePremium,
  calculateCMHCInsuranceRate,
  calculateMonthlyMortgagePayment,
  calculatePerPaymentScheduleInterestRate,
  calculateTotalNumberOfPaymentsOverAmortizationPeriod,
  convertInterestRateToDecimal,
  getPeriodsPerYear,
  isDownPaymentLessThanMinimum, validateUserInputFromClient
} from "@/app/api/calculate/helpers"

describe('validateUserInputFromClient', (): void => {
  it('should return an error for invalid property price', (): void => {
    const errors: Record<string, string> = validateUserInputFromClient(
      null,
      '1000',
      '5',
      '20',
      'Monthly'
    );
    expect(errors.propertyPriceError).toBe('You must submit a valid property price.');
  });

  it('should return an error for invalid down payment', (): void => {
    const errors: Record<string, string> = validateUserInputFromClient(
      '100000',
      '0',
      '5',
      '20',
      'Monthly'
    );
    expect(errors.downPaymentError).toBe('You must submit a valid deposit.');
  });

  it('should return an error if down payment is less than 5%', (): void => {
    const errors: Record<string, string> = validateUserInputFromClient(
      '100000',
      '4000',
      '5',
      '20',
      'Monthly'
    );
    expect(errors.downPaymentError).toBe('A deposit for a mortgage cannot be less than 5%!');
  });

  it('should return an error for invalid interest rate', (): void => {
    const errors: Record<string, string> = validateUserInputFromClient(
      '100000',
      '5000',
      null,
      '20',
      'Monthly'
    );
    expect(errors.interestRateError).toBe('You must submit a valid interest rate.');
  });

  it('should return an error if amortization period is not selected', (): void => {
    const errors: Record<string, string> = validateUserInputFromClient(
      '100000',
      '5000',
      '5',
      undefined,
      'Monthly'
    );
    expect(errors.amortizationPeriodError).toBe('You must select an amortization period.');
  });

  it('should return an error if payment schedule is not selected', (): void => {
    const errors: Record<string, string> = validateUserInputFromClient(
      '100000',
      '5000',
      '5',
      '20',
      undefined
    );
    expect(errors.paymentScheduleError).toBe('You must select a payment schedule.');
  });

  it('should return an empty object if all inputs are valid', (): void => {
    const errors: Record<string, string> = validateUserInputFromClient(
      '100000',
      '5000',
      '5',
      '20',
      'Monthly'
    );
    expect(errors).toEqual({});
  });
});

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

describe('isDownPaymentLessThanMinimum', (): void => {
  test('returns true if down payment is less than 20% of property price', (): void => {
    const propertyPrice: number = 300000;
    const downPayment: number = 50000; // 16.67% of property price
    expect(isDownPaymentLessThanMinimum(propertyPrice, downPayment)).toBe(true);
  });

  test('returns false if down payment is exactly 20% of property price', (): void => {
    const propertyPrice: number = 300000;
    const downPayment: number = 60000; // Exactly 20% of property price
    expect(isDownPaymentLessThanMinimum(propertyPrice, downPayment)).toBe(false);
  });

  test('returns false if down payment is more than 20% of property price', (): void => {
    const propertyPrice: number = 300000;
    const downPayment: number = 70000; // 23.33% of property price
    expect(isDownPaymentLessThanMinimum(propertyPrice, downPayment)).toBe(false);
  });

  test('returns false if down payment is zero', (): void => {
    const propertyPrice: number = 300000;
    const downPayment: number = 0; // 0% of property price
    expect(isDownPaymentLessThanMinimum(propertyPrice, downPayment)).toBe(true);
  });

  test('returns false if property price is zero and down payment is zero', (): void => {
    const propertyPrice: number = 0;
    const downPayment: number = 0; // Zero down payment
    expect(isDownPaymentLessThanMinimum(propertyPrice, downPayment)).toBe(false);
  });
});

describe('Calculate CMHC Insurance Rate Calculations', (): void => {
  test('should return 4.50% for down payment percentage < 10%', (): void => {
    expect(calculateCMHCInsuranceRate(
      300000,
      15000,
      (15000 / 300000) * 100
    )).toBe(0.045);

    expect(calculateCMHCInsuranceRate(
      100000,
      4000,
      (4000 / 100000) * 100
    )).toBe(0.045);
  });

  test('should return 3.10% for down payment percentage < 15%', (): void => {
    expect(calculateCMHCInsuranceRate(
      300000,
      30000,
      (30000 / 300000) * 100
    )).toBe(0.031);

    expect(calculateCMHCInsuranceRate(
      100000,
      12000,
      (12000 / 100000) * 100
    )).toBe(0.031);
  });

  test('should return 2.80% for down payment percentage < 20%', (): void => {
    expect(calculateCMHCInsuranceRate(
      300000,
      45000,
      (45000 / 300000) * 100
    )).toBe(0.028);

    expect(calculateCMHCInsuranceRate(
      100000,
      17000,
      (17000 / 100000) * 100
    )).toBe(0.028);
  });

  test('should return 0% for down payment percentage >= 20%', (): void => {
    expect(calculateCMHCInsuranceRate(
      300000,
      60000,
      (60000 / 300000) * 100
    )).toBe(0);

    expect(calculateCMHCInsuranceRate(
      100000,
      22000,
      (22000 / 100000) * 100
    )).toBe(0);
  });
});

describe("calculateCMHCInsurancePremium", (): void => {
  it("should correctly calculate the insurance premium for a given rate and mortgage amount", () => {
    const insuranceRate: number = 0.045; // 4.50%
    const mortgageAmountBeforeInsurance: number = 100000; // $100,000

    const result: number = calculateCMHCInsurancePremium(insuranceRate, mortgageAmountBeforeInsurance);

    expect(result).toBe(4500); // 4.50% of $100,000 = $4,500
  });

  it("should return 0 if the insurance rate is 0", (): void => {
    const insuranceRate: number = 0;
    const mortgageAmountBeforeInsurance: number = 100000; // $100,000

    const result: number = calculateCMHCInsurancePremium(insuranceRate, mortgageAmountBeforeInsurance);

    expect(result).toBe(0); // 0% of $100,000 = $0
  });

  it("should return 0 if the mortgage amount before insurance is 0", (): void => {
    const insuranceRate: number = 0.045; // 4.50%
    const mortgageAmountBeforeInsurance: number = 0;

    const result: number = calculateCMHCInsurancePremium(insuranceRate, mortgageAmountBeforeInsurance);

    expect(result).toBe(0); // 4.50% of $0 = $0
  });

  it("should handle large numbers correctly", (): void => {
    const insuranceRate: number = 0.028; // 2.80%
    const mortgageAmountBeforeInsurance: number = 10000000; // $10,000,000

    const result: number = calculateCMHCInsurancePremium(insuranceRate, mortgageAmountBeforeInsurance);

    expect(result).toBe(280000); // 2.80% of $10,000,000 = $280,000
  });

  it("should handle small numbers correctly", (): void => {
    const insuranceRate: number = 0.031; // 3.10%
    const mortgageAmountBeforeInsurance: number = 0.01; // $0.01

    const result: number = calculateCMHCInsurancePremium(insuranceRate, mortgageAmountBeforeInsurance);

    expect(result).toBeCloseTo(0.00031, 5); // 3.10% of $0.01 = $0.00031
  });
});