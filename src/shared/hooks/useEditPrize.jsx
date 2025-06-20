import { useState } from "react";
import { editPrize } from "../../services";

export const useEditPrize = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const edit = async (prizeId, data) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await editPrize(prizeId, data);
      if (res.error) {
        setError(res.msg || "Error al editar premio");
        return { success: false };
      }
      setResponse(res.message || "Premio actualizado correctamente");
      return { success: true, prize: res.prize };
    } catch (err) {
      setError("Error al editar premio");
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
    editPrize: edit,
    loading,
    response,
    error,
    clearMessages,
  };
};
