import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  Divider
} from "@mui/material";
import SilkBackground from "../../components/animations/Background";
import { useProfileDetails, useUpdateProfile } from "../../shared/hooks";
import Sidebar from "../../components/sidebar/Sidebar";
import SpotLigthCard from "../../components/cards/SpotligthCard";
import iconUser from "../../assets/icons/4.png";
import SplitText from "../../components/common/SplitText";
import "./userProfilePage.css";

export const ProfilePage = () => {
  const { user, loading } = useProfileDetails();
  const {
    submitProfileUpdate,
    loading: updating,
    response,
    error,
    clearMessages,
  } = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: "",
    direccion: "",
    nombreTrabajo: "",
    montoMensual: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        direccion: user.direccion || "",
        nombreTrabajo: user.nombreTrabajo || "",
        montoMensual: user.montoMensual || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitProfileUpdate(formData);
    window.location.reload();
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    clearMessages();
  };

  if (loading) return <p>Cargando perfil...</p>;

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
      <Container className="profile-container">
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={5}
          textAlign="center"
          color="#e3e6e8"
        >
          Mi Perfil
        </Typography>

        <Box className="profile-grid">
          {/* Tarjeta del usuario */}
          <Box className="profile-panel">
            <SpotLigthCard icon={iconUser} className="custom-spotlight-card">
              <img
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                alt="avatar"
                className="user-icon"
              />
              <Typography className="user-name">{user.name}</Typography>
              <Typography className="user-email">{user.email}</Typography>
              <Typography className="user-username">
                @{user.username}
              </Typography>
              <Typography variant="body2" color="white">
                Rol: {user.role}
              </Typography>
              <Button
                variant="contained"
                color="#e3e6e8"
                sx={{ mt: 2, px: 4 }}
                onClick={handleEditToggle}
              >
                {isEditing ? "Cerrar Edición" : "Editar Perfil"}
              </Button>
            </SpotLigthCard>
          </Box>

          {/* Información o formulario */}
          <Box className="profile-panel">
            {!isEditing ? (
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                height="100%"
                justifyContent="center"
              >
                <Divider textAlign="left" sx={{ mb: 2, color: "#e3e6e8" }}>
                  Información Personal
                </Divider>
                {[
                  { label: "Dirección", value: user.direccion },
                  { label: "Trabajo", value: user.nombreTrabajo },
                  { label: "Monto mensual", value: user.montoMensual },
                ].map((field) => (
                  <Typography
                    key={field.label}
                    sx={{ color: "white", fontSize: "1.1rem" }}
                  >
                    <strong>{field.label}:</strong> {field.value || "-"}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Box
                component="form"
                onSubmit={handleSubmit}
                className="profile-form"
              >
                <Divider textAlign="left" sx={{ mb: 2, color: "#e3e6e8" }}>
                  Editar Información
                </Divider>
                {[
                  { label: "Nombre completo", name: "name" },
                  { label: "Dirección", name: "direccion" },
                  { label: "Trabajo", name: "nombreTrabajo" },
                  {
                    label: "Monto mensual",
                    name: "montoMensual",
                    type: "number",
                  },
                ].map((field) => (
                  <TextField
                    key={field.name}
                    fullWidth
                    label={field.label}
                    name={field.name}
                    type={field.type || "text"}
                    value={formData[field.name]}
                    onChange={handleChange}
                    InputProps={{ style: { color: "white" } }}
                    sx={{ input: { color: "white" }, label: { color: "#ccc" } }}
                  />
                ))}

                {error && <Alert severity="error">{error}</Alert>}
                {response && <Alert severity="success">{response}</Alert>}

                <Box display="flex" gap={2} mt={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="#e3e6e8"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || "",
                        direccion: user.direccion || "",
                        nombreTrabajo: user.nombreTrabajo || "",
                        montoMensual: user.montoMensual || "",
                      });
                      clearMessages();
                    }}
                    className="button-cancelar"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    color="#e0e9eb"
                    disabled={updating}
                    className="button-guardar"
                  >
                    {updating ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ProfilePage;
