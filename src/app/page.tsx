"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography, Box } from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import "./app.scss";

export default function Home() {
  const router: AppRouterInstance = useRouter();

  // Navigate to the /calculator route when the button is clicked.
  const handleButtonClick = (): void => {
    router.push('/calculator');
  };

  return (
    <main className="main">
      <div className="description">
        <Typography variant="h4" className="homepageHeading" gutterBottom>
          Calculate your mortgage quickly and easily.
        </Typography>
        <Typography variant="body1" className="descriptionText" paragraph>
          This calculator determines your mortgage payment and provides you with a mortgage payment schedule.
          The calculator also shows how much money and how many years you can save by making prepayments.
        </Typography>
        <Box className="buttonWrapper">
          <Button
            variant="contained"
            color="primary"
            className="calculatorButton"
            onClick={handleButtonClick}
          >
            Start Mortgage Calculator
          </Button>
        </Box>
      </div>
    </main>
  );
};
