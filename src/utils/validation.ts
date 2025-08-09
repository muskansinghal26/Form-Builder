import { ValidationRule } from '../types';

export const validateField = (value: any, validationRules: ValidationRule[]): string[] => {
  const errors: string[] = [];

  validationRules.forEach(rule => {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(rule.message || 'This field is required');
        }
        break;

      case 'minLength':
        if (value && typeof value === 'string' && value.length < (rule.value as number)) {
          errors.push(rule.message || `Minimum length is ${rule.value} characters`);
        }
        break;

      case 'maxLength':
        if (value && typeof value === 'string' && value.length > (rule.value as number)) {
          errors.push(rule.message || `Maximum length is ${rule.value} characters`);
        }
        break;

      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(rule.message || 'Please enter a valid email address');
          }
        }
        break;

      case 'password':
        if (value && typeof value === 'string') {
          const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
          if (!passwordRegex.test(value)) {
            errors.push(rule.message || 'Password must be at least 8 characters with letters and numbers');
          }
        }
        break;

      case 'custom':
        // Custom validation logic can be added here
        break;
    }
  });

  return errors;
};

export const getValidationRuleLabel = (type: string): string => {
  switch (type) {
    case 'required':
      return 'Required';
    case 'minLength':
      return 'Minimum Length';
    case 'maxLength':
      return 'Maximum Length';
    case 'email':
      return 'Email Format';
    case 'password':
      return 'Password Rules';
    default:
      return 'Custom';
  }
};
