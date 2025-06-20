import { useState } from "react";
import { eliminarPrize } from "../../services/api";

export const useDeletePrize = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const deletePrize = async (prizeId) => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await eliminarPrize(prizeId);
      if (res.error) {
        setError(res.msg || "Error al eliminar premio");
      } else {
        setResponse("Premio eliminado correctamente");
      }
    } catch (e) {
      setError("Error al eliminar premio");
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setResponse(null);
    setError(null);
  };

  return {
    deletePrize,
    loading,
    response,
    error,
    clearMessages,
  };
};
