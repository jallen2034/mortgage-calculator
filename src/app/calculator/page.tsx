"use client"
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container
} from '@mui/material';
import { MortgageCalculatorFormState, SelectChangeEventTarget } from "@/app/calculator/types"
import { fetchMortgageCalculation } from "@/app/calculator/helpers";
import MortgageResultCard from "@/app/component/MortgageResultCard/mortgageResultCard"
import MortgageCalculatorForm from "@/app/component/MorgageCalculatorForm/mortgageCalculatorForm"
import './styles.scss';

export default function MortgageCalculator() {
  // Consider using a custom hook if form state management becomes more complex for better organization.
  const [formState, setFormState] = useState<MortgageCalculatorFormState>({
    propertyPrice: '',
    downPayment: '',
    interestRate: '',
    amortizationPeriod: "5",
    paymentSchedule: 'Monthly'
  });

  // State to store the result of the mortgage calculation.
  const [calculationResult, setCalculationResult] = useState<any | null>(null);

  // Handles updates to TextField inputs in the form.
  const handleChangeTextField = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormState((prevState: MortgageCalculatorFormState): MortgageCalculatorFormState => ({
      ...prevState,
      [id]: value
    }));
  };

  // Handles updates to Select inputs in the form.
  const handleChangeSelect = (e: React.ChangeEvent<SelectChangeEventTarget>): void => {
    const { name, value } = e.target;
    if (!name) return
    setFormState((prevState: MortgageCalculatorFormState): MortgageCalculatorFormState => ({
      ...prevState,
      [name]: value as string
    }));
  };

  // Submits the form and fetches mortgage calculation results from the API.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const apiResult: number = await fetchMortgageCalculation(formState);
    setCalculationResult(apiResult)
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className="container">
        <Typography variant="h4" component="h1" className="title">
          Mortgage Calculator
        </Typography>
        <MortgageCalculatorForm
          formState={formState}
          handleChangeTextField={handleChangeTextField}
          handleChangeSelect={handleChangeSelect}
          handleSubmit={handleSubmit}
        />
        {calculationResult &&
          <MortgageResultCard calculationResult={calculationResult} />
        }
      </Box>
    </Container>
  );
}
