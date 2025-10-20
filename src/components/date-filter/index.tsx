import React, { useEffect, useState, type SyntheticEvent } from "react";
import { Button, Tabs, Tab, Stack, tabsClasses } from "@mui/material";

// ... (MOCK_TABS and TabData interface remain the same)
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
  const tabsRef = React.useRef<HTMLDivElement>(null);

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
    // Outer Box for canvas presentation and styling (MUI default theme assumed)
    <Stack maxWidth={"100%"}>
      {/* Tab Group: Visible scroll area */}
      <Stack
        sx={{
          backgroundColor: "rgba(221, 221, 221, 0.7)", // Translucent light gray
          alignItems: "center",
          borderRadius: "30px",
          overflow: "hidden",
          minHeight: "30px",
          py: 0.5,
        }}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        {/* 2. Tab List */}
        <Tabs
          ref={tabsRef}
          value={activeTabId || false}
          onChange={handleTabChange}
          variant="scrollable"
          aria-label="Report Tabs"
          allowScrollButtonsMobile
          slots={{
            indicator: () => null,
          }}
          sx={{
            flexGrow: 1,
            minHeight: "30px",
            py: 0,
            "& .MuiTabs-indicator": {
              display: "none",
            },
            "& .MuiTabs-flexContainer": {
              alignItems: "center",
            },
            // 👇 CRUCIAL MODIFICATION: Add scroll-behavior: smooth to the scroll container
            "& .MuiTabs-scroller": {
              overflowX: "auto !important",
              scrollBehavior: "smooth",
            },
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
          }}
        >
          {dates.map((tab) => (
            <Tab
              key={tab.id}
              label={tab.label}
              value={tab.id}
              data-value={tab.id}
              sx={{
                fontSize: "12px",
                minHeight: "30px",
                height: "30px",
                minWidth: "auto",
                borderRadius: "30px",
                textTransform: "none",
                color: "text.secondary",
                transition: "all 200ms",
                fontWeight: 400,
                width: "120px",

                "&:hover": {
                  borderRadius: "30px",
                  height: "30px",
                  color: "text.primary",
                  fontWeight: 500,
                },

                "&.Mui-selected": {
                  borderRadius: "30px",
                  backgroundColor: "#C2C2C2",
                  color: "text.primary",
                  fontWeight: 600,
                },
              }}
            />
          ))}
        </Tabs>
      </Stack>

      {/* 4. "All Results" Button - Placed outside the tab strip */}
      <Stack flexDirection="row" justifyContent="flex-end">
            <Button onClick={handleAllResultsClick} sx={{ 
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
                }} disabled={!selectedDateId}>All Results</Button>
        </Stack>
    </Stack>
  );
};

export default DateFilter;
