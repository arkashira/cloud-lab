import React from 'react';
import { FormControl, Select, MenuItem, SelectChangeEvent, InputLabel } from '@material-ui/core';

interface FilterProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  label?: string;
}

export const Filter: React.FC<FilterProps> = ({ 
  value, 
  onChange, 
  options,
  label = 'Filter' 
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={handleChange} label={label}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Filter;