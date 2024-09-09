import React from "react"
import { Typography, Divider } from "@mui/material"
import { MortgageResultCardProps } from "@/app/component/MortgageResultCard/types"
import "./mortgageResultCard.scss"

const MortgageResultCard = (
  { calculationResult }: MortgageResultCardProps
) => {
  return (
    <div className="resultCard">
      {/* Mortgage Overview. */}
      <Typography variant="h6" className="resultLabel">Mortgage Overview</Typography>
      <Divider />
      <div className="resultItem">
        <Typography
          variant="body1"
          className="resultLabel"
        >Total Mortgage Amount:</Typography>
        <Typography
          variant="body1"
          className="resultValue"
        >${calculationResult.totalMortgageAmount.toFixed(2)}
        </Typography>
      </div>
      <div className="resultItem">
        <Typography
          variant="body1"
          className="resultLabel">
          Down Payment Amount:
        </Typography>
        <Typography
          variant="body1"
          className="resultValue"
        >
          ${calculationResult.downPayment}
        </Typography>
      </div>
      <div className="resultItem">
        <Typography
          variant="body1"
          className="resultLabel">
          Down Payment Percentage:
        </Typography>
        <Typography
          variant="body1"
          className="resultValue"
        >
          {calculationResult.downPaymentPercentage.toFixed(2)}%
        </Typography>
      </div>
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">Monthly Mortgage Payment:</Typography>
        <Typography
          variant="body1"
          className="resultValue"
        >
          ${calculationResult.monthlyMortgagePayment.toFixed(2)}
        </Typography>
      </div>
      {/* Always show if CHMC Insurance is required */}
      <Typography variant="h6" className="resultLabel">Default Insurance</Typography>
      <Divider />
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">CHMC Insurance Required:</Typography>
        <Typography variant="body1" className="resultValue">
          {calculationResult.needsCHMCInsurance ? "Yes" : "No"}
        </Typography>
      </div>
      {/* Conditionally render the rate and premium only if CHMC Insurance is required */}
      {calculationResult.needsCHMCInsurance && (
        <>
          <div className="resultItem">
            <Typography variant="body1" className="resultLabel">CHMC Insurance Rate:</Typography>
            <Typography variant="body1" className="resultValue">{calculationResult.CHMCInsuranceRate}%</Typography>
          </div>
          <div className="resultItem">
            <Typography variant="body1" className="resultLabel">CHMC Insurance Premium:</Typography>
            <Typography variant="body1" className="resultValue">${calculationResult.insurancePremium}</Typography>
          </div>
        </>
      )}
      {/* Term and Amortization. */}
      <Typography variant="h6" className="resultLabel">Amortization</Typography>
      <Divider />
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">Amortization Payments:</Typography>
        <Typography
          variant="body1"
          className="resultValue"
        >
          {calculationResult.totalNumberOfPaymentsOverAmortization}
        </Typography>
      </div>
      {/* Interest Rates. */}
      <Typography variant="h6" className="resultLabel">Interest Rates</Typography>
      <Divider />
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">Interest Rate (per payment):</Typography>
        <Typography
          variant="body1"
          className="resultValue"
        >
          {(calculationResult.perPaymentScheduleInterestRate * 100).toFixed(2)}%
        </Typography>
      </div>
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">Annual Interest Rate (converted):</Typography>
        <Typography
          variant="body1"
          className="resultValue"
        >
          {(calculationResult.convertedDecimalInterestRate * 100).toFixed(2)}%
        </Typography>
      </div>
      {/* Payment Details */}
      <Typography variant="h6" className="resultLabel">Payment Schedule</Typography>
      <Divider />
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">Payment Periods per Year:</Typography>
        <Typography variant="body1" className="resultValue">{calculationResult.payPeriodsPerYear}</Typography>
      </div>
    </div>
  )
}

export default MortgageResultCard
