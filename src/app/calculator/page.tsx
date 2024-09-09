"use client"
import React, { useState } from "react"
import {
  Box,
  Typography,
  Container,
  SelectChangeEvent,
  Button,
} from "@mui/material"
import { MortgageCalculatorFormState } from "@/app/calculator/types"
import { CalculatedResultFromAPI, ValidationErrorsFromAPI } from "@/app/api/calculate/types"
import { fetchMortgageCalculationFromAPI } from "@/app/calculator/helpers"
import MortgageResultCard from "@/app/component/MortgageResultCard/mortgageResultCard"
import MortgageCalculatorForm from "@/app/component/MorgageCalculatorForm/mortgageCalculatorForm"
import { useRouter } from "next/navigation"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import "./styles.scss"

const MortgageCalculator = () => {
  // Initialize router for navigation.
  const router: AppRouterInstance = useRouter()

  // Consider using a custom hook if the form state management becomes more complex for better organization.
  const [formState, setFormState] = useState<MortgageCalculatorFormState>({
    propertyPrice: "",
    downPayment: "",
    interestRate: "",
    amortizationPeriod: "5",
    paymentSchedule: "Monthly"
  })

  // State to store the result of the mortgage calculation and also any potential errors from the API.
  const [calculationResult, setCalculationResult] = useState<any | null>(null)
  const [errorFromAPI, setErrorFromAPI] = useState<any>(null)

  console.log(calculationResult)

  // Handles updates to TextField inputs in the form. separation of concerns.
  const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value }: EventTarget = event.target
    setErrorFromAPI(null)
    setFormState((prevState: MortgageCalculatorFormState): MortgageCalculatorFormState => ({
      ...prevState,
      [id]: value
    }))
  }

  // Handles updates to Select inputs in the form. separation of concerns.
  const handleChangeSelect = (event: SelectChangeEvent<unknown>, child: React.ReactNode): void => {
    const { name, value }: EventTarget = event.target
    if (!name) return
    setFormState((prevState: MortgageCalculatorFormState): MortgageCalculatorFormState => ({
      ...prevState,
      [name]: value
    }))
  }

  // Submits the form and fetches mortgage calculation results from the API.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    try {
      event.preventDefault()
      const apiResult: CalculatedResultFromAPI | ValidationErrorsFromAPI =
        await fetchMortgageCalculationFromAPI(formState)
      setCalculationResult(apiResult as CalculatedResultFromAPI)
    } catch (error: any) {
      console.error("An unexpected error occurred:", error)
      setErrorFromAPI(error)
    }
  }

  // Handle button click to go back to the homepage.
  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <Container component="main" maxWidth="s">
      {/* Back button */}
      <Button
        variant="contained"
        className="backButton"
        onClick={handleBackToHome}
      >
        🡠 Back to Homepage
      </Button>
      {/* Main content */}
      <Box className="container">
        <Typography
          variant="h4"
          component="h1"
          className="title"
        >
          Calculate Your Mortgage Payments
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
          <>
            <Typography
              variant="h4"
              component="h1"
              className="results"
            >
              Your Mortgage Calculation Results
            </Typography>
            <MortgageResultCard{...{ calculationResult }} />
          </>
        }
      </Box>
    </Container>
  )
}

export default MortgageCalculator