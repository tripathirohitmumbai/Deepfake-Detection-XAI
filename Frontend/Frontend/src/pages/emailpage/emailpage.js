import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import { Forgotpassword } from "../../redux/auth/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const EmailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailData, setemailData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setemailData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (validateForm()) {
      dispatch(Forgotpassword({ emailData, setemailData, navigate, dispatch }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!emailData.email) {
      newErrors.email = "Email is Required";
    } else if (!isEmail(emailData.email)) {
      newErrors.email = "Invalid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: "400px",
          border: "2px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h1 style={{ display: "flex", justifyContent: "center" }}>
          Enter Email
        </h1>
        <TextField
          fullWidth
          sx={{ marginTop: 4 }}
          id="outlined-basic"
          error={Boolean(errors.email)}
          label="Email address"
          name="email"
          value={emailData.email}
          onChange={handleChange}
        />

        {errors.email && (
          <p style={{ color: "red" }} className="error_text">
            {errors.email}
          </p>
        )}
        <Button
          fullWidth
          sx={{ marginTop: 4, borderRadius: "10px" }}
          type="submit"
          variant="contained"
          startIcon={<AttachEmailIcon />}
        >
          <Typography
            textAlign="center"
            sx={{ textTransform: "none", color: "white" }}
          >
            Send Email
          </Typography>
        </Button>
      </form>
    </div>
  );
};

export default EmailPage;
