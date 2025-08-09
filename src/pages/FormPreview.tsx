import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Button,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCurrentFormData } from '../store/formsSlice';
import FormRenderer from '../components/FormRenderer';

const FormPreview: React.FC = () => {
  const dispatch = useDispatch();
  const { currentForm, currentFormData } = useSelector((state: RootState) => state.forms);

  useEffect(() => {
    // If no current form is set, show a message
    if (!currentForm) {
      return;
    }
  }, [currentForm]);

  const handleClearForm = () => {
    dispatch(clearCurrentFormData());
  };

  if (!currentForm) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Form Preview
        </Typography>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No form to preview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create a form in the Form Builder to preview it here
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Form Preview
        </Typography>
        <Button variant="outlined" onClick={handleClearForm}>
          Clear Form
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is how your form will appear to end users. All validations and derived fields are active.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {currentForm.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Created: {new Date(currentForm.createdAt).toLocaleDateString()}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <FormRenderer form={currentForm} />
        </Box>

        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Form Data (Debug)
          </Typography>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(currentFormData, null, 2)}
          </pre>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormPreview;
