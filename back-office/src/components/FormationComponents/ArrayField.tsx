import React from 'react';
import {
  TextField,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface ArrayFieldProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  touched?: boolean;
  minItems?: number;
  itemKey?: string;
}

const ArrayField: React.FC<ArrayFieldProps> = ({
  label,
  items,
  onChange,
  placeholder = 'Élément',
  icon,
  error,
  touched,
  minItems = 1,
  itemKey,
}) => {
  const hasError = Boolean(error && touched);

  const handleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const handleAdd = () => {
    onChange([...items, '']);
  };

  const handleRemove = (index: number) => {
    if (items.length > minItems) {
      onChange(items.filter((_, i) => i !== index));
    }
  };

  return (
    <Box className="w-full">
      <label
        className={`flex items-center gap-2 text-sm font-medium mb-2 ${
          hasError ? 'text-red-600' : 'text-gray-700'
        }`}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {label}
        {hasError && touched && (
          <span className="text-red-500 text-xs ml-1">{error}</span>
        )}
      </label>

      {items.map((item, index) => (
        <div
          key={`${itemKey || 'item'}-${index}-${item}`}
          className="flex gap-2 mb-2 items-center"
        >
          <TextField
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            fullWidth
            size="small"
            error={hasError && !item.trim()}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: !item.trim() && touched ? '#eff6ff' : 'transparent',
                '&.Mui-focused': {
                  backgroundColor: !item.trim() && touched ? '#dbeafe' : 'transparent',
                },
              },
            }}
          />
          <IconButton
            type="button"
            onClick={() => handleRemove(index)}
            color="error"
            size="small"
            disabled={items.length <= minItems}
            className="flex-shrink-0"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ))}

      <Button
        type="button"
        onClick={handleAdd}
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        className="mt-1"
      >
        Ajouter
      </Button>
    </Box>
  );
};

export default ArrayField;