import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import GradeIcon from "@mui/icons-material/Grade";
import BadgeIcon from "@mui/icons-material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/img/penguin-logo.png";
import { useExchangeRate } from "../../shared/hooks/useExchangeRate";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function CustomNavbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "";

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleGoToProfile = () => {
    handleMenuClose();
    navigate("/myProfile");
  };

  const handleGoToDashboard = () => {
    handleMenuClose();
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleAcceptUser = () => {
    handleMenuClose();
    window.location.href = "/acceptUsers";
  };

  const ListUser = () => {
    handleMenuClose();
    window.location.href = "/users";
  };

  const handleGoToMovements = () => {
    handleMenuClose();
    navigate("/movements");
  };

  const handleGoToDivisa = () => {
    handleMenuClose();
    navigate('/divisa');
  };

  const handleGoToFavortios = () => {
    handleMenuClose();
    navigate('/favorito');
  };


  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleGoToDashboard}>Dashboard</MenuItem>
      <MenuItem onClick={handleGoToProfile}>Perfil</MenuItem>
      <MenuItem onClick={handleMenuClose}>Mi cuenta</MenuItem>

      {role === "ADMIN" && (
        <div>
          <MenuItem onClick={handleAcceptUser}>Aceptar usuario</MenuItem>
          <MenuItem onClick={ListUser}>Listar usuarios</MenuItem>
        </div>
      )}
      <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <CurrencyExchangeIcon />
        </IconButton>
        <p>Todos los movimientos</p>
      </MenuItem>
      <MenuItem onClick={handleGoToFavortios}>
        <IconButton size="large" color="inherit">
          <GradeIcon />
        </IconButton>
        <p>Cuentas favoritas</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <BadgeIcon />
        </IconButton>
        <p>Divisas</p>
      </MenuItem>
      {role && (role === "CLIENT" || role === "ADMIN") && (
        <MenuItem onClick={handleGoToMovements}>
          <IconButton size="large" color="inherit">
            <CurrencyExchangeIcon />
          </IconButton>
          <p>Movimientos</p>
        </MenuItem>
      )}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Perfil</p>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Cerrar sesión</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: 'black', color: 'white' }}>
          <Toolbar>
      <Box
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={handleGoToDashboard}
      >
        <img src={logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            display: { xs: 'none', sm: 'block' },
            fontFamily: '"Amarante", cursive',
            fontWeight: 400,
            letterSpacing: '0.05em',
          }}
        >
          Banco Pinguino Americano
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <IconButton size="large" color="inherit" title="Divisas" onClick={handleGoToDivisa}>
          <CurrencyExchangeIcon />
        </IconButton>
        <IconButton size="large" color="inherit" title="Cuentas favoritas" onClick={handleGoToFavortios}>
          <GradeIcon />
        </IconButton>

        <IconButton size="large" color="inherit" title="Todos los movimientos" onClick={handleGoToMovements} >
          <BadgeIcon />
        </IconButton>
        <IconButton size="large" edge="end" color="inherit" onClick={handleProfileMenuOpen}>
          <AccountCircle />
        </IconButton>
      </Box>

      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          aria-label="mostrar más"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          color="inherit"
        >
          <MoreIcon />
        </IconButton>
      </Box>
    </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
