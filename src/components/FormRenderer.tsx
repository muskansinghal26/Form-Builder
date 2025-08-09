import React, { useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Chip,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateCurrentFormData } from '../store/formsSlice';
import { FormSchema, FormField } from '../types';
import { validateField } from '../utils/validation';
import { calculateDerivedValue } from '../utils/derivedFields';

interface FormRendererProps {
  form: FormSchema;
}

const FormRenderer: React.FC<FormRendererProps> = ({ form }) => {
  const dispatch = useDispatch();
  const { currentFormData } = useSelector((state: RootState) => state.forms);
  const [errors, setErrors] = React.useState<{ [fieldId: string]: string[] }>({});

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(updateCurrentFormData({ fieldId, value }));
  };

  const validateForm = () => {
    const newErrors: { [fieldId: string]: string[] } = {};
    
    form.fields.forEach(field => {
      const value = currentFormData[field.id] || field.defaultValue;
      const fieldErrors = validateField(value, field.validationRules);
      if (fieldErrors.length > 0) {
        newErrors[field.id] = fieldErrors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    // Validate form when data changes
    validateForm();
  }, [currentFormData, form.fields, validateForm]);

  const renderField = (field: FormField) => {
    const value = currentFormData[field.id] || field.defaultValue || '';
    const fieldErrors = errors[field.id] || [];
    const hasError = fieldErrors.length > 0;

    // Calculate derived value if it's a derived field
    const displayValue = field.isDerived 
      ? calculateDerivedValue(field, currentFormData, form.fields)
      : value;

    const commonProps = {
      fullWidth: true,
      error: hasError,
      helperText: fieldErrors.join(', '),
      disabled: field.isDerived,
      sx: { mb: 2 },
    };

    switch (field.type) {
      case 'text':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            value={displayValue}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      case 'number':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            type="number"
            value={displayValue}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            multiline
            rows={4}
            value={displayValue}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      case 'select':
        return (
          <FormControl {...commonProps} required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={displayValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              label={field.label}
              disabled={field.isDerived}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {hasError && <FormHelperText error>{fieldErrors.join(', ')}</FormHelperText>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl {...commonProps} required={field.required}>
            <FormLabel>{field.label}</FormLabel>
            <RadioGroup
              value={displayValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio disabled={field.isDerived} />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {hasError && <FormHelperText error>{fieldErrors.join(', ')}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(displayValue)}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                disabled={field.isDerived}
              />
            }
            label={field.label}
            sx={{ mb: 2 }}
          />
        );

      case 'date':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            type="date"
            value={displayValue}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            InputLabelProps={{ shrink: true }}
          />
        );

      default:
        return null;
    }
  };

  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);

  return (
    <Box>
      {sortedFields.map((field) => (
        <Box key={field.id}>
          {field.isDerived && (
            <Box sx={{ mb: 1 }}>
              <Chip 
                label="Derived Field" 
                size="small" 
                color="secondary" 
                variant="outlined"
              />
            </Box>
          )}
          {renderField(field)}
        </Box>
      ))}
    </Box>
  );
};

export default FormRenderer;
