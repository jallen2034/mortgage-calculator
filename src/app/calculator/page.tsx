"use client"
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Container
} from '@mui/material';
import { MortgageCalculatorFormState } from "@/app/calculator/types";
import { fetchMortgageCalculation } from "@/app/calculator/helpers";
import './styles.scss';

export default function MortgageCalculator() {
  // Initialize state with numbers for the relevant fields
  const [formState, setFormState] = useState<MortgageCalculatorFormState>({
    propertyPrice: 0,
    downPayment: 0,
    interestRate: 0,
    amortizationPeriod: 5,
    paymentSchedule: 'Monthly'
  });

  // Handle change for both TextField and Select components
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    const { id, value } = e.target as HTMLInputElement;

    if (id) {
      // Parse numeric values from the input
      setFormState((prevState: MortgageCalculatorFormState) => ({
        ...prevState,
        [id]: Number(value) // Convert value to number
      }));
    } else {
      const target = e.target as { name?: string; value: unknown };
      const { name, value } = target;

      if (name) {
        setFormState((prevState: MortgageCalculatorFormState) => ({
          ...prevState,
          [name]: value as string // Maintain string for Select values
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const apiResult: number = await fetchMortgageCalculation(formState);
    console.log(apiResult);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className="container">
        <Typography variant="h4" component="h1" className="title">
          Mortgage Calculator
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="form-box">
          <FormControl fullWidth margin="normal">
            <TextField
              id="propertyPrice"
              label="Property Price"
              type="number"
              value={formState.propertyPrice}
              onChange={handleChange}
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              id="downPayment"
              label="Down Payment"
              type="number"
              value={formState.downPayment}
              onChange={handleChange}
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              id="interestRate"
              label="Annual Interest Rate"
              type="number"
              step="0.01"
              value={formState.interestRate}
              onChange={handleChange}
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="amortizationPeriod-label">Amortization Period</InputLabel>
            <Select
              id="amortizationPeriod"
              value={formState.amortizationPeriod}
              onChange={(e) => handleChange({ target: { name: 'amortizationPeriod', value: Number(e.target.value) } } as React.ChangeEvent<{ name?: string; value: unknown }>)}
              label="Amortization Period"
              className="select"
            >
              {[5, 10, 15, 20, 25, 30].map((year: number) => (
                <MenuItem key={year} value={year}>
                  {year} years
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="paymentSchedule-label">Payment Schedule</InputLabel>
            <Select
              id="paymentSchedule"
              value={formState.paymentSchedule}
              onChange={(e) => handleChange({ target: { name: 'paymentSchedule', value: e.target.value } } as React.ChangeEvent<{ name?: string; value: unknown }>)}
              label="Payment Schedule"
            >
              <MenuItem value="Accelerated Bi-Weekly">Accelerated Bi-Weekly</MenuItem>
              <MenuItem value="Bi-Weekly">Bi-Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="button"
          >
            Calculate
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
