import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from 'lucide-react';


interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Rechercher...',
  className = '',
}) => {
  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search className="h-4 w-4 text-gray-400" />
          </InputAdornment>
        ),
      }}
      sx={{
        minWidth: 250,
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          backgroundColor: 'white',
        },
      }}
    />
  );
};

export default SearchInput;