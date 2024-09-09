import { MortgageCalculatorFormState, SelectChangeEventTarget } from "@/app/calculator/types"
import React from "react"
import { SelectChangeEvent } from "@mui/material"

export interface MortgageCalculatorFormProps {
  formState: MortgageCalculatorFormState;
  handleChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeSelect: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  errorFromAPI: any
}