import { useState } from "react";
import { claimPrize } from "../../services/api"; 

export const useClaimPrize = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleClaim = async (prizeId, numeroCuenta) => {
    setLoading(true);
    setResponse(null);
    setError(null);
    const result = await claimPrize(prizeId, numeroCuenta);
    if (result.error) {
      setError(result.msg);
    } else {
      setResponse(result.data?.msg || "Premio reclamado con éxito");
    }
    setLoading(false);
  };

  const clearMessages = () => {
    setResponse(null);
    setError(null);
  };

  return { handleClaim, loading, response, error, clearMessages };
};
