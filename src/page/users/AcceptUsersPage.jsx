import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import SilkBackground from "../../components/animations/Background";
import { usePendingUsers } from "../../shared/hooks/usePendingUsers";
import Sidebar from "../../components/sidebar/Sidebar";
import SpotLigthCard from "../../components/cards/SpotligthCard";
import iconUser from "../../assets/icons/4.png";
import iconPending from "../../assets/icons/12.png";
import { Snackbar, Alert } from "@mui/material";
import "./AcceptUsersPage.css";

export const AcceptUsersPage = () => {
  const { users, loading, error, acceptPendingUser } = usePendingUsers();
  const [pending, setPending] = useState([]);

  useEffect(() => {
    if (!loading && !error && users) {
      setPending(users);
    }
  }, [users, loading, error]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });

  const handleAcceptClick = async (userId, userName) => {
    if (!userId) {
      setSnackbar({
        open: true,
        message: "ID de usuario no válido",
        severity: "error",
      });
      return;
    }

    const result = await acceptPendingUser(userId);
    if (result.success) {
      setSnackbar({
        open: true,
        message: `Usuario ${userName} aceptado correctamente`,
        severity: "success",
      });
      setPending((prev) =>
        prev.filter((user) => user._id !== userId && user.uid !== userId)
      );
    } else {
      setSnackbar({
        open: true,
        message: "Error al aceptar usuario",
        severity: "error",
      });
    }
  };

  if (loading) return <p>Cargando usuarios pendientes...</p>;
  if (error) return <p>Error al cargar usuarios.</p>;

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
      <Grid
        container
        spacing={3}
        justifyContent="center"
        className="users-grid"
      >
        {pending.map((user) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
            <SpotLigthCard icon={iconUser} className="custom-spotlight-card">
              <div className="user-card-content">
                <img src={iconUser} alt="Icono usuario" className="user-icon" />
                <div className="user-info">
                  <span className="user-name">
                    {user.name} {user.lastName}
                  </span>
                  <div className="user-status">
                    <img
                      src={iconPending}
                      alt="Icono candado"
                      className="status-icon"
                    />
                    <span>Estado: En espera</span>
                  </div>
                  <button
                    className="add-user-button"
                    onClick={() => handleAcceptClick(user.uid, user.name)}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </SpotLigthCard>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AcceptUsersPage;
