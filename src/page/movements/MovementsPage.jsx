import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import SilkBackground from "../../components/animations/Background";
import Sidebar from "../../components/sidebar/Sidebar";
import {
  getMyMovements,
  getAllActiveMovements,
  getAllCanceledMovements,
  cancelMovement,
} from "../../services/api";
import "./movementsPageStyles.css";

export const MovementsPage = () => {
  const [movements, setMovements] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toUpperCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let movimientos = [];
        if (role === "ADMIN") {
          const activos = await getAllActiveMovements();
          const cancelados = await getAllCanceledMovements();
          movimientos = [...activos, ...cancelados];
        } else {
          movimientos = await getMyMovements();
        }
        setMovements(movimientos);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchData();
  }, [role]);

  const handleCancel = async (id) => {
    try {
      const res = await cancelMovement(id);
      setAlertMessage(res.message || "Movimiento cancelado.");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message || "No se pudo cancelar el movimiento.";
      setAlertMessage(msg);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const puedeCancelar = (mov) => {
    const ahora = new Date();
    const creado = new Date(mov.createdAt);
    const diferenciaMin = (ahora - creado) / (1000 * 60);

    if (diferenciaMin > 3) {
      return false;
    }

    return true;
  };

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
      <Container className="movements-container">
        <Typography variant="h4" gutterBottom>
          Movimientos
        </Typography>

        <Paper sx={{ width: "100%", overflow: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>De</TableCell>
                <TableCell>A</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movements.map((mov) => {
                console.log("Movimiento:", mov);
                const puedeCancelarMovimiento = puedeCancelar(mov);
                const tiempoCaducado = !puedeCancelar(mov); // Determina si el tiempo ya ha caducado

                return (
                  <TableRow key={mov._id}>
                    <TableCell>{mov.fromAccount}</TableCell>
                    <TableCell>{mov.toAccount}</TableCell>
                    <TableCell>Q{mov.amount}</TableCell>
                    <TableCell>{mov.description}</TableCell>
                    <TableCell
                      className={
                        mov.active ? "estado-activo" : "estado-cancelado"
                      }
                    >
                      {mov.active ? "Activo" : "Cancelado"}
                    </TableCell>
                    <TableCell>
                      {new Date(mov.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {tiempoCaducado ? (
                        <Snackbar
                          open={true}
                          autoHideDuration={4000}
                          onClose={() => {}}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                        >
                          <Alert severity="warning">
                            El tiempo para cancelar este movimiento ha caducado.
                          </Alert>
                        </Snackbar>
                      ) : (
                        <Button
                          className="cancel-button"
                          onClick={() => handleCancel(mov._id)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>

        <Snackbar
          open={alertOpen}
          autoHideDuration={4000}
          onClose={() => setAlertOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setAlertOpen(false)}
            severity={alertSeverity}
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};
