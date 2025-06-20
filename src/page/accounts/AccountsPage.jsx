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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  getMyAccounts,
  getPendingAccounts,
  getActiveAccounts,
  createAccount,
  deleteAccount,
  acceptAccount,
  agregarSaldoCuenta,
} from "../../services/api";
import Sidebar from "../../components/sidebar/Sidebar";
import SilkBackground from "../../components/animations/Background";

import "./accountsPage.css";

export const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [tipoCuentaSeleccionado, setTipoCuentaSeleccionado] =
    useState("AHORRO");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddBalanceDialog, setOpenAddBalanceDialog] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [balanceToAdd, setBalanceToAdd] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toUpperCase();

  const fetchAccounts = async () => {
    try {
      if (role === "ADMIN") {
        const activeRes = await getActiveAccounts();
        const pendingRes = await getPendingAccounts();
        setAccounts(Array.isArray(activeRes.data) ? activeRes.data : []);
        setPendingAccounts(
          Array.isArray(pendingRes.data) ? pendingRes.data : []
        );
      } else {
        const res = await getMyAccounts();
        setAccounts(Array.isArray(res) ? res : []);
      }
    } catch (error) {
      console.error(error);
      showAlert("Error al cargar cuentas", "error");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [role]);

  const showAlert = (message, severity = "success") => {
    setAlert({ open: true, message, severity });
  };

  const handleCreateAccount = async () => {
    try {
      const res = await createAccount(tipoCuentaSeleccionado);
      if (res.error) {
        showAlert(res.msg || "Error al solicitar cuenta.", "error");
      } else {
        showAlert("Cuenta solicitada correctamente.");
        fetchAccounts();
      }
    } catch {
      showAlert("Error al solicitar cuenta.", "error");
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await acceptAccount(id);
      if (res.error) {
        showAlert(res.msg || "Error al activar cuenta.", "error");
      } else {
        showAlert("Cuenta activada con éxito.");
        fetchAccounts();
      }
    } catch {
      showAlert("Error al activar cuenta.", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteAccount(id);
      if (res.error) {
        showAlert(res.msg || "Error al eliminar cuenta.", "error");
      } else {
        showAlert("Cuenta eliminada.");
        fetchAccounts();
      }
    } catch {
      showAlert("Error al eliminar cuenta.", "error");
    }
  };

  const handleOpenAddBalanceDialog = (accountId) => {
    setSelectedAccountId(accountId);
    setBalanceToAdd("");
    setOpenAddBalanceDialog(true);
  };

  const handleCloseAddBalanceDialog = () => {
    setOpenAddBalanceDialog(false);
    setSelectedAccountId(null);
    setBalanceToAdd("");
  };

  const handleAddBalance = async () => {
    if (!balanceToAdd || isNaN(balanceToAdd) || Number(balanceToAdd) <= 0) {
      showAlert("Ingrese un monto válido", "warning");
      return;
    }

    try {
      const res = await agregarSaldoCuenta(
        selectedAccountId,
        Number(balanceToAdd)
      );
      if (res.error) {
        showAlert(res.msg || "Error al agregar saldo.", "error");
      } else {
        showAlert("Saldo agregado con éxito.");
        fetchAccounts();
        handleCloseAddBalanceDialog();
      }
    } catch {
      showAlert("Error al agregar saldo.", "error");
    }
  };

  const filteredAccounts = accounts.filter((acc) =>
    acc.numeroCuenta.toString().includes(searchTerm)
  );

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
      <Container className="accounts-container">
        <Typography variant="h4" className="accounts-title">
          Cuentas Bancarias
        </Typography>

        <div className="controls-row">
          <TextField
            label="Buscar por número de cuenta"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <FormControl size="small">
            <InputLabel id="tipo-cuenta-label">Tipo de cuenta</InputLabel>
            <Select
              labelId="tipo-cuenta-label"
              value={tipoCuentaSeleccionado}
              label="Tipo de cuenta"
              onChange={(e) => setTipoCuentaSeleccionado(e.target.value)}
            >
              <MenuItem value="AHORRO">Ahorro</MenuItem>
              <MenuItem value="MONETARIA">Monetaria</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            className="primary-button"
            onClick={handleCreateAccount}
          >
            Solicitar nueva cuenta
          </Button>
        </div>

        <Paper className="accounts-table">
          <Typography variant="h6" sx={{ p: 2 }}>
            Cuentas {role === "ADMIN" ? "activas" : "propias"}
          </Typography>
          <Table>
            <TableHead>
              <TableRow className="table-header">
                <TableCell>Número</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Saldo</TableCell>
                <TableCell>Puntos</TableCell>
                <TableCell>Propietario</TableCell>
                {role === "ADMIN" && <TableCell>Acción</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAccounts.map((acc) => (
                <TableRow key={acc._id} className="table-row">
                  <TableCell>{acc.numeroCuenta}</TableCell>
                  <TableCell>{acc.tipoCuenta}</TableCell>
                  <TableCell>Q{acc.saldo}</TableCell>
                  <TableCell>{acc.puntos}</TableCell>
                  <TableCell>{acc.owner?.name || "N/A"}</TableCell>
                  {role === "ADMIN" && (
                    <TableCell>
                      <Button
                        variant="outlined"
                        className="primary-button"
                        onClick={() => handleOpenAddBalanceDialog(acc._id)}
                        sx={{ mr: 1 }}
                      >
                        Agregar Saldo
                      </Button>
                      <Button
                        variant="contained"
                        className="delete-button"
                        onClick={() => handleDelete(acc._id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {role === "ADMIN" && (
          <Paper>
            <Typography variant="h6" sx={{ p: 2 }}>
              Cuentas pendientes
            </Typography>
            <Table>
              <TableHead>
                <TableRow className="table-header">
                  <TableCell>Número</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Propietario</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingAccounts.map((acc) => (
                  <TableRow key={acc._id} className="table-row">
                    <TableCell>{acc.numeroCuenta}</TableCell>
                    <TableCell>{acc.tipoCuenta}</TableCell>
                    <TableCell>{acc.owner?.name || "N/A"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        className="accept-button"
                        onClick={() => handleAccept(acc._id)}
                      >
                        Aceptar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        <Dialog
          open={openAddBalanceDialog}
          onClose={handleCloseAddBalanceDialog}
        >
          <DialogTitle>Agregar saldo a la cuenta</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Monto a agregar"
              type="number"
              fullWidth
              variant="standard"
              value={balanceToAdd}
              onChange={(e) => setBalanceToAdd(e.target.value)}
              inputProps={{ min: 0, step: "0.01" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddBalanceDialog}>Cancelar</Button>
            <Button
              onClick={handleAddBalance}
              variant="contained"
              className="dialog-button"
            >
              Agregar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={alert.open}
          autoHideDuration={4000}
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={alert.severity}
            onClose={() => setAlert({ ...alert, open: false })}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};
