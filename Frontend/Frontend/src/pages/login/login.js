import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoginUser } from "../../redux/auth/auth";

// Validate email format
const isemail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(null);
  const [success, setSuccess] = useState(null);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!loginData.email) {
      newErrors.email = "Email Required";
    } else if (!isemail(loginData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!loginData.password) {
      newErrors.password = "Password Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     dispatch(LoginUser({ loginData, navigate, setLoginData, dispatch }));
  //     setSuccess("Login successful!");
  //     setFormValid(null);
  //   } else {
  //     setFormValid("Please fix the errors above.");
  //     setSuccess(null);
  //   }
  // };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(LoginUser({ loginData, navigate, setLoginData, dispatch }))
        .then((response) => {
          if (response?.status === 200) {
            setSuccess("Login successful!");
          }
        })
        .catch(() => {
          setSuccess(null);
          setFormValid("Something went wrong. Please try again.");
        });
    } else {
      setFormValid("Please fix the errors above.");
      setSuccess(null);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className="foam"
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
        <h1 style={{ display: "flex", justifyContent: "center" }}>Login</h1>
        <TextField
          fullWidth
          sx={{ marginTop: 4 }}
          id="outlined-basic"
          error={Boolean(errors.email)}
          label="Email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
        />

        {errors.email && (
          <p style={{ color: "red" }} className="error_text">
            {errors.email}
          </p>
        )}

        <FormControl sx={{ marginTop: "25px" }} fullWidth>
          <InputLabel
            error={Boolean(errors.password)}
            htmlFor="outlined-adornment-password"
          >
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            error={Boolean(errors.password)}
            type={showPassword ? "text" : "password"}
            name="password"
            value={loginData.password}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {errors.password && (
            <p style={{ color: "red" }} className="error_text">
              {errors.password}
            </p>
          )}
        </FormControl>

        <Button
          fullWidth
          sx={{ marginTop: 4, borderRadius: "10px" }}
          type="submit"
          variant="contained"
          startIcon={<LoginIcon />}
        >
          <Typography
            textAlign="center"
            sx={{ textTransform: "none", color: "white" }}
          >
            LOGIN
          </Typography>
        </Button>

        <p className="mb-0 responsive-paragraph">
          <span className="no-decoration">
            Don't have an account?{" "}
            <a href="/signup" className="no-decoration text-white-50 fw-bold">
              Sign Up
            </a>
          </span>
          <span className="no-decoration">
            <a
              href="/email-page"
              className="no-decoration text-white-50 fw-bold"
            >
              Forgot Password
            </a>
          </span>
        </p>

        {formValid && <Alert severity="error">{formValid}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </form>
    </div>
  );
}

export default Login;
