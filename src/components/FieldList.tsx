import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Collapse,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { deleteField, reorderFields } from '../store/formsSlice';

import FieldConfig from './FieldConfig';

const FieldList: React.FC = () => {
  const dispatch = useDispatch();
  const { currentForm } = useSelector((state: RootState) => state.forms);
  const [expandedField, setExpandedField] = useState<string | null>(null);

  if (!currentForm || currentForm.fields.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No fields added yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add your first field to start building the form
        </Typography>
      </Paper>
    );
  }

  const handleDeleteField = (fieldId: string) => {
    dispatch(deleteField(fieldId));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      dispatch(reorderFields({ fromIndex: dragIndex, toIndex: dropIndex }));
    }
  };

  const getFieldTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      text: '#1976d2',
      number: '#388e3c',
      textarea: '#f57c00',
      select: '#7b1fa2',
      radio: '#d32f2f',
      checkbox: '#c2185b',
      date: '#0288d1',
    };
    return colors[type] || '#757575';
  };

  const sortedFields = [...currentForm.fields].sort((a, b) => a.order - b.order);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Form Fields ({sortedFields.length})
      </Typography>
      <List>
        {sortedFields.map((field, index) => (
          <React.Fragment key={field.id}>
            <ListItem
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                mb: 1,
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <DragIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">{field.label}</Typography>
                    <Chip
                      label={field.type}
                      size="small"
                      sx={{
                        backgroundColor: getFieldTypeColor(field.type),
                        color: 'white',
                        fontSize: '0.75rem',
                      }}
                    />
                    {field.required && (
                      <Chip label="Required" size="small" color="error" />
                    )}
                    {field.isDerived && (
                      <Chip label="Derived" size="small" color="secondary" />
                    )}
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {field.validationRules.length > 0 && (
                      <span>Validations: {field.validationRules.length} </span>
                    )}
                    {field.isDerived && field.parentFields && (
                      <span>• Parent fields: {field.parentFields.length}</span>
                    )}
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => setExpandedField(expandedField === field.id ? null : field.id)}
                >
                  {expandedField === field.id ? <CollapseIcon /> : <ExpandIcon />}
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteField(field.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={expandedField === field.id}>
              <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                <FieldConfig field={field} />
              </Box>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default FieldList;
