import React from "react";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import Layout from "../../components/layout/layout";
import bgImage from "../../assets/photos/bgimage.png";

function Detect() {
  const homeStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "120vh",
    width: "100%",
  };

  return (
    <>
      <Layout>
        <div style={homeStyle}>
          <Container>
            <Grid
              container
              spacing={2}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "100vh" }}
            >
              <Grid item>
                <Typography variant="h4" component="h1" gutterBottom>
                  Is your video fake? Check it
                </Typography>
              </Grid>
              <Grid item>
                <Button variant="contained" component="label">
                  Upload File
                  <input type="file" hidden />
                </Button>
              </Grid>
            </Grid>
          </Container>
        </div>
      </Layout>
    </>
  );
}

export default Detect;
