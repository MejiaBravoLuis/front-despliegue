import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, TextField } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import SilkBackground from "../../components/animations/Background";
import Sidebar from "../../components/sidebar/Sidebar";

export const DivisaPage = () => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [amount, setAmount] = useState(1); // Valor ingresado por el usuario

  const essentialCurrencies = ["USD", "EUR", "MXN", "COP", "CRC"];
  const API_KEY = "cur_live_afxlaxoTNGkuzKcSuU7uo9k2M3iNyW7NkGvptUvK";

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const res = await fetch(
          `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=GTQ`
        );
        const data = await res.json();

        if (!data || !data.data) throw new Error("No se encontraron tasas.");

        const rates = essentialCurrencies.map((code) => ({
          code,
          rate: data.data[code]?.value || 0,
        }));

        setExchangeRates(rates);
      } catch (err) {
        console.error("Error al cargar tasas de cambio:", err);
      }
    };

    fetchExchangeRates();
  }, []);

  return (
    <>
      <SilkBackground
        speed={6}
        scale={1}
        noiseIntensity={0}
        rotation={0}
        color={"#e87d7d"}
      />
      <Sidebar />
      <Container className="deposit-container">
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Conversor de Divisas desde Quetzales (GTQ)
        </Typography>

        <Paper sx={{ p: 2, mb: 4 }}>
          {exchangeRates.length > 0 ? (
            exchangeRates.map((curr) => (
              <Typography key={curr.code}>
                {amount} GTQ = {(amount * curr.rate).toFixed(2)} {curr.code}
              </Typography>
            ))
          ) : (
            <Typography>Cargando tasas de cambio...</Typography>
          )}
        </Paper>

        <TextField
          label="Cantidad en GTQ"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          sx={{ mb: 3 }}
        />
      </Container>
    </>
  );
};
