import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { DataContext, type DataContextType } from "./context";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DataContextType["data"]>(null);
  const [loading, setLoading] = useState<DataContextType["loading"]>(true);
  const [error, setError] = useState<DataContextType["error"]>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};
