import React from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { MortgageCalculatorFormProps } from "@/app/component/MorgageCalculatorForm/types";
import "./mortgageCalculator.scss";

const MortgageCalculatorForm = ({
  formState,
  handleChangeTextField,
  handleChangeSelect,
  handleSubmit,
  errorFromAPI
}: MortgageCalculatorFormProps) => {
  const amortizationPeriods: number[] = [5, 10, 15, 20, 25, 30];

  return (
    <form onSubmit={handleSubmit} className="form-box">
      <FormControl fullWidth margin="normal">
        <TextField
          id="propertyPrice"
          label="Property Price ($CAD)"
          value={formState.propertyPrice}
          onChange={handleChangeTextField}
          variant="outlined"
          error={!!errorFromAPI?.propertyPriceError}
          helperText={errorFromAPI?.propertyPriceError || ""}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          id="downPayment"
          label="Down Payment ($CAD)"
          value={formState.downPayment}
          onChange={handleChangeTextField}
          variant="outlined"
          error={!!errorFromAPI?.downPaymentError}
          helperText={errorFromAPI?.downPaymentError || ""}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          id="interestRate"
          label="Annual Interest Rate (%)"
          value={formState.interestRate}
          onChange={handleChangeTextField}
          variant="outlined"
          error={!!errorFromAPI?.interestRateError}
          helperText={errorFromAPI?.interestRateError || ""}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="amortizationPeriod-label">Amortization Period</InputLabel>
        <Select
          id="amortizationPeriod"
          name="amortizationPeriod"
          value={formState.amortizationPeriod}
          onChange={handleChangeSelect}
          label="Amortization Period"
          className="select"
        >
          {amortizationPeriods.map((year: number) => (
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
          name="paymentSchedule"
          value={formState.paymentSchedule}
          onChange={handleChangeSelect}
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
    </form>
  );
};

export default MortgageCalculatorForm;
