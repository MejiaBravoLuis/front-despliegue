import { useEffect, useState } from 'react';
import axios from 'axios';

export const useExchangeRate = (from = "USD", to = "GTQ") => {
  const [rate, setRate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`https://open.er-api.com/v6/latest/${from}`)
      .then((res) => {
        if (res.data && res.data.rates && res.data.rates[to]) {
          setRate(res.data.rates[to]);
        } else {
          setError("Tipo de cambio no disponible");
        }
      })
      .catch(() => {
        setError("No se pudo obtener el tipo de cambio");
      });
  }, [from, to]);

  return { rate, error };
};
