"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography, Box } from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import "./app.scss";

export default function Home() {
  const router: AppRouterInstance = useRouter();  // Router instance for navigation

  // Navigate to the /calculator route when the button is clicked
  const handleButtonClick = () => {
    router.push('/calculator');
  };

  return (
    <main className="main">
      <div className="description">
        <Typography variant="h6" className="homepageHeading" gutterBottom>
          Calculate your mortgage quickly and easily.
        </Typography>
        {/* Button with description and hover effect */}
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
}
