import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  CardActions,
  Divider,
  MenuItem,
} from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import SilkBackground from "../../components/animations/Background";
import Sidebar from "../../components/sidebar/Sidebar";
import {
  useCreatePrize,
  useEditPrize,
  useGetAllPrizes,
  useClaimPrize,
  useDeletePrize,
} from "../../shared/hooks";
import { getMyAccounts } from "../../services/api";
import "./prizePage.css";

const getUserRole = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user).role;
  } catch (error) {
    return null;
  }
};

export const PrizePage = () => {
  const role = getUserRole();
  const isAdmin = role === "ADMIN";
  const isClient = role === "CLIENT";

  const [editingPrizeId, setEditingPrizeId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    precioPuntos: "",
    descripcion: "",
  });

  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState({});

  const handleAccountChange = (prizeId, value) => {
    setSelectedAccounts((prev) => ({
      ...prev,
      [prizeId]: value,
    }));
  };

  const {
    handleClaim,
    loading: claiming,
    response: claimResponse,
    error: claimError,
    clearMessages: clearClaim,
  } = useClaimPrize();

  const {
    createPrize,
    loading: creating,
    response: createResponse,
    error: createError,
    clearMessages: clearCreate,
  } = useCreatePrize();

  const {
    editPrize,
    loading: editing,
    response: editResponse,
    error: editError,
    clearMessages: clearEdit,
  } = useEditPrize();

  const {
    prizes,
    loading: loadingPrizes,
    error: loadError,
    refetch: refetchPrizes,
  } = useGetAllPrizes();

  const {
    deletePrize,
    loading: deleting,
    response: deleteResponse,
    error: deleteError,
    clearMessages: clearDelete,
  } = useDeletePrize();

  useEffect(() => {
    if (isClient) {
      getMyAccounts().then((res) => setAccounts(res));
    }
  }, [isClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearCreate();
    clearEdit();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPrizeId) {
      await editPrize(editingPrizeId, formData);
    } else {
      await createPrize(formData);
    }
    setFormData({ nombre: "", precioPuntos: "", descripcion: "" });
    setEditingPrizeId(null);
    await refetchPrizes();
  };

  const handleEditClick = (prize) => {
    setEditingPrizeId(prize._id);
    setFormData({
      nombre: prize.nombre,
      precioPuntos: prize.precioPuntos,
      descripcion: prize.descripcion,
    });
  };

  const handleDelete = async (prize) => {
    await deletePrize(prize._id);
    await refetchPrizes();
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
      <Container sx={{ mt: 12, mb: 8 }}>
        {isAdmin && (
          <Box
            className="prize-form-container"
            sx={{
              backgroundColor: "#e3e6e8",
              p: 4,
              borderRadius: 4,
              boxShadow: 5,
              mb: 5,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              color="white"
              fontWeight="bold"
            >
              {editingPrizeId ? "✏️ Editar Premio" : "🎁 Crear Nuevo Premio"}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    fullWidth
                    required
                    slotProps={{ style: { color: "#e87d8f" } }}
                    sx={{ input: { color: "black" }, label: { color: "#e87d7d" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Precio en Puntos"
                    name="precioPuntos"
                    type="number"
                    value={formData.precioPuntos}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{ style: { color: "white" } }}
                    sx={{ input: { color: "black" }, label: { color: "#e87d7d" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Descripción"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{ style: { color: "white" } }}
                    sx={{ input: { color: "black" }, label: { color: "#e87d7d" } }}
                  />
                </Grid>
              </Grid>

              <Box mt={3} display="flex" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="#e87d7d"
                  size="large"
                  disabled={creating || editing}
                >
                  {editingPrizeId ? "Actualizar Premio" : "Crear Premio"}
                </Button>
                {editingPrizeId && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditingPrizeId(null);
                      setFormData({
                        nombre: "",
                        precioPuntos: "",
                        descripcion: "",
                      });
                      clearCreate();
                      clearEdit();
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </Box>

              {(createResponse || editResponse) && (
                <Alert severity="success" sx={{ mt: 3 }}>
                  {createResponse || editResponse}
                </Alert>
              )}
              {(createError || editError) && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {createError || editError}
                </Alert>
              )}
            </Box>
          </Box>
        )}

        <Typography variant="h5" color="white" mb={2}>
          🎉 Premios Disponibles
        </Typography>

        {loadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loadError}
          </Alert>
        )}

        <Grid container spacing={3}>
          {loadingPrizes ? (
            <Typography color="white">Cargando premios...</Typography>
          ) : prizes.length === 0 ? (
            <Typography color="white">No hay premios disponibles.</Typography>
          ) : (
            prizes.map((prize) => {
              const selected = selectedAccounts[prize._id] || "";
              const account = accounts.find((a) => a.numeroCuenta === selected);
              const puntosSuficientes =
                account && account.puntos >= prize.precioPuntos;

              return (
                <Grid item xs={12} sm={6} md={4} key={prize._id}>
                  <Card className="prize-card"
                    sx={{
                      backgroundColor: "#e0e9eb",
                      color: "e87d7d",
                      borderRadius: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{prize.nombre}</Typography>
                      <Typography variant="body2" color="grey" gutterBottom>
                        {prize.descripcion}
                      </Typography>
                      <Divider sx={{ my: 1, borderColor: "#555" }} />
                      <Typography variant="subtitle2" color="#a5d6a7">
                        🎯 Puntos: {prize.precioPuntos}
                      </Typography>
                    </CardContent>

                    <CardActions
                      sx={{ flexDirection: "column", alignItems: "stretch" }}
                    >
                      {isClient && (
                        <>
                          <TextField
                            select
                            label="Desde Cuenta"
                            value={selected}
                            onChange={(e) =>
                              handleAccountChange(prize._id, e.target.value)
                            }
                            fullWidth
                            size="small"
                            sx={{ mb: 1 }}
                          >
                            {accounts.map((acc) => (
                              <MenuItem key={acc._id} value={acc.numeroCuenta}>
                                {acc.numeroCuenta} - Puntos: {acc.puntos}
                              </MenuItem>
                            ))}
                          </TextField>

                          {!puntosSuficientes && selected && (
                            <Typography
                              variant="body2"
                              sx={{ color: "#e87d7d", mb: 1 }}
                              color="#e87d7d"
                            >
                              ❌ No tienes suficientes puntos para reclamar este
                              premio.
                            </Typography>
                          )}

                          <p> Los canjes de premio NO SE PUEDEN REEMBOLZAR. </p>
                          <Button
                            variant="contained"
                            color="#e87d7d"
                            onClick={() => handleClaim(prize._id, selected)}
                            disabled={
                              !selected || !puntosSuficientes || claiming
                            }
                          >
                            Reclamar
                          </Button>

                          {claimResponse && (
                            <Alert
                              severity="success"
                              onClose={clearClaim}
                              sx={{ mt: 1 }}
                            >
                              🎉 {claimResponse}
                            </Alert>
                          )}
                          {claimError && (
                            <Alert
                              severity="error"
                              onClose={clearClaim}
                              sx={{ mt: 1 }}
                            >
                              ❌ {claimError}
                            </Alert>
                          )}
                        </>
                      )}

                      {isAdmin && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          <Button
                            onClick={() => handleEditClick(prize)}
                            variant="outlined"
                            sx={{ flex: 1 }}
                          >
                            Editar
                          </Button>
                          <Button
                            onClick={() => handleDelete(prize)}
                            variant="outlined"
                            color="error"
                            sx={{ flex: 1 }}
                            disabled={deleting}
                          >
                            Eliminar
                          </Button>
                        </Box>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      </Container>
    </>
  );
};

export default PrizePage;
