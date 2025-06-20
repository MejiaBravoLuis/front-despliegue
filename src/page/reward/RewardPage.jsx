import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import { getRedemptions } from "../../services/api";
import SilkBackground from "../../components/animations/Background";
import Sidebar from "../../components/sidebar/Sidebar";
import "./rewardPageStyles.css";

export const RewardPage = () => {
  const [loading, setLoading] = useState(true);
  const [redemptions, setRedemptions] = useState([]);

  useEffect(() => {
    const fetchRedemptions = async () => {
      try {
        const data = await getRedemptions();
        setRedemptions(data.redemptions || []);
      } catch (err) {
        console.error("Error al cargar los canjes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRedemptions();
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
      <Container
        className="reward-container"
        sx={{
          mt: 10,
          p: 4,
          background: "#ffffffcc",
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Mis Canjes de Recompensas
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Paper sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Recompensa</TableCell>
                  <TableCell>Puntos Usados</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Usuario</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {redemptions.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell>{r.prize?.nombre}</TableCell>
                    <TableCell>{r.pointsUsed}</TableCell>
                    <TableCell>{r.prize?.descripcion}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>
                      {new Date(r.redeemedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {r.user?.name || "-"} ({r.user?.email || "N/A"})
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Container>
    </>
  );
};
