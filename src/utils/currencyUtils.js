/**
 * Format a number as Philippine Peso currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Parse a currency string back to a number (removes PHP symbol and commas)
 * @param {string} currencyString - The formatted currency string
 * @returns {number} The numeric value
 */
export function parseCurrency(currencyString) {
  if (!currencyString) return 0;
  // Remove PHP symbol, commas, and whitespace
  const numeric = currencyString.replace(/[^\d.-]/g, '');
  return parseFloat(numeric) || 0;
}