import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useDataContext } from "../../context/data-context/use-data";
import { SubstanceKeys } from "./types";
import SubstanceTrendChart, {
  type LineChartProps,
} from "../../components/substance-trend-chart";
import ResponsiveModal from "../../components/responsive-modal";
import HeroSection from "./hero-section";
import SecondarySection from "./secondary-section";
import Filters from "./filters";
import {
  COLOR_PALETTE,
  ICONS,
  REFERENCE_FOR_RANGES,
  unitFormatter,
} from "./utils";

const Dashboard = () => {
  const { data: apiData, isLoading } = useDataContext();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const SUBSTANCES = useMemo(() => Object.values(SubstanceKeys), []);

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [substanceFilter, setSubstanceFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [substanceHistoryToShow, setSubstanceHistoryToShow] = useState<
    LineChartProps | undefined
  >();

  /**
   * Manage URL parameters to reflect filter state
   */
  useEffect(() => {
    /** Retrieves URL parameters to feed the state */
    if (!isHydrated) return;
    const urlParams = new URLSearchParams(window.location.search);
    const initialSubstances = urlParams.get("substances")
      ? urlParams.get("substances")!.split(",")
      : [];
    const initialDate = urlParams.get("date") || null;
    setSubstanceFilter(initialSubstances);
    setDateFilter(initialDate);
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    const params = new URLSearchParams();
    if (substanceFilter.length > 0)
      params.set("substances", substanceFilter.join(","));

    if (dateFilter) params.set("date", dateFilter);

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    // Only update if URL actually needs to change
    if (window.location.search !== (queryString ? `?${queryString}` : "")) {
      window.history.replaceState({}, "", newUrl);
    }
  }, [substanceFilter, dateFilter, isHydrated]);
  // move from /? to /
  useEffect(() => {
    const currentUrl = window.location.href;

    // Match URLs that end with "/?" (and nothing after "?")
    if (currentUrl.endsWith("/?")) {
      const cleanUrl = currentUrl.replace(/\/\?$/, "/");

      // Use history.replaceState to clean without reloading the page
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (currentUrl.endsWith("?")) {
      // Handle case like "http://example.com?"
      const cleanUrl = currentUrl.slice(0, -1);
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  /**
   * When user selects a substance to view its trend
   */
  const handleSubstanceHistorySelect = useCallback(
    (substance: string) => {
      const data: { date: string; value: number }[] = [];
      apiData?.map((record) => {
        data.push({
          date: record.date_testing,
          value: record[substance as keyof typeof record] as number,
        });
      });
      const unit = apiData?.[0][
        `${substance}_unit` as keyof (typeof apiData)[0]
      ] as string;
      setSubstanceHistoryToShow({
        label:
          substance
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()) +
          ` (${unitFormatter(unit)})`,
        data,
        rangeMin:
          REFERENCE_FOR_RANGES[substance as keyof typeof REFERENCE_FOR_RANGES]
            .min,
        rangeMax:
          REFERENCE_FOR_RANGES[substance as keyof typeof REFERENCE_FOR_RANGES]
            .max,
        color: COLOR_PALETTE[substance as keyof typeof COLOR_PALETTE],
      });
    },
    [apiData]
  );

  return (
    <Stack sx={{ maxHeight: "100%", maxWidth: "100%", pb: 2 }}>
      {/* Filter Section */}
      <Filters
        customStyles={{
          flexDirection: isSmallScreen ? "column" : "row",
          gap: 1,
        }}
        reports_data={apiData || []}
        substances={SUBSTANCES}
        substanceFilter={substanceFilter}
        onSubstanceFilterChange={setSubstanceFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        isLoading={isLoading}
      />

      {/* Main Section */}
      <Stack
        flexDirection={isSmallScreen ? "column" : "row"}
        gap={2}
        alignItems={isSmallScreen ? "stretch" : "flex-start"}
      >
        <Stack flex={isSmallScreen ? "none" : 5}>
          <HeroSection
            customStyles={{ flex: 1, p: 2 }}
            reports_data={apiData || []}
            colorPalette={COLOR_PALETTE}
            referenceForRanges={REFERENCE_FOR_RANGES}
            substances={SUBSTANCES}
            unitFormatter={unitFormatter}
            substanceFilter={substanceFilter}
            dateFilter={dateFilter}
            isLoading={isLoading}
          />
        </Stack>

        <Stack flex={isSmallScreen ? "none" : 3}>
          <SecondarySection
            customStyles={{ flex: 1, p: 2 }}
            reports_data={apiData || []}
            colorPalette={COLOR_PALETTE}
            referenceForRanges={REFERENCE_FOR_RANGES}
            substances={SUBSTANCES}
            icons={ICONS}
            unitFormatter={unitFormatter}
            substanceFilter={substanceFilter}
            dateFilter={dateFilter}
            onSelect={handleSubstanceHistorySelect}
            isLoading={isLoading}
          />
        </Stack>
      </Stack>

      {/* Modal for Trends */}
      <ResponsiveModal
        open={!!substanceHistoryToShow}
        onClose={() => setSubstanceHistoryToShow(undefined)}
      >
        {substanceHistoryToShow && (
          <SubstanceTrendChart
            data={substanceHistoryToShow.data}
            rangeMin={substanceHistoryToShow.rangeMin}
            rangeMax={substanceHistoryToShow.rangeMax}
            color={substanceHistoryToShow.color}
            label={substanceHistoryToShow.label}
          />
        )}
      </ResponsiveModal>
    </Stack>
  );
};

export default Dashboard;
