import { useState } from "react";
import { updateUserByAdmin } from "../../services";

export const useUpdateUserByAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const updateUser = async (id, updateData) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await updateUserByAdmin(id, updateData);
      if (res.error) {
        setError(res.msg);
        return { success: false };
      }
      setResponse(res.data?.msg || "Usuario actualizado correctamente");
      return { success: true };
    } catch (err) {
      setError("Error al actualizar usuario");
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
    updateUser,
    loading,
    response,
    error,
    clearMessages,
  };
};
