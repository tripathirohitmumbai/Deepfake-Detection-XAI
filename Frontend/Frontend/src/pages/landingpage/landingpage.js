import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import LoginIcon from "@mui/icons-material/Login";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../assets/photos/bgimage.png";
import "./landingpage.css";
import { Button, Grid, List } from "@mui/material";
import Logo from "../../assets/photos/logo.png";

const pages = ["Home", "Detects", "Events"];
const settings = ["Login", "Logout"];

function Landingpage() {
  const homeStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "120vh",
    width: "100%",
  };

  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <>
      <div style={homeStyle}>
        <div className="navbar-backgrounds">
          <AppBar position="absolute" sx={{ top: 15, bottom: 0 }}>
            <Container maxWidth="xl">
              <Toolbar disableGutters>
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
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  <img src={Logo} alt="logo" height={40} width={110} />
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
                        <Link
                          to="/"
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "flex",
                            alignItems: "center",
                            marginRight: "16px",
                          }}
                        >
                          <HomeIcon />
                          <Typography
                            textAlign="center"
                            sx={{ textTransform: "none", ml: 1 }}
                          >
                            Home
                          </Typography>
                        </Link>
                        <Link
                          to="/login"
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "flex",
                            alignItems: "center",
                            marginRight: "16px",
                          }}
                        >
                          <LoginIcon />
                          <Typography
                            textAlign="center"
                            sx={{ textTransform: "none", ml: 1 }}
                          >
                            Login
                          </Typography>
                        </Link>
                        <Link
                          to="/signup"
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <PersonAddAltIcon />
                          <Typography
                            textAlign="center"
                            sx={{ textTransform: "none", ml: 1 }}
                          >
                            Register
                          </Typography>
                        </Link>
                      </Box>
                    </MenuItem>
                  </Menu>
                </Box>
                <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  sx={{
                    mr: 2,
                    display: { xs: "flex", md: "none" },
                    flexGrow: 1,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "inherit",
                    textDecoration: "none",
                    width: "100%",
                  }}
                >
                  LOGO
                </Typography>
                <Grid>
                  <Grid>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "#fff",
                        fontFamily: "monospace",
                        fontSize: "35px",
                        position: "absolute",
                        top: "250px",
                        left: "20px",
                      }}
                    >
                      <span style={{ color: "#16f1f5" }}>DEEP</span> FAKE
                    </Typography>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "#fff",
                        fontSize: "15px",
                        position: "absolute",
                        top: "300px",
                        left: "20px",
                        width: 500,
                      }}
                    >
                      DeepFake Technology is incredibly advanced and can easily
                      confuse humans between a real and a fake video. It has
                      great potential in entertainment, gaming, and various
                      other fields if used responsibly. Our application provides
                      you a platform where you can detect your own DeepFake
                      video by uploading the real or fake video.
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                  <Link
                    to="/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography
                      textAlign="center"
                      sx={{ textTransform: "none" }}
                    >
                      Home
                    </Typography>
                  </Link>
                  &nbsp;&nbsp;&nbsp;
                  <Link
                    to="/login"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography
                      textAlign="center"
                      sx={{ textTransform: "none" }}
                    >
                      Login
                    </Typography>
                  </Link>
                  &nbsp;&nbsp;&nbsp;
                  <Link
                    to="/signup"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography
                      textAlign="center"
                      sx={{ textTransform: "none" }}
                    >
                      Register
                    </Typography>
                  </Link>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
        </div>
      </div>
    </>
  );
}

export default Landingpage;
