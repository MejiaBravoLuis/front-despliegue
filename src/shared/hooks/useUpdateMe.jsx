import { useState } from "react";
import { updateProfile } from "../../services";

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const submitProfileUpdate = async (profileData) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await updateProfile(profileData);
      setResponse(res.data?.msg || "Perfil actualizado correctamente");
    } catch (err) {
      setError(err.response?.data?.msg || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setResponse(null);
  };

  return {
    submitProfileUpdate,
    loading,
    response,
    error,
    clearMessages,
  };
};
