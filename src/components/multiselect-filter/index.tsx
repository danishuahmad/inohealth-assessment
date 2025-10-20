// MultiSelect.tsx
import {
  Button,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { type SelectChangeEvent } from "@mui/material/Select";

import DoneIcon from "@mui/icons-material/Done";

// Import all styles from the dedicated file
import {
  MenuProps,
  selectBaseSx,
  selectValueDisplaySx,
  selectedChipSx,
  menuItemBaseSx,
  clearButtonSx,
} from "./styles";

interface FilterData {
  id: string;
  label: string;
}

type MultiSelectProps = {
  selectedIds: string[];
  options: FilterData[];
  onChange: (selectedIds: string[]) => void;
};

/**
 * MultiSelect Component
 * Implements a multi-select filter using the MUI Select component, with styles imported from a separate file.
 */
const MultiSelect = ({ selectedIds, options, onChange }: MultiSelectProps) => {
  const handleSelectionChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onChange(typeof value === "string" ? value.split(",") : value);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <Stack flex={1} maxWidth={"100%"} width={"fit-content"}>
      {/* The Dropdown Button (FormControl/Select) */}
      <FormControl sx={{ minWidth: 227, flexGrow: 1 }}>
        <Select
          multiple
          displayEmpty
          value={selectedIds}
          onChange={handleSelectionChange}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Select Filters...
                </Typography>
              );
            }
            return (
              <Stack
                direction="row"
                gap={2}
                justifyContent="space-between"
                sx={{
                  overflowX: "auto",
                  flexWrap: "nowrap",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                <Chip
                  label={`${selectedIds.length} selected`}
                  size="small"
                  sx={selectedChipSx}
                />
                <Typography fontSize={14}>Select Filters...</Typography>
              </Stack>
            );
          }}
          MenuProps={MenuProps}
          sx={{
            ...selectBaseSx,
            // Apply conditional styling for the inner select box
            "& .MuiSelect-select": {
              ...selectValueDisplaySx,
              // Remove default chip padding when chips are present
              ...(selectedIds.length > 0 && { paddingY: "8px !important" }),
            },
          }}
        >
          {options.map((filter) => (
            <MenuItem
              key={`multi-select-filter-${filter.id}`}
              value={filter.id}
              sx={menuItemBaseSx} // Use imported style
            >
              {filter.label}
              {/* show tick if label is selected */}
              {selectedIds.indexOf(filter.id) > -1 && (
                <DoneIcon
                  sx={{ height: 14, marginLeft: "auto", color: "text.primary" }}
                />
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Clear All Button */}
      <Stack flexDirection="row" justifyContent="flex-end">
        <Button
          onClick={handleClearAll}
          sx={clearButtonSx} // Use imported style
          disabled={!selectedIds.length}
        >
          Clear All
        </Button>
      </Stack>
    </Stack>
  );
};

export default MultiSelect;
