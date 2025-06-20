import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Button,
  Box,
  Alert,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Typography,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import SilkBackground from "../../components/animations/Background";
import { getAllUsers } from "../../services/api";
import { useDeleteUserByAdmin, useUpdateUserByAdmin } from "../../shared/hooks";
import Sidebar from "../../components/sidebar/Sidebar";
import SpotLigthCard from "../../components/cards/SpotligthCard";
import iconUser from "../../assets/icons/4.png";
import "./UsersPage.css";

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [deletedUserId, setDeletedUserId] = useState(null);

  const {
    deleteUser,
    loading: deleting,
    response,
    error,
    clearMessages,
  } = useDeleteUserByAdmin();

  const {
    updateUser,
    loading: updating,
    response: updateResponse,
    error: updateError,
    clearMessages: clearUpdateMessages,
  } = useUpdateUserByAdmin();

  const fetchUsers = async () => {
    const res = await getAllUsers();
    if (!res.error) {
      setUsers(res.data.users || []);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (!confirmed) return;

    const deleteResponse = await deleteUser(id);
    if (deleteResponse?.success) {
      setDeletedUserId(id);
    }

    setTimeout(() => {
      clearMessages();
      setDeletedUserId(null);
      fetchUsers();
    }, 1000);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditedData({
      name: user.name,
      email: user.email,
      telefono: user.telefono || "",
      montoMensual: user.montoMensual || "",
      nombreTrabajo: user.nombreTrabajo || "",
      direccion: user.direccion || "",
      role: user.role,
    });
  };

  const handleEditChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    const result = await updateUser(selectedUser.uid, editedData);
    if (result.success) {
      fetchUsers();
      setSelectedUser(null);
      clearUpdateMessages();
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
      <Container sx={{ mt: 12, minHeight: "calc(100vh - 64px)", pb: 8 }}>
        {response && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {response} {deletedUserId && `(ID: ${deletedUserId})`}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {updateError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {updateError}
          </Alert>
        )}

        <Typography variant="h4" fontWeight="bold" mb={5} textAlign="center" color="#e3e6e8">
          Gestión de Usuarios
        </Typography>

        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={user.uid}>
              <SpotLigthCard icon={iconUser} className="custom-spotlight-card">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={1}
                >
                  <img
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                    alt={`${user.name} avatar`}
                    className="user-icon"
                  />
                  <Typography className="user-name">{user.name}</Typography>
                  <Typography className="user-email">{user.email}</Typography>
                  <Typography className="user-username">
                    @{user.username}
                  </Typography>

                  {user.role !== "ADMIN" && (
                    <Box mt={2} width="100%">
                      <button
                        className="button-full-width"
                        onClick={() => handleDelete(user.uid)}
                        disabled={deleting}
                      >
                        {deleting ? "Eliminando..." : "Eliminar"}
                      </button>
                      <button
                        className="button-full-width"
                        style={{
                          marginTop: "8px",
                          backgroundColor: "var(--color-4)",
                        }}
                        onClick={() => openEditModal(user)}
                      >
                        Editar
                      </button>
                    </Box>
                  )}
                </Box>
              </SpotLigthCard>
            </Grid>
          ))}
        </Grid>

        <Modal
          open={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={Boolean(selectedUser)}>
            <Paper
              elevation={10}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: 500 },
                p: 4,
                borderRadius: 4,
              }}
            >
              <Typography
                variant="h6"
                mb={2}
                fontWeight="bold"
                color="var(--color-5)"
              >
                Editar Usuario
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {[
                { label: "Nombre", name: "name" },
                { label: "Teléfono", name: "telefono" },
                { label: "Monto Mensual", name: "montoMensual" },
                { label: "Nombre del Trabajo", name: "nombreTrabajo" },
                { label: "Dirección", name: "direccion" },
                { label: "Rol", name: "role" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  fullWidth
                  margin="dense"
                  label={field.label}
                  name={field.name}
                  value={editedData[field.name] || ""}
                  onChange={handleEditChange}
                />
              ))}

              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <button
                  className="button-full-width"
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--color-5)",
                    border: "2px solid var(--color-5)",
                    maxWidth: "120px",
                  }}
                  onClick={() => setSelectedUser(null)}
                >
                  Cancelar
                </button>
                <button
                  className="button-full-width"
                  style={{
                    backgroundColor: "var(--color-5)",
                    color: "white",
                    maxWidth: "120px",
                  }}
                  onClick={handleEditSubmit}
                  disabled={updating}
                >
                  {updating ? "Guardando..." : "Guardar"}
                </button>
              </Box>
            </Paper>
          </Fade>
        </Modal>
      </Container>
    </>
  );
};

export default UsersPage;
