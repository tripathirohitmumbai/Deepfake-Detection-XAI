import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "../../assets/photos/logo.png";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import List from "@mui/material/List";
import HistoryIcon from "@mui/icons-material/History";
import DashboardIcon from "@mui/icons-material/Dashboard";

const pages = ["Home", "Detects", "Events"];
const settings = ["Login", "Logout"];

function Header({ open, toggleSidebar }) {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setIsMenuOpen(false);
  };

  const handlelogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <div className="navbar-background">
      <AppBar
        position="absolute"
        sx={{ top: 15, bottom: 0, paddingleft: "50px" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{ flexGrow: 1, mb: 3, display: { xs: "flex", md: "none" } }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                  >
                    <List component="nav" aria-label="main mailbox folders">
                      <ListItemButton
                        selected={selectedIndex === 0}
                        onClick={(event) => handleListItemClick(event, 0)}
                      >
                        <ListItemIcon>
                          <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                      </ListItemButton>
                      <ListItemButton
                        selected={selectedIndex === 1}
                        onClick={(event) => handleListItemClick(event, 1)}
                      >
                        <ListItemIcon>
                          <HistoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="History" />
                      </ListItemButton>
                      <Button color="inherit">
                        <LogoutIcon sx={{ marginLeft: "10px" }} />
                        <Typography
                          textAlign="center"
                          sx={{ textTransform: "none", marginLeft: "15px" }}
                          onClick={handlelogout}
                        >
                          Logout
                        </Typography>
                      </Button>
                    </List>
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
            <AdbIcon sx={{ display: "none" }} />
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                paddingLeft: open ? "0px" : "60px",
                alignItems: "center",
              }}
            >
              {open ? (
                ""
              ) : (
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="#app-bar-with-responsive-menu"
                  sx={{
                    mr: 2,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  <img src={Logo} alt="logo" height={40} width={110} />
                </Typography>
              )}
              <Link
                to="/home"
                style={{ textDecoration: "none", color: "black" }}
              >
                <Typography textAlign="center" sx={{ textTransform: "none" }}>
                  Home
                </Typography>
              </Link>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <Link
                to="/history"
                style={{ textDecoration: "none", color: "black" }}
              >
                <Typography textAlign="center" sx={{ textTransform: "none" }}>
                  History
                </Typography>
              </Link>
            </Box>
            <Box sx={{ flexGrow: 0 }} className="logbtn">
              <IconButton size="large" aria-label="search" color="black">
                <SearchIcon />
              </IconButton>
              <Button color="inherit">
                <Typography
                  textAlign="center"
                  sx={{ textTransform: "none", color: "black" }}
                  onClick={handlelogout}
                >
                  Logout
                </Typography>
                &nbsp;&nbsp;&nbsp;
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default Header;
