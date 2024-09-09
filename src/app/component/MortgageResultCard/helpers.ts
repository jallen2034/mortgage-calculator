// Helper function to properly format the currency results.
export const formatCurrency = (value): string => {
  return `$${parseFloat(value).toFixed(2)}`;
};