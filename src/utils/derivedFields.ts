import { FormField, FormData } from '../types';

export const calculateDerivedValue = (
  field: FormField,
  formData: FormData,
  allFields: FormField[]
): any => {
  if (!field.isDerived || !field.parentFields || !field.formula) {
    return formData[field.id] || field.defaultValue;
  }

  try {
    // Get parent field values
    const parentValues = field.parentFields.map(parentId => {
      const parentField = allFields.find(f => f.id === parentId);
      if (!parentField) return null;
      return formData[parentId] || parentField.defaultValue;
    });

    // Simple formula evaluation (can be extended for more complex logic)
    switch (field.formula) {
      case 'age_from_dob':
        if (parentValues[0]) {
          const dob = new Date(parentValues[0]);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();
          return monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) 
            ? age - 1 
            : age;
        }
        return null;

      case 'full_name':
        return parentValues.filter(v => v).join(' ');

      case 'sum':
        return parentValues.reduce((sum, val) => sum + (Number(val) || 0), 0);

      case 'multiply':
        return parentValues.reduce((product, val) => product * (Number(val) || 1), 1);

      case 'concat':
        return parentValues.filter(v => v).join('');

      default:
        // Custom formula evaluation
        let result = field.formula;
        field.parentFields.forEach((parentId, index) => {
          const value = parentValues[index];
          result = result.replace(new RegExp(`\\{${parentId}\\}`, 'g'), value || '');
        });
        return result;
    }
  } catch (error) {
    console.error('Error calculating derived value:', error);
    return null;
  }
};

export const getAvailableFormulas = (): { value: string; label: string; description: string }[] => {
  return [
    {
      value: 'age_from_dob',
      label: 'Age from Date of Birth',
      description: 'Calculates age based on date of birth'
    },
    {
      value: 'full_name',
      label: 'Full Name',
      description: 'Combines first and last name'
    },
    {
      value: 'sum',
      label: 'Sum',
      description: 'Adds all parent field values'
    },
    {
      value: 'multiply',
      label: 'Multiply',
      description: 'Multiplies all parent field values'
    },
    {
      value: 'concat',
      label: 'Concatenate',
      description: 'Joins parent field values as strings'
    },
    {
      value: 'custom',
      label: 'Custom Formula',
      description: 'Use {fieldId} to reference parent fields'
    }
  ];
};
