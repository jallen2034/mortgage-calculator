"use client"
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container, SelectChangeEvent,
} from "@mui/material"
import { MortgageCalculatorFormState } from "@/app/calculator/types"
import { CalculatedResult } from "@/app/api/calculate/types"
import { fetchMortgageCalculation } from "@/app/calculator/helpers";
import MortgageResultCard from "@/app/component/MortgageResultCard/mortgageResultCard"
import MortgageCalculatorForm from "@/app/component/MorgageCalculatorForm/mortgageCalculatorForm"
import './styles.scss';

const MortgageCalculator = () => {
  // Consider using a custom hook if form state management becomes more complex for better organization.
  const [formState, setFormState] = useState<MortgageCalculatorFormState>({
    propertyPrice: '',
    downPayment: '',
    interestRate: '',
    amortizationPeriod: "5",
    paymentSchedule: 'Monthly'
  });

  // State to store the result of the mortgage calculation and also any potential errors from the API.
  const [calculationResult, setCalculationResult] = useState<any | null>(null);
  const [errorFromAPI, setErrorFromAPI] = useState<any>(null)

  // Handles updates to TextField inputs in the form. separation of concerns.
  const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value }: EventTarget = event.target;
    setErrorFromAPI(null);
    setFormState((prevState: MortgageCalculatorFormState): MortgageCalculatorFormState => ({
      ...prevState,
      [id]: value
    }));
  };

  // Handles updates to Select inputs in the form. separation of concerns.
  const handleChangeSelect = (event: SelectChangeEvent<unknown>, child: React.ReactNode): void => {
    const { name, value }: EventTarget = event.target;
    if (!name) return;
    setFormState((prevState: MortgageCalculatorFormState): MortgageCalculatorFormState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Submits the form and fetches mortgage calculation results from the API.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    try {
      event.preventDefault();
      const apiResult: CalculatedResult | Record<string, string> = await fetchMortgageCalculation(formState);
      setCalculationResult(apiResult as CalculatedResult);
    } catch (error: any) {
      console.error("An unexpected error occurred:", error);
      setErrorFromAPI(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className="container">
        <Typography variant="h4" component="h1" className="title">
          Mortgage Calculator
        </Typography>
        <MortgageCalculatorForm
          {...{
            formState,
            handleChangeTextField,
            handleChangeSelect,
            handleSubmit,
            errorFromAPI
          }}
        />
        {calculationResult &&
          <MortgageResultCard{...{ calculationResult }} />
        }
      </Box>
    </Container>
  );
}

export default MortgageCalculator