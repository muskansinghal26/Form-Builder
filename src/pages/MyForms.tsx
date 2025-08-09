import React from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { deleteForm, setCurrentForm } from '../store/formsSlice';
import FormRenderer from '../components/FormRenderer';

const MyForms: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forms } = useSelector((state: RootState) => state.forms);
  const [selectedForm, setSelectedForm] = React.useState<any>(null);
  const [showPreviewDialog, setShowPreviewDialog] = React.useState(false);

  const handleViewForm = (form: any) => {
    dispatch(setCurrentForm(form));
    navigate('/preview');
  };

  const handleEditForm = (form: any) => {
    dispatch(setCurrentForm(form));
    navigate('/create');
  };

  const handleDeleteForm = (formId: string) => {
    dispatch(deleteForm(formId));
  };

  const handlePreviewForm = (form: any) => {
    setSelectedForm(form);
    setShowPreviewDialog(true);
  };

  const getFieldTypeCounts = (fields: any[]) => {
    const counts: { [key: string]: number } = {};
    fields.forEach(field => {
      counts[field.type] = (counts[field.type] || 0) + 1;
    });
    return counts;
  };

  if (forms.length === 0) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          My Forms
        </Typography>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No forms saved yet
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Create and save your first form to see it here
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/create')}
            sx={{ mt: 2 }}
          >
            Create Form
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Forms ({forms.length})
      </Typography>

      <Grid container spacing={3}>
        {forms.map((form) => {
          const fieldCounts = getFieldTypeCounts(form.fields);
          const derivedFields = form.fields.filter((f: any) => f.isDerived).length;

          return (
            <Grid item xs={12} md={6} lg={4} key={form.id}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                    {form.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handlePreviewForm(form)}
                      title="Quick Preview"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEditForm(form)}
                      title="Edit Form"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteForm(form.id)}
                      color="error"
                      title="Delete Form"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Created: {new Date(form.createdAt).toLocaleDateString()}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Fields: {form.fields.length}
                  </Typography>
                  {derivedFields > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Derived: {derivedFields}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {Object.entries(fieldCounts).map(([type, count]) => (
                    <Chip
                      key={type}
                      label={`${type}: ${count}`}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewForm(form)}
                    fullWidth
                  >
                    View Form
                  </Button>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={showPreviewDialog}
        onClose={() => setShowPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedForm?.name} - Preview
        </DialogTitle>
        <DialogContent>
          {selectedForm && (
            <FormRenderer form={selectedForm} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreviewDialog(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowPreviewDialog(false);
              if (selectedForm) {
                handleViewForm(selectedForm);
              }
            }}
          >
            Open Full Preview
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyForms;
