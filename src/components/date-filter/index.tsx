import React, { useEffect, useState, type SyntheticEvent } from "react";
import { Button, Tabs, Tab, Stack } from "@mui/material";

// Import styles
import { 
  tabGroupContainerSx, 
  tabsContainerSx, 
  tabItemSx, 
  allResultsButtonSx 
} from './styles';

interface TabData {
  id: string;
  label: string;
}

type DateFilterProps = {
  dates: TabData[];
  selectedDateId: string | null;
  onChange: (dateId: string | null) => void;
  isLoading?: boolean;
};

// The main component: DateFilter
const DateFilter = ({ dates, selectedDateId, onChange }: DateFilterProps) => {
  const [activeTabId, setActiveTabId] = useState(selectedDateId);
  // useRef is kept for potential future imperative scroll/focus logic, but is unused in the current logic
  const tabsRef = React.useRef<HTMLDivElement>(null); 

  // Select all if default selectedDateId is not in dates
  useEffect(() => {
    const notMatched = dates.findIndex((date) => date.id === selectedDateId) !== -1
    if(  !notMatched ){
      handleAllResultsClick();
    }
  }, [dates, selectedDateId]);

  // Sync internal state change with external handler
  useEffect(() => {
    onChange(activeTabId);
  }, [activeTabId, onChange]);

  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setActiveTabId(newValue);
  };

  const handleAllResultsClick = () => {
    setActiveTabId(null);
  };

  return (
    <Stack maxWidth={"100%"}>
      
      {/* Tab Group: Translucent Background Bar */}
      <Stack
        sx={tabGroupContainerSx} // Use imported style
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        {/* Tab List */}
        <Tabs
          ref={tabsRef}
          // The Tabs component treats 'false' as the value when nothing is selected
          value={activeTabId || false} 
          onChange={handleTabChange}
          variant="scrollable"
          aria-label="Report Tabs"
          allowScrollButtonsMobile
          slots={{
            indicator: () => null,
          }}
          sx={tabsContainerSx} // Use imported style
        >
          {dates.map((tab) => (
            <Tab
              key={`date-filter-${tab.id}`}
              label={tab.label}
              value={tab.id}
              data-value={tab.id}
              sx={tabItemSx} // Use imported style
            />
          ))}
        </Tabs>
      </Stack>

      {/* "All Results" Button - Placed outside the tab strip */}
      <Stack flexDirection="row" justifyContent="flex-end">
            <Button 
              onClick={handleAllResultsClick} 
              sx={allResultsButtonSx} // Use imported style
              disabled={!selectedDateId}
            >
              All Results
            </Button>
        </Stack>
    </Stack>
  );
};

export default DateFilter;