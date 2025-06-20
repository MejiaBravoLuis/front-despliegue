import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import SplitText from "../../components/common/SplitText";
import SilkBackground from "../../components/animations/Background";
import Sidebar from "../../components/sidebar/Sidebar";
import FlowingMenu from "../../components/menu/FlowingMenu";
import account from "../../assets/icons/account.png";
import deposit from "../../assets/icons/deposit.png";
import movimientos from "../../assets/icons/movimientos.png";
import prize from "../../assets/icons/prize.png";
import reward from "../../assets/icons/reward.png";
import "./DashboardPage.css";

export const DashboardPage = () => {
  const [username, setUsername] = useState("guest");

  const menuItems = [
  {
    link: "/accounts",
    text: "Tus cuentas",
    image: account,
  },
  {
    link: "/movements",
    text: "Movimientos",
    image: movimientos,
  },
  {
    link: "/deposit",
    text: "Hacer un depósito",
    image: deposit,
  },
  {
    link: "/prize",
    text: "Ver premios",
    image: prize,
  },
  {
    link: "/reward",
    text: "Premios canjeados",
    image: reward,
  },
];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsername(parsedUser.username || "bienvenido");
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
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

      {/* Mensaje de bienvenida */}
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          ml: { sm: "64px" },
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <SplitText
          key={username}
          text={`Hola ${username}, bienvenido a Banco Pingüino Americano. ¿Qué quieres hacer hoy?`}
          className="welcome-text"
          splitType="words"
          delay={200}
          duration={0.4}
          from={{ opacity: 0, y: 30 }}
          to={{ opacity: 1, y: 0 }}
          ease="power2.out"
          rootMargin="-50px"
        />
      </Container>

      {/* Menú de navegación en pantalla completa */}
      <Box
        sx={{
          width: "100%",
          mt: 6,
          ml: { sm: "64px" },
          px: 4,
          position: "relative",
          zIndex: 2,
        }}
      >
        <FlowingMenu items={menuItems} />
      </Box>
    </>
  );
};
