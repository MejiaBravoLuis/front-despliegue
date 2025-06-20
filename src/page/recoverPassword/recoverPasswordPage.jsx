import { useState, useEffect } from "react";
import { useForgotPassword, useResetPassword } from "../../shared/hooks";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";
import SilkBackground from "../../components/animations/Background";
import Sidebar from "../../components/sidebar/Sidebar";
import "./styleRecoverPassword.css";

export const PasswordRecoveryPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const {
    requestReset,
    loading: loadingReset,
    response: responseReset,
    error: errorReset,
    clearMessages: clearResetMessages,
  } = useForgotPassword();

  const {
    submitNewPassword,
    loading: loadingChange,
    response: responseChange,
    error: errorChange,
    clearMessages: clearChangeMessages,
  } = useResetPassword();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    clearResetMessages();
    const res = await requestReset(email);
    if (!res?.error) {
      setStep(2);
    }
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    clearChangeMessages();
    if (token.trim().length === 64) {
      setStep(3);
    } else {
      alert("Token inválido");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    clearChangeMessages();
    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    await submitNewPassword(token, password);
  };

  useEffect(() => {
    if (responseChange) {
      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    }
  }, [responseChange, navigate]);

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
        maxWidth="sm"
        sx={{
          mt: 15,
          minHeight: "calc(100vh - 64px - 64px)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: "#1e1e1e",
            color: "white",
            width: "100%",
          }}
        >
          <Box
            component="form"
            onSubmit={
              step === 1
                ? handleEmailSubmit
                : step === 2
                ? handleTokenSubmit
                : handlePasswordSubmit
            }
          >
            <Typography variant="h5" gutterBottom>
              {step === 1 && "¿Olvidaste tu contraseña?"}
              {step === 2 && "Ingresa el token de recuperación"}
              {step === 3 && "Restablecer contraseña"}
            </Typography>

            {step === 1 && (
              <TextField
                fullWidth
                type="email"
                label="Tu correo registrado"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={clearResetMessages}
                required
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "#ccc" } }}
              />
            )}

            {step === 2 && (
              <TextField
                fullWidth
                label="Token de recuperación"
                variant="outlined"
                margin="normal"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "#ccc" } }}
              />
            )}

            {step === 3 && (
              <TextField
                fullWidth
                type="password"
                label="Nueva contraseña"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={clearChangeMessages}
                required
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "#ccc" } }}
              />
            )}

            {/* Botones */}
            {step === 1 && (
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loadingReset}
                  sx={{ flex: 1 }}
                >
                  {loadingReset ? "Enviando..." : "Enviar enlace"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/auth")}
                >
                  Cancelar
                </Button>
              </Box>
            )}

            {step > 1 && (
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loadingReset || loadingChange}
                  sx={{ flex: 1 }}
                >
                  {step === 2 && "Validar token"}
                  {step === 3 &&
                    (loadingChange ? "Cambiando..." : "Cambiar contraseña")}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={() => setStep(step - 1)}
                >
                  Volver
                </Button>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              {responseReset && (
                <Typography className="success">{responseReset}</Typography>
              )}
              {errorReset && (
                <Typography className="error">{errorReset}</Typography>
              )}
              {responseChange && (
                <Typography className="success">{responseChange}</Typography>
              )}
              {errorChange && (
                <Typography className="error">{errorChange}</Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};
