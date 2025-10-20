import { createContext } from "react";

export type ReportsApiResponseObject = {
  client_id: string;
  date_testing: string;
  date_birthdate: string;
  gender: number;
  ethnicity: number;
} & SubstanceValues &
  SubstanceUnits;

export interface DataContextType {
  data: ReportsApiResponseObject[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);
