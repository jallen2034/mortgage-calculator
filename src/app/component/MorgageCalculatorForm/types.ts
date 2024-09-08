import { MortgageCalculatorFormState, SelectChangeEventTarget } from "@/app/calculator/types"

export interface MortgageCalculatorFormProps {
  formState: MortgageCalculatorFormState;
  handleChangeTextField: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeSelect: (e: React.ChangeEvent<SelectChangeEventTarget>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  errorFromAPI: any
}