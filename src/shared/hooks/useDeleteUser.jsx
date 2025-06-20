import { useState } from "react";
import { deleteUserByAdmin } from "../../services";

export const useDeleteUserByAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const deleteUser = async (id) => {
      console.log("ID recibido por el hook:", id);
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await deleteUserByAdmin(id);
      if (res.error) {
        setError(res.msg);
        return { success: false };
      }
      setResponse(res.data?.msg || "Usuario eliminado correctamente");
      return { success: true };
    } catch (err) {
      setError("Error al eliminar usuario");
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
    deleteUser,
    loading,
    response,
    error,
    clearMessages,
  };
};
