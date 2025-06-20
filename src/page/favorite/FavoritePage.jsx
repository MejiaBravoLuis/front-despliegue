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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import SilkBackground from "../../components/animations/Background";
import {
  listarFavoritos,
  agregarAFavoritos,
  eliminarDeFavoritos,
} from "../../services/api";
import { useSnackbar } from "notistack";
import { Modal, Box, Snackbar, Alert, MenuItem } from "@mui/material";
import { getMyAccounts, createDeposit } from "../../services/api";
import Sidebar from "../../components/sidebar/Sidebar";
import "./favorite.css";

export const FavoritesPage = () => {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [alias, setAlias] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const [openDeposit, setOpenDeposit] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  useEffect(() => {
    fetchFavorites();
    getMyAccounts().then(setAccounts).catch(console.error);
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    const result = await listarFavoritos();
    if (!result.error) setFavorites(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleAgregar = async () => {
    const res = await agregarAFavoritos(numeroCuenta, alias);
    if (!res.error) {
      enqueueSnackbar("Favorito agregado", { variant: "success" });
      setOpenDialog(false);
      setNumeroCuenta("");
      setAlias("");
      fetchFavorites();
    } else {
      enqueueSnackbar(res.msg, { variant: "error" });
    }
  };

  const handleEliminar = async (id) => {
    const res = await eliminarDeFavoritos(id);
    if (!res.error) {
      enqueueSnackbar("Favorito eliminado", { variant: "success" });
      fetchFavorites();
    } else {
      enqueueSnackbar(res.msg, { variant: "error" });
    }
  };

  const handleOpenDeposit = (numeroCuentaDestino) => {
    setToAccount(numeroCuentaDestino);
    setOpenDeposit(true);
  };

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
      setOpenDeposit(false);
      setFromAccount("");
      setToAccount("");
      setAmount("");
      setDescription("");
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error.message ||
        "Error al hacer el depósito.";
      setAlertMessage(backendMessage);
      setAlertSeverity("error");
      setAlertOpen(true);
      setOpenDeposit(false);
    }
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
      <Container
        sx={{
          mt: 10,
          p: 4,
          background: "#ffffffcc",
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Mis Favoritos</Typography>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            className="add-favorite-button"
          >
            Agregar Favorito
          </Button>
        </Stack>

        {loading ? (
          <CircularProgress />
        ) : (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número de Cuenta</TableCell>
                  <TableCell>Alias</TableCell>
                  <TableCell>Tipo de Cuenta</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {favorites.map((f) => (
                  <TableRow key={f._id}>
                    <TableCell>{f.cuenta?.numeroCuenta}</TableCell>
                    <TableCell>{f.alias}</TableCell>
                    <TableCell>{f.cuenta?.tipoCuenta}</TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        className="table-buttons"
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            handleOpenDeposit(f.cuenta?.numeroCuenta)
                          }
                        >
                          Depositar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleEliminar(f._id)}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Agregar a Favoritos</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Número de Cuenta"
            fullWidth
            value={numeroCuenta}
            onChange={(e) => setNumeroCuenta(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Alias"
            fullWidth
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleAgregar} variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={openDeposit} onClose={() => setOpenDeposit(false)}>
        <Box
          className="deposit-modal"
          sx={{
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            maxWidth: 400,
            mx: "auto",
            mt: 10,
          }}
        >
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
            disabled
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
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
