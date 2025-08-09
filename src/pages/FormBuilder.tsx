import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { RootState } from '../store/store';
import { addForm, setCurrentForm } from '../store/formsSlice';
import { FormField, FieldType } from '../types';

import FieldList from '../components/FieldList';

const FormBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const { currentForm } = useSelector((state: RootState) => state.forms);
  const [formName, setFormName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showAddFieldDialog, setShowAddFieldDialog] = useState(false);
  const [newField, setNewField] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    required: false,
    validationRules: [],
    isDerived: false,
    order: 0,
  });

  const handleAddField = () => {
    if (newField.label && newField.type) {
      const field: FormField = {
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: newField.type as FieldType,
        label: newField.label,
        required: newField.required || false,
        validationRules: newField.validationRules || [],
        isDerived: newField.isDerived || false,
        parentFields: newField.parentFields || [],
        formula: newField.formula || '',
        options: newField.options || [],
        order: currentForm?.fields.length || 0,
      };

      if (!currentForm) {
        // Create new form
        const form = {
          id: `form_${Date.now()}`,
          name: 'Untitled Form',
          fields: [field],
          createdAt: new Date().toISOString(),
        };
        dispatch(setCurrentForm(form));
      } else {
        // Add field to existing form
        const updatedForm = {
          ...currentForm,
          fields: [...currentForm.fields, field],
        };
        dispatch(setCurrentForm(updatedForm));
      }

      setNewField({
        type: 'text',
        label: '',
        required: false,
        validationRules: [],
        isDerived: false,
        order: 0,
      });
      setShowAddFieldDialog(false);
    }
  };

  const handleSaveForm = () => {
    if (formName.trim() && currentForm) {
      const formToSave = {
        ...currentForm,
        name: formName.trim(),
      };
      dispatch(addForm(formToSave));
      setShowSaveDialog(false);
      setFormName('');
      dispatch(setCurrentForm(null));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Form Builder
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddFieldDialog(true)}
          >
            Add Field
          </Button>
          {currentForm && currentForm.fields.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={() => setShowSaveDialog(true)}
            >
              Save Form
            </Button>
          )}
        </Box>
      </Box>

      {!currentForm ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No form created yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click "Add Field" to start building your form
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <FieldList />
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Form Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fields: {currentForm.fields.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Derived Fields: {currentForm.fields.filter(f => f.isDerived).length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Add Field Dialog */}
      <Dialog open={showAddFieldDialog} onClose={() => setShowAddFieldDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Field</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Field Label"
                value={newField.label}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Field Type"
                value={newField.type}
                onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
                SelectProps={{ native: true }}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="textarea">Textarea</option>
                <option value="select">Select</option>
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
                <option value="date">Date</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddFieldDialog(false)}>Cancel</Button>
          <Button onClick={handleAddField} variant="contained">
            Add Field
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Form Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            fullWidth
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter form name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} variant="contained" disabled={!formName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormBuilder;
