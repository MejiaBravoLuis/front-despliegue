// src/shared/hooks/useCreatePrize.jsx
import { useState } from "react";
import { createPrize } from "../../services";

export const useCreatePrize = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await createPrize(data);
      if (res.error) {
        setError(res.msg || "Error al crear premio");
        return { success: false };
      }
      setResponse(res.message || "Premio creado exitosamente");
      return { success: true, prize: res.prize };
    } catch (err) {
      setError("Error al crear premio");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setResponse(null);
  };

  return {
    createPrize: create,
    loading,
    response,
    error,
    clearMessages,
  };
};
