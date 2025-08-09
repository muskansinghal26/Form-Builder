import React, { useState } from 'react';
import {
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { updateField } from '../store/formsSlice';
import { FormField, ValidationRule } from '../types';
import { getValidationRuleLabel } from '../utils/validation';
import { getAvailableFormulas } from '../utils/derivedFields';

interface FieldConfigProps {
  field: FormField;
}

const FieldConfig: React.FC<FieldConfigProps> = ({ field }) => {
  const dispatch = useDispatch();
  const { currentForm } = useSelector((state: RootState) => state.forms);
  const [newValidationRule, setNewValidationRule] = useState<Partial<ValidationRule>>({
    type: 'required',
    message: '',
  });
  const [newOption, setNewOption] = useState('');

  const handleFieldUpdate = (updates: Partial<FormField>) => {
    dispatch(updateField({ fieldId: field.id, field: updates }));
  };

  const handleAddValidationRule = () => {
    if (newValidationRule.type) {
      const rule: ValidationRule = {
        type: newValidationRule.type,
        value: newValidationRule.value,
        message: newValidationRule.message || '',
      };
      const updatedRules = [...field.validationRules, rule];
      handleFieldUpdate({ validationRules: updatedRules });
      setNewValidationRule({ type: 'required', message: '' });
    }
  };

  const handleRemoveValidationRule = (index: number) => {
    const updatedRules = field.validationRules.filter((_, i) => i !== index);
    handleFieldUpdate({ validationRules: updatedRules });
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...(field.options || []), newOption.trim()];
      handleFieldUpdate({ options: updatedOptions });
      setNewOption('');
    }
  };

  const handleRemoveOption = (option: string) => {
    const updatedOptions = field.options?.filter(o => o !== option) || [];
    handleFieldUpdate({ options: updatedOptions });
  };

  const handleParentFieldChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const parentFields = typeof value === 'string' ? value.split(',') : value;
    handleFieldUpdate({ parentFields });
  };

  const availableFields = currentForm?.fields.filter(f => f.id !== field.id) || [];
  const formulas = getAvailableFormulas();

  return (
    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#fafafa' }}>
      <Typography variant="h6" gutterBottom>
        Field Configuration
      </Typography>

      <Grid container spacing={2}>
        {/* Basic Configuration */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Field Label"
            value={field.label}
            onChange={(e) => handleFieldUpdate({ label: e.target.value })}
            margin="normal"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Default Value"
            value={field.defaultValue || ''}
            onChange={(e) => handleFieldUpdate({ defaultValue: e.target.value })}
            margin="normal"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.required}
                onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
              />
            }
            label="Required Field"
          />
        </Grid>

        {/* Options for Select/Radio fields */}
        {(field.type === 'select' || field.type === 'radio') && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Options
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                label="Add Option"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
              />
              <Button variant="outlined" onClick={handleAddOption}>
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {field.options?.map((option, index) => (
                <Chip
                  key={index}
                  label={option}
                  onDelete={() => handleRemoveOption(option)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
        )}

        {/* Validation Rules */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Validation Rules
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rule Type</InputLabel>
              <Select
                value={newValidationRule.type || ''}
                onChange={(e) => setNewValidationRule({ ...newValidationRule, type: e.target.value as any })}
                label="Rule Type"
              >
                <MenuItem value="required">Required</MenuItem>
                <MenuItem value="minLength">Min Length</MenuItem>
                <MenuItem value="maxLength">Max Length</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="password">Password</MenuItem>
              </Select>
            </FormControl>
            {(newValidationRule.type === 'minLength' || newValidationRule.type === 'maxLength') && (
              <TextField
                size="small"
                type="number"
                label="Value"
                value={newValidationRule.value || ''}
                onChange={(e) => setNewValidationRule({ ...newValidationRule, value: e.target.value })}
                sx={{ width: 100 }}
              />
            )}
            <TextField
              size="small"
              label="Error Message"
              value={newValidationRule.message || ''}
              onChange={(e) => setNewValidationRule({ ...newValidationRule, message: e.target.value })}
            />
            <Button variant="outlined" onClick={handleAddValidationRule}>
              Add Rule
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {field.validationRules.map((rule, index) => (
              <Chip
                key={index}
                label={`${getValidationRuleLabel(rule.type)}${rule.value ? `: ${rule.value}` : ''}`}
                onDelete={() => handleRemoveValidationRule(index)}
                color="secondary"
                variant="outlined"
              />
            ))}
          </Box>
        </Grid>

        {/* Derived Field Configuration */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.isDerived}
                onChange={(e) => handleFieldUpdate({ isDerived: e.target.checked })}
              />
            }
            label="Derived Field"
          />
        </Grid>

        {field.isDerived && (
          <>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Parent Fields</InputLabel>
                <Select
                  multiple
                  value={field.parentFields || []}
                  onChange={handleParentFieldChange}
                  input={<OutlinedInput label="Parent Fields" />}
                >
                  {availableFields.map((f) => (
                    <MenuItem key={f.id} value={f.id}>
                      {f.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Formula</InputLabel>
                <Select
                  value={field.formula || ''}
                  onChange={(e) => handleFieldUpdate({ formula: e.target.value })}
                  label="Formula"
                >
                  {formulas.map((formula) => (
                    <MenuItem key={formula.value} value={formula.value}>
                      {formula.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {field.formula === 'custom' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Custom Formula"
                  value={field.formula || ''}
                  onChange={(e) => handleFieldUpdate({ formula: e.target.value })}
                  placeholder="Use {fieldId} to reference parent fields"
                  helperText="Example: {firstName} {lastName}"
                />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default FieldConfig;
