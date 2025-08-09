import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormSchema, FormField, FormData } from '../types';

// Load forms from localStorage
const loadFormsFromStorage = (): FormSchema[] => {
  try {
    const stored = localStorage.getItem('forms');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading forms from localStorage:', error);
    return [];
  }
};

// Save forms to localStorage
const saveFormsToStorage = (forms: FormSchema[]) => {
  try {
    localStorage.setItem('forms', JSON.stringify(forms));
  } catch (error) {
    console.error('Error saving forms to localStorage:', error);
  }
};

interface FormsState {
  forms: FormSchema[];
  currentForm: FormSchema | null;
  currentFormData: FormData;
}

const initialState: FormsState = {
  forms: loadFormsFromStorage(),
  currentForm: null,
  currentFormData: {},
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addForm: (state, action: PayloadAction<FormSchema>) => {
      state.forms.push(action.payload);
      saveFormsToStorage(state.forms);
    },
    updateForm: (state, action: PayloadAction<FormSchema>) => {
      const index = state.forms.findIndex(form => form.id === action.payload.id);
      if (index !== -1) {
        state.forms[index] = action.payload;
        saveFormsToStorage(state.forms);
      }
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.forms = state.forms.filter(form => form.id !== action.payload);
      saveFormsToStorage(state.forms);
    },
    setCurrentForm: (state, action: PayloadAction<FormSchema | null>) => {
      state.currentForm = action.payload;
      state.currentFormData = {};
    },
    updateCurrentFormData: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      const { fieldId, value } = action.payload;
      state.currentFormData[fieldId] = value;
    },
    clearCurrentFormData: (state) => {
      state.currentFormData = {};
    },
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload);
      }
    },
    updateField: (state, action: PayloadAction<{ fieldId: string; field: Partial<FormField> }>) => {
      if (state.currentForm) {
        const fieldIndex = state.currentForm.fields.findIndex(f => f.id === action.payload.fieldId);
        if (fieldIndex !== -1) {
          state.currentForm.fields[fieldIndex] = {
            ...state.currentForm.fields[fieldIndex],
            ...action.payload.field,
          };
        }
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
      }
    },
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      if (state.currentForm) {
        const { fromIndex, toIndex } = action.payload;
        const fields = [...state.currentForm.fields];
        const [movedField] = fields.splice(fromIndex, 1);
        fields.splice(toIndex, 0, movedField);
        fields.forEach((field, index) => {
          field.order = index;
        });
        state.currentForm.fields = fields;
      }
    },
  },
});

export const {
  addForm,
  updateForm,
  deleteForm,
  setCurrentForm,
  updateCurrentFormData,
  clearCurrentFormData,
  addField,
  updateField,
  deleteField,
  reorderFields,
} = formsSlice.actions;

export default formsSlice.reducer;
