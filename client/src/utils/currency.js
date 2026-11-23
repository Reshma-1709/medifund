/**
 * Indian Rupee (INR) currency formatter utility for MediFund
 * Formats numbers into Indian numbering system (e.g., ₹1,000, ₹10,000, ₹10,00,000)
 */

export const formatINR = (amount) => {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN');
};

export const formatNumberINR = (amount) => {
  const num = Number(amount) || 0;
  return num.toLocaleString('en-IN');
};

export default formatINR;
