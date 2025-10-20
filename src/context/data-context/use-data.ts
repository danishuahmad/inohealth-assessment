import { useContext } from "react";
import { DataContext } from "./context";

export const useDataContext = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useDataContext must be used inside a DataProvider");
  }
  return ctx;
};