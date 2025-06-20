import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
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
  getMyAccounts,
  getMyMovements,
  getAllActiveMovements,
  getAllCanceledMovements,
  createDeposit,
  cancelMovement,
} from "../../services/api";
import "./depositPageStyles.css";

export const DepositPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toUpperCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const acc = await getMyAccounts();
        setAccounts(acc);

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  const handleDeposit = async () => {
    try {
      const res = await createDeposit(
        fromAccount,
        toAccount,
        amount,
        description
      );
      setAlertMessage(res.message || "Depósito realizado");
      setAlertSeverity("success");
      setAlertOpen(true);
      setOpen(false);
      setFromAccount("");
      setToAccount("");
      setAmount("");
      setDescription("");
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Detalle del error:", error);
      const backendMessage =
        error?.response?.data?.message ||
        error.message ||
        "Error al hacer el depósito.";
      setAlertMessage(backendMessage);
      setAlertSeverity("error");
      setAlertOpen(true);
      setOpen(false);
    }
  };

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
    if (!mov.active) return false;
    const ahora = new Date();
    const creado = new Date(mov.createdAt);
    const diferenciaMin = (ahora - creado) / (1000 * 60);
    return diferenciaMin <= 3 && mov.createdBy === user._id;
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
      <Container className="deposit-container">
        <Typography variant="h4" gutterBottom>
          Mis Cuentas
        </Typography>
        {Array.isArray(accounts) &&
          accounts.map((acc) => (
            <Typography key={acc._id} className="account-info">
              Cuenta: {acc.numeroCuenta} | Saldo: Q{acc.saldo}
            </Typography>
          ))}

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setOpen(true)}
        >
          Hacer Depósito
        </Button>

        <Typography variant="h5" sx={{ mt: 4 }}>
          Últimos 5 Movimientos
        </Typography>
        <Paper sx={{ width: "100%", overflow: "auto", mt: 1 }}>
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
              {[...movements]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((mov) => (
                  <TableRow key={mov._id}>
                    <TableCell>{mov.fromAccount}</TableCell>
                    <TableCell>{mov.toAccount}</TableCell>
                    <TableCell>Q{mov.amount}</TableCell>
                    <TableCell>{mov.description}</TableCell>
                    <TableCell sx={{ color: mov.active ? "green" : "red" }}>
                      {mov.active ? "Activo" : "Cancelado"}
                    </TableCell>
                    <TableCell>
                      {new Date(mov.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {puedeCancelar(mov) && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleCancel(mov._id)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>

        <Modal open={open} onClose={() => setOpen(false)}>
          <Box className="deposit-modal">
            <Typography variant="h6" mb={2}>
              Realizar Depósito
            </Typography>

            <TextField
              select
              fullWidth
              label="Desde Cuenta"
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              sx={{ mb: 2 }}
            >
              {accounts.map((acc) => (
                <MenuItem key={acc._id} value={acc.numeroCuenta}>
                  {acc.numeroCuenta} - Q{acc.saldo}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="A Cuenta"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Monto"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button variant="contained" fullWidth onClick={handleDeposit}>
              Depositar
            </Button>
          </Box>
        </Modal>

        <Snackbar
          open={alertOpen}
          autoHideDuration={4000}
          onClose={() => setAlertOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ zIndex: 99999, position: "fixed" }}
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
