import React, { useState, useRef } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Layout from "../../components/layout/layout";
import concept from "../../assets/photos/concept.png";
import ApexChart from "../apexchart/apexchart";
import { ImageDetection } from "../../redux/auth/auth";
import { useDispatch, useSelector } from "react-redux";
import "../../App.css";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function Home() {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isImageVisible, setImageVisible] = useState(true);
  const [isVideo, setIsVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hideDemoImage, setHideDemoImage] = useState(false);

  const imgResult = useSelector((state) => state?.dataSlice?.imgResult);

  const handleFileChange = (event) => {
    const selectedFile = event?.target?.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const url = URL.createObjectURL(selectedFile);
      if (fileType.startsWith("image/")) {
        setSelectedImage(selectedFile);
        setImageUrl(url);
        setImageVisible(true);
        setIsVideo(false);
      } else if (fileType.startsWith("video/")) {
        setSelectedImage(selectedFile);
        setImageUrl(url);
        setImageVisible(true);
        setIsVideo(true);
      } else {
        setImageUrl(null);
        setImageVisible(false);
      }
      dispatch(ImageDetection({ file: selectedFile, dispatch }));
    } else if (event?.type === "click") {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (canvas && video) {
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/png");
        fetch(dataURL)
          .then((res) => res.blob())
          .then((blob) => {
            const capturedFile = new File([blob], "captured_image.png", {
              type: "image/png",
            });
            setSelectedImage(capturedFile);
            setCapturedPhoto(dataURL);
            dispatch(ImageDetection({ file: capturedFile, dispatch }));
          });
        stopWebcam();
      }
    } else {
      setImageUrl(concept);
      setImageVisible(true);
    }
  };

  const startWebcam = async () => {
    setHideDemoImage(true);
    setCapturedPhoto(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsCameraOn(true);
    } catch (err) {
      console.error("Error accessing webcam: ", err);
      setIsCameraOn(false);
    }
  };

  const stopWebcam = () => {
    setHideDemoImage(false);
    setCapturedPhoto(null);
    let stream = videoRef.current.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
    setIsCameraOn(false);
  };

  const removeCapturedPhoto = () => {
    setCapturedPhoto(null);
    startWebcam();
  };

  const clearSelectedMedia = () => {
    setSelectedImage(null);
    setImageUrl(null);
    setHideDemoImage(false);
  };

  return (
    <Layout>
      <div style={{ backgroundColor: "#287b7c" }}>
        <Container>
          <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            <Grid item style={{ marginTop: "80px" }}>
              <Typography
                variant="h4"
                component="h1"
                fontWeight={"600"}
                color="#16f1f5"
              >
                Is your image/video fake? Check it
              </Typography>
            </Grid>
            <Grid item>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
              >
                <Button
                  variant="contained"
                  component="label"
                  style={{
                    fontWeight: "700",
                    color: "black",
                    backgroundColor: "#2a9f2a",
                    borderRadius: "15px",
                  }}
                >
                  + ADD IMAGE / VIDEO
                  <input
                    type="file"
                    hidden
                    accept="image/*,video/*"
                    onChange={(event) => handleFileChange(event)}
                  />
                </Button>
                {!isCameraOn ? (
                  <Button
                    onClick={startWebcam}
                    variant="contained"
                    style={{
                      fontWeight: "700",
                      color: "black",
                      backgroundColor: "#2a9f2a",
                      borderRadius: "15px",
                      height: "40px",
                    }}
                  >
                    <IconButton size="large" aria-label="search" color="black">
                      <CameraAltIcon />
                    </IconButton>
                    Open Webcam
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={stopWebcam}
                      variant="contained"
                      style={{
                        fontWeight: "700",
                        color: "black",
                        backgroundColor: "#2a9f2a",
                        borderRadius: "15px",
                        height: "40px",
                      }}
                    >
                      <IconButton
                        size="large"
                        aria-label="search"
                        color="black"
                      >
                        <CameraAltIcon />
                      </IconButton>
                      Close Webcam
                    </Button>

                    <Button
                      onClick={(event) => handleFileChange(event)}
                      variant="contained"
                      style={{
                        fontWeight: "700",
                        color: "black",
                        backgroundColor: "#ff5722",
                        borderRadius: "15px",
                        height: "40px",
                        marginLeft: "10px",
                      }}
                    >
                      Capture Photo
                    </Button>
                  </>
                )}
              </Box>
            </Grid>

            {hideDemoImage && (
              <Grid item>
                <div style={{ position: "relative" }}>
                  {capturedPhoto && (
                    <IconButton
                      onClick={removeCapturedPhoto}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                  {capturedPhoto ? (
                    <img
                      src={capturedPhoto}
                      alt="Captured"
                      style={{ width: "640px", height: "480px" }}
                    />
                  ) : (
                    <video ref={videoRef} width="640" height="480" />
                  )}
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
              </Grid>
            )}

            <Grid item>
              <Box display="flex" justifyContent="center">
                <div
                  style={{
                    position: "relative",
                    width: "640px",
                    height: "480px",
                  }}
                >
                  {selectedImage ? (
                    selectedImage.type.startsWith("video/") ? (
                      <div style={{ background: "#000" }}>
                        <video
                          ref={videoRef}
                          src={imageUrl}
                          width="640"
                          height="480"
                          style={{
                            objectFit: "cover",
                          }}
                          controls
                        />
                        <IconButton
                          aria-label="clear video"
                          onClick={() => clearSelectedMedia()}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            color: "#fff",
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                    ) : (
                      <>
                      <img
                        src={
                          imgResult?.gradcam_heatmap
                            ? imgResult.gradcam_heatmap
                            : imageUrl
                        }
                        alt="Selected"
                        style={{
                          width: "500px",
                          height: "400px",
                          marginLeft: "70px",
                          objectFit: "cover"
                        }}
                      />
                      <IconButton
                        aria-label="clear image"
                        onClick={() => clearSelectedMedia()}
                        style={{
                          position: "absolute",
                          top: "-24px",
                          // right: "10px",
                          color: "#fff",
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                      </>
                    )
                  ) : (
                    !hideDemoImage && (
                      <img
                        src={concept}
                        alt="Default"
                        style={{
                          width: "500px",
                          height: "400px",
                          marginLeft: "70px",
                          objectFit: "cover",
                        }}
                      />
                    )
                  )}
                </div>
              </Box>
            </Grid>

            <Grid item>
              <Typography
                variant="h6"
                component="h1"
                fontWeight={"600"}
                color="#16f1f5"
              >
                RESULT OF THE IMAGE/VIDEO WILL GO HERE!
              </Typography>
            </Grid>

            <Grid item>
              <Typography
                variant="h6"
                component="h1"
                fontWeight={"600"}
                color="#16f1f5"
              >
                Result:{" "}
                <span style={{ color: "red" }}>
                  {imgResult?.predicted_class}
                </span>
              </Typography>
            </Grid>

            <Grid
              style={{
                width: "1000px",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "100px",
              }}
            >
              <ApexChart />
            </Grid>
          </Grid>
        </Container>
      </div>
    </Layout>
  );
}

export default Home;
