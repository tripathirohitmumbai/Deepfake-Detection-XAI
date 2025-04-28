import React from "react";
import { AppBar, Box, Toolbar, Typography, Container } from "@mui/material";
import "./footer.css";

function Footer({ open }) {
  return (
    <div className="footer-align">
      <AppBar
        sx={{
          top: "auto",
          bottom: 0,
          backgroundColor: "#29775c",
          transition: "padding-left 0.3s ease-in-out",
          position: "static !important",
        }}
      >
        <Container maxWidth="md">
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" color="inherit" align="center">
                &copy; {new Date().getFullYear()} Deepfaking-Detection All
                rights reserved.
              </Typography>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default Footer;
