import { Button, Typography, Stack, FormControl, Select, MenuItem, Chip } from '@mui/material';
import { type SelectChangeEvent } from '@mui/material/Select';

interface FilterData {
  id: string;
  label: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      borderRadius: '16px', // Rounded corners for the dropdown menu
      // Adding a subtle glass effect to the dropdown menu background
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(5px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
    },
  },
};

type MultiSelectProps = {
  selectedIds: string[];
  options: FilterData[];
  onChange: (selectedIds: string[]) => void;
}

/**
 * MultiSelectPills Component
 * Implements a glassmorphic multi-select filter using MUI Select component.
 */
const MultiSelect = ({ selectedIds, options, onChange}: MultiSelectProps) => {

  // Handler for when a selection is made in the MUI Select
  const handleSelectionChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    // On autofill we get a stringified value. We want an array of strings.
    onChange(typeof value === 'string' ? value.split(',') : value);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    // Outer Box with a strong background to clearly demonstrate the translucent effect (glassmorphism)
    <Stack flex={1} maxWidth={"100%"} width={"fit-content"}>
      
      {/* The Glassmorphic Dropdown Button (FormControl/Select) */}
      <FormControl sx={{ minWidth: 227, flexGrow: 1 }}>
        <Select
          multiple
          displayEmpty
          value={selectedIds}
          onChange={handleSelectionChange}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <Typography variant="body2" sx={{ color: 'text.secondary' }}>Select Filters...</Typography>;
            }
            return (
              <Stack direction="row" gap={2} justifyContent="space-between" sx={{ overflowX: 'auto', flexWrap: 'nowrap', '&::-webkit-scrollbar': { display: 'none' } }}>
                <Chip label={`${selectedIds.length} selected`} size="small" sx={{ 
                      backgroundColor: '#C2C2C2', // Translucent light gray
                      color: '#000', 
                      fontSize: '11px',
                      height: '20px'
                }} />
                <Typography fontSize={14}>Select Filters...</Typography>
                
                {/* {getLabelsFromIds(selected).map((value) => (
                  <Chip key={value} label={value} size="small" sx={{ 
                      backgroundColor: '#C2C2C2', // Translucent light gray
                      color: '#000', 
                      fontSize: '11px',
                      height: '20px'
                  }} />
                ))} */}
              </Stack>
            );
          }}
          MenuProps={MenuProps}
          sx={{
            // Glass Effect Button Styling
            borderRadius: '30px',
            height: '40px',
            backgroundColor: 'rgba(221, 221, 221, 0.7)', // Translucent light gray
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'text.secondary',
            fontSize: '12px',
            fontWeight: 500,

            // Hide default MUI borders and icons
            '& fieldset': { border: 'none' },
            '& .MuiSelect-icon': { color: 'text.secondary' },
            '& .MuiSelect-select': { 
              height: '40px', 
              paddingY: '0', 
              display: 'flex',
              alignItems: 'center',
              // Remove default chip padding when chips are present
              ...(selectedIds.length > 0 && { paddingY: '8px !important' })
            },
          }}
        >
          {options.map((filter) => (
            <MenuItem
              key={filter.id}
              value={filter.id}
              sx={{ 
                borderRadius: '10px', 
                m: '0 8px', 
                width: 'calc(100% - 16px)' 
              }}
            >
              {filter.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Clear All Button */}
      <Stack flexDirection="row" justifyContent="flex-end">
          <Button onClick={handleClearAll} sx={{ 
              fontSize: '12px',
              minHeight: '30px',
              height: '30px', 
              minWidth: 'auto',
              borderRadius: '30px', 
              textTransform: 'none',
              color: 'text.secondary',
              transition: 'all 200ms',
              fontWeight: 400,
              '&:hover': {
                  borderRadius: '30px',
                  height: '30px',
                  color: 'text.primary',
                  fontWeight: 500,
                  background: 'none',
                },
                '&.Mui-disabled': {
                  borderRadius: '30px',
                  color: '#d1d1d1',
                  height: '30px',
                  fontWeight: 600,
                },
                '&.Mui-selected': {
                  borderRadius: '30px',
                  color: 'text.primary',
                  height: '30px',
                  fontWeight: 600,
                },
              }}>Select All</Button>
      </Stack>
    </Stack>
  );
};

export default MultiSelect;
