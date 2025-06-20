import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Tooltip,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import GradeIcon from "@mui/icons-material/Grade";
import BadgeIcon from "@mui/icons-material/Badge";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";

import { useNavigate } from "react-router-dom";

import logo from "../../assets/img/penguin-logo.png";

const drawerWidth = 64; // ancho compacto

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "";

  const menuItems = [
    { text: "Inicio", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Perfil", icon: <AccountCircle />, path: "/myProfile" },
    { text: "Movimientos", icon: <CurrencyExchangeIcon />, path: "/movements" },
    { text: "Favoritos", icon: <GradeIcon />, path: "/favorito" },
    { text: "Divisas", icon: <BadgeIcon />, path: "/divisa" },
  ];

  const adminItems = [
    {
      text: "Aceptar Usuarios",
      icon: <AdminPanelSettingsIcon />,
      path: "/acceptUsers",
    },
    { text: "Listar Usuarios", icon: <GroupIcon />, path: "/users" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          backgroundColor: "var(--color-1)",
          color: "var(--color-5)",
          overflowX: "hidden",
          transition: "width 0.3s ease",
          "&:hover": {
            width: 200,
            backgroundColor: "var(--color-2)",
            color: "var(--color-4)",
          },
        },
      }}
    >
      <Toolbar sx={{ justifyContent: "center", py: 2 }}>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: 60,
            height: 60,
            transition: "transform 0.3s",
            "&:hover": {
              transform: "rotate(10deg) scale(1.1)",
            },
          }}
        />
      </Toolbar>

      <List
        sx={{ mt: 1, height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Menú normal */}
        <Box>
          {menuItems.map(({ text, icon, path }) => (
            <Tooltip title={text} placement="right" key={text}>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => navigate(path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: "center",
                    px: 2.5,
                    transition: "all 0.3s ease",
                    color: "inherit",
                    "&:hover": {
                      backgroundColor: "var(--color-6)",
                      transform: "scale(1.05)",
                      color: "white",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: 0,
                      justifyContent: "center",
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={{
                      opacity: 0,
                      whiteSpace: "nowrap",
                      ml: 2,
                      transition: "opacity 0.3s ease",
                      ".MuiDrawer-paper:hover &": {
                        opacity: 1,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}

          {role === "ADMIN" &&
            adminItems.map(({ text, icon, path }) => (
              <Tooltip title={text} placement="right" key={text}>
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    onClick={() => navigate(path)}
                    sx={{
                      minHeight: 48,
                      justifyContent: "center",
                      px: 2.5,
                      transition: "all 0.3s ease",
                      color: "inherit",
                      "&:hover": {
                        backgroundColor: "var(--color-6)",
                        transform: "scale(1.05)",
                        color: "white",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                        minWidth: 0,
                        justifyContent: "center",
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{
                        opacity: 0,
                        ml: 2,
                        transition: "opacity 0.3s ease",
                        ".MuiDrawer-paper:hover &": {
                          opacity: 1,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
        </Box>

        {/* Cerrar sesión al fondo */}
        <Box sx={{ mt: "auto" }}>
          <Tooltip title="Cerrar sesión" placement="right">
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  px: 2.5,
                  transition: "all 0.3s ease",
                  color: "inherit",
                  "&:hover": {
                    backgroundColor: "var(--color-6)",
                    transform: "scale(1.05)",
                    color: "white",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: 0,
                    justifyContent: "center",
                  }}
                >
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Cerrar sesión"
                  sx={{
                    opacity: 0,
                    ml: 2,
                    transition: "opacity 0.3s ease",
                    ".MuiDrawer-paper:hover &": {
                      opacity: 1,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </Box>
      </List>
    </Drawer>
  );
}
