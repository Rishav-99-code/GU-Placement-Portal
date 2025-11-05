// Password validation utility
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least 1 digit');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least 1 capital letter');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

export const getPasswordStrength = (password) => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/\d/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++; // Special characters
  
  if (score <= 2) return { strength: 'weak', color: 'red' };
  if (score <= 3) return { strength: 'medium', color: 'yellow' };
  return { strength: 'strong', color: 'green' };
};

export const getPasswordRequirements = () => [
  'At least 8 characters long',
  'At least 1 digit (0-9)',
  'At least 1 capital letter (A-Z)'
];