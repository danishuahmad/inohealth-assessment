import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { DataContext, type DataContextType } from "./context";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<DataContextType["data"]>(null);
  const [isLoading, setLoading] = useState<DataContextType["isLoading"]>(true);
  const [error, setError] = useState<DataContextType["error"]>(null);

  const didFetch = useRef(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/data");
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!didFetch.current) {
      didFetch.current = true;
      fetchData();
    }
  }, []);

  return (
    <DataContext.Provider
      value={{ data, isLoading, error, refetch: fetchData }}
    >
      {children}
    </DataContext.Provider>
  );
};
