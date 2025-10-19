import React, { useEffect, useState, type SyntheticEvent } from 'react';
import { Button, Tabs, Tab, Stack, IconButton } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

// ... (MOCK_TABS and TabData interface remain the same)
interface TabData {
  id: string;
  label: string;
}

type DateFilterProps = {
    dates: TabData[];
    selectedDateId: string | null;
    onChange: (dateId: string | null) => void;
};

// The main component: DateFilter
const DateFilter = ({dates, selectedDateId, onChange}: DateFilterProps) => {
  const [activeTabId, setActiveTabId] = useState(selectedDateId);
  const tabsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange(activeTabId);
  }, [activeTabId, onChange])

  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setActiveTabId(newValue);
  };

  const handleFirstClick = () => {
      const firstTabId = dates[0].id;
      setActiveTabId(firstTabId);
  };

  const handleLastClick = () => {
      const lastTabId = dates[dates.length - 1].id;
      setActiveTabId(lastTabId);
  };

  const handleAllResultsClick = () => {
        setActiveTabId(null);
  }

  /**
   * Effect to scroll the active tab into the center of the visible viewport.
   */
  React.useEffect(() => {
      // Find the currently active tab element inside the Tabs container
      const activeTabElement = tabsRef.current?.querySelector<HTMLButtonElement>(
          `.MuiTab-root[data-value="${activeTabId}"]`
      );

      if (activeTabElement) {
          // NOTE: We keep behavior: 'smooth' here as it's the most reliable way 
          // to trigger the scroll animation from a click event. The CSS is now 
          // applied to the scroll container to ensure the best performance.
          activeTabElement.scrollIntoView({
              behavior: 'smooth',
              inline: 'center',
              block: 'nearest',
          });
      }
  }, [activeTabId]);

  return (
    // Outer Box for canvas presentation and styling (MUI default theme assumed)
      <Stack maxWidth={"100%"}>
        {/* Container for Buttons and Tabs - translucent effect applied */}
        <Stack sx={{
          backgroundColor: 'rgba(221, 221, 221, 0.7)', // Translucent light gray
          alignItems: 'center',
          borderRadius: '30px',
          overflow: 'hidden', 
          minHeight: '30px',
          py: 0.5,
        }} flexDirection="row" justifyContent="center" alignItems="center">
            
            {/* 1. First Report Button (Left) */}
            <IconButton
              onClick={handleFirstClick}
              disabled={activeTabId === dates?.[0]?.id}
              sx={{
                minHeight: '30px',
                height: '30px',
                textTransform: 'none',
                mx: 1, 
                color: 'text.secondary',
                fontSize: '12px',
                fontWeight: 500,
                '&.Mui-disabled': { opacity: 0.3, color: 'text.secondary' },
                '&:hover': { background: 'none', color: 'text.primary' }
              }}
            >
                <FirstPageIcon sx={{ height: 16 }} />
            </IconButton>

            {/* Tab Group: Visible scroll area */}
            <Stack
                sx={{
                    display: 'flex',
                    width: { xs: '300px', sm: '380px' }, 
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    borderRadius: '30px',
                    overflow: 'hidden', 
                    minHeight: '30px',
                }}
            >
                {/* 2. Tab List */}
                <Tabs
                    ref={tabsRef} 
                    value={activeTabId || false}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons={false} 
                    aria-label="Report Tabs"
                    sx={{   
                        flexGrow: 1,
                        minHeight: '30px',
                        py: 0,
                        '& .MuiTabs-indicator': {
                          display: 'none',
                        },
                        '& .MuiTabs-flexContainer': {
                          alignItems: 'center',
                        },
                        // 👇 CRUCIAL MODIFICATION: Add scroll-behavior: smooth to the scroll container
                        '& .MuiTabs-scroller': {
                          overflowX: 'auto !important',
                          // This line provides a system-level smooth scrolling effect
                          // that is often smoother than the JS implementation.
                          scrollBehavior: 'smooth', 
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
                          fontSize: '12px',
                          minHeight: '30px',
                          height: '30px', 
                          minWidth: 'auto',
                          borderRadius: '30px', 
                          textTransform: 'none',
                          color: 'text.secondary',
                          transition: 'all 200ms',
                          fontWeight: 400,
                          width: '120px', 

                          '&:hover': {
                            borderRadius: '30px',
                            height: '30px',
                            color: 'text.primary',
                            fontWeight: 500,
                          },

                          '&.Mui-selected': {
                            borderRadius: '30px',
                            backgroundColor: '#C2C2C2',
                            color: 'text.primary',
                            height: '30px',
                            fontWeight: 600,
                          },
                        }}
                      />
                    ))}
                </Tabs>
            </Stack>

            {/* 3. Last Report Button (Right) */}
            <IconButton
              onClick={handleLastClick}
              disabled={activeTabId === dates?.[dates.length - 1]?.id}
              sx={{
                minHeight: '30px',
                height: '30px',
                textTransform: 'none',
                mx: 1, 
                color: 'text.secondary',
                fontSize: '12px',
                fontWeight: 500,
                '&.Mui-disabled': { opacity: 0.3, color: 'text.secondary' },
                '&:hover': { background: 'none', color: 'text.primary' }
              }}
            >
                <LastPageIcon sx={{ height: 16 }} />
            </IconButton>
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