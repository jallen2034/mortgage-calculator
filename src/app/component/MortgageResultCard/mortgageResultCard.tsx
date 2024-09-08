import React from "react";
import { Typography } from "@mui/material";
import { MortgageResultCardProps } from "@/app/component/MortgageResultCard/types";
import "./mortgageResultCard.scss";

const MortgageResultCard: React.FC<MortgageResultCardProps> = ({ calculationResult }) => {
  return (
    <div className="resultCard">
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">
          Down Payment Percentage:
        </Typography>
        <Typography variant="body1" className="resultValue">
          {calculationResult.downPaymentPercentage.toFixed(2)}%
        </Typography>
      </div>
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">
          Monthly Mortgage Payment:
        </Typography>
        <Typography variant="body1" className="resultValue">
          ${calculationResult.monthlyMortgagePayment.toFixed(2)}
        </Typography>
      </div>
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">
          Total Mortgage Amount:
        </Typography>
        <Typography variant="body1" className="resultValue">
          ${calculationResult.totalMortgageAmount.toFixed(2)}
        </Typography>
      </div>
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">
          CHMC Insurance Required:
        </Typography>
        <Typography variant="body1" className="resultValue">
          {calculationResult.needsCHMCInsurance ? "Yes" : "No"}
        </Typography>
      </div>
      {calculationResult.needsCHMCInsurance &&
        <div>
          <div className="resultItem">
            <Typography variant="body1" className="resultLabel">
              CHMC Insurance Rate
            </Typography>
            <Typography variant="body1" className="resultValue">
              {calculationResult.CHMCInsuranceRate}
            </Typography>
          </div>
          <div className="resultItem">
            <Typography variant="body1" className="resultLabel">
              CHMC Insurance Premium
            </Typography>
            <Typography variant="body1" className="resultValue">
              {calculationResult.insurancePremium}
            </Typography>
          </div>
        </div>
      }
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">
          Total Number of Payments:
        </Typography>
        <Typography variant="body1" className="resultValue">
          {calculationResult.totalNumberOfPaymentsOverAmortization}
        </Typography>
      </div>
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">
          Interest Rate (per payment):
        </Typography>
        <Typography variant="body1" className="resultValue">
          {(calculationResult.perPaymentScheduleInterestRate * 100).toFixed(2)}%
        </Typography>
      </div>
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">
          Annual Interest Rate (converted):
        </Typography>
        <Typography variant="body1" className="resultValue">
          {(calculationResult.convertedDecimalInterestRate * 100).toFixed(2)}%
        </Typography>
      </div>
      <div className="resultItem">
        <Typography variant="body1" className="resultLabel">
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
