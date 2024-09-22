import React from "react"
import { MortgageCalculatorFormState } from "@/app/calculator/types"
import { SelectChangeEvent } from "@mui/material"
import { ValidationErrorsFromAPI } from "@/app/api/calculate/types"

export interface MortgageCalculatorFormProps {
  formState: MortgageCalculatorFormState;
  handleChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeSelect: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  errorFromAPI: ValidationErrorsFromAPI
}