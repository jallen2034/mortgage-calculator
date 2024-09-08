import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { MortgageCalculatorFormProps } from "@/app/component/MorgageCalculatorForm/types";
import React from "react"
import "./mortgageCalculator.scss";

const MortgageCalculatorForm = ({
  formState,
  handleChangeTextField,
  handleChangeSelect,
  handleSubmit,
  errorFromAPI
}: MortgageCalculatorFormProps) => {
  return (
    <Box component="form" onSubmit={handleSubmit} className="form-box">
      <FormControl fullWidth margin="normal">
        <TextField
          id="propertyPrice"
          label="Property Price"
          value={formState.propertyPrice}
          onChange={handleChangeTextField}
          variant="outlined"
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          id="downPayment"
          label="Down Payment"
          value={formState.downPayment}
          onChange={handleChangeTextField}
          variant="outlined"
          error={!!errorFromAPI}
          helperText={errorFromAPI ? errorFromAPI : ""}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          id="interestRate"
          label="Annual Interest Rate"
          value={formState.interestRate}
          onChange={handleChangeTextField}
          variant="outlined"
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
    </Box>
  );
};

export default MortgageCalculatorForm;