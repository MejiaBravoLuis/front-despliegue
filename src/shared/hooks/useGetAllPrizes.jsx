import { useState, useEffect } from "react";
import { getAllPrizes } from "../../services";

export const useGetAllPrizes = () => {
  const [loading, setLoading] = useState(true);
  const [prizes, setPrizes] = useState([]);
  const [error, setError] = useState(null);

  const fetchPrizes = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getAllPrizes();
      if (res.error) {
        setError(res.msg || "Error al obtener los premios");
        return;
      }

      setPrizes(res.data?.prizes || []);
    } catch (err) {
      setError("Error al obtener los premios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  return {
    prizes,
    loading,
    error,
    refetch: fetchPrizes,
  };
};
