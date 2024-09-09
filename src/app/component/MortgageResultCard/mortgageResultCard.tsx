import React from "react";
import { Typography, Divider } from "@mui/material";
import { MortgageResultCardProps } from "@/app/component/MortgageResultCard/types";
import "./mortgageResultCard.scss";
import { formatCurrency } from "@/app/component/MortgageResultCard/helpers"

const MortgageResultCard = ({ calculationResult }: MortgageResultCardProps) => {
  return (
    <div className="resultCard">
      {/* Mortgage Overview */}
      <Typography variant="h6" className="resultLabel">
        Mortgage Overview
      </Typography>
      <Divider className="divider" />
      <div className="resultItem">
        <Typography variant="body1" className="resultValue">
          Total Mortgage Amount:
        </Typography>
        <Typography variant="body1" className="resultValue">
          {formatCurrency(calculationResult.totalMortgageAmount)}
        </Typography>
      </div>
      <div className="resultItem">
        <Typography variant="body1" className="resultValue">
          Down Payment Amount:
        </Typography>
        <Typography variant="body1" className="resultValue">
          {formatCurrency(calculationResult.downPayment)}
        </Typography>
      </div>
      <div className="resultItem">
        <Typography variant="body1" className="resultValue">
          Down Payment Percentage:
        </Typography>
        <Typography variant="body1" className="resultValue">
          {calculationResult.downPaymentPercentage.toFixed(2)}%
        </Typography>
      </div>
      <div className="resultItem">
        <Typography variant="body1" className="resultValue">
          Mortgage Payment Period:
        </Typography>
        <Typography variant="body1" className="resultValue">
          {calculationResult.paymentSchedule}
        </Typography>
      </div>
      <div className="resultItem">
        <Typography variant="body1" className="resultValue">
          Mortgage Payment Per Payment Period:
        </Typography>
        <Typography variant="body1" className="resultValue">
          {formatCurrency(calculationResult.monthlyMortgagePayment)}
        </Typography>
      </div>
      {/* Default Insurance */}
      <Typography variant="h6" className="resultLabel">
        Default Insurance
      </Typography>
      <Divider className="divider" />
      <div className="resultItem">
        <Typography variant="body1" className="resultValue">
          CHMC Insurance Required:
        </Typography>
        <Typography variant="body1" className="resultValue">
          {calculationResult.needsCHMCInsurance ? "Yes" : "No"}
        </Typography>
      </div>
      {/* Conditionally render the rate and premium only if CHMC Insurance is required */}
      {calculationResult.needsCHMCInsurance && (
        <>
          <div className="resultItem">
            <Typography variant="body1" className="resultValue">
              CHMC Insurance Rate:
            </Typography>
            <Typography variant="body1" className="resultValue">
              {calculationResult.CHMCInsuranceRate}%
            </Typography>
          </div>
          <div className="resultItem">
            <Typography variant="body1" className="resultValue">
              CHMC Insurance Premium:
            </Typography>
            <Typography variant="body1" className="resultValue">
              {formatCurrency(calculationResult.insurancePremium)}
            </Typography>
          </div>
        </>
      )}
      {/* Amortization */}
      <Typography variant="h6" className="resultLabel">
        Amortization
      </Typography>
      <Divider className="divider" />
      <div className="resultItem">
        <Typography variant="body1" className="resultValue">
          Amortization Payments:
        </Typography>
        <Typography variant="body1" className="resultValue">
          {calculationResult.totalNumberOfPaymentsOverAmortization}
        </Typography>
      </div>
      {/* Interest Rates */}
      <Typography variant="h6" className="resultLabel">
        Interest Rates
      </Typography>
      <Divider className="divider" />
      <div className="resultItem">
        <Typography variant="body1" className="resultValue">
          Interest Rate (per payment):
        </Typography>
        <Typography variant="body1" className="resultValue">
          {(calculationResult.perPaymentScheduleInterestRate * 100).toFixed(2)}%
        </Typography>
      </div>
      <div className="resultItem">
        <Typography variant="body1" className="resultValue">
          Annual Interest Rate (converted):
        </Typography>
        <Typography variant="body1" className="resultValue">
          {(calculationResult.convertedDecimalInterestRate * 100).toFixed(2)}%
        </Typography>
      </div>
      {/* Payment Schedule */}
      <Typography variant="h6" className="resultLabel">
        Payment Schedule
      </Typography>
      <Divider className="divider" />
      <div className="resultItem">
        <Typography variant="body1" className="resultValue">
          Payment Periods per Year:
        </Typography>
        <Typography variant="body1" className="resultValue">
          {calculationResult.payPeriodsPerYear}
        </Typography>
      </div>
    </div>
  );
};

export default MortgageResultCard;
