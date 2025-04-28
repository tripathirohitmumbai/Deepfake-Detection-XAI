import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Alert from "@mui/material/Alert";
import FilledInput from "@mui/material/FilledInput";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SignupApi } from "../../redux/auth/auth";
import Loader from "../../components/loader/loader";

const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userRegister, setUserRegister] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    email: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [formValid, setFormValid] = useState(null);
  const [success, setSuccess] = useState(null);
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "first_name":
      case "last_name":
        error = !value ? "This field is required" : "";
        break;
      case "email":
        error = !isEmail(value) ? "Invalid email address" : "";
        break;
      case "username":
        error = !value ? "This field is required" : "";
        break;
      case "password":
        error =
          value.length < 5 || value.length > 15
            ? "Must be between 5 and 15 characters"
            : "";
        break;
      default:
        break;
    }
    return error;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserRegister({
      ...userRegister,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: validateField(name, value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(null);
    let newErrors = {};
    Object.keys(userRegister).forEach((key) => {
      newErrors[key] = validateField(key, userRegister[key]);
    });
    setFormErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      setFormValid("Please correct the errors in the form");
      return;
    }
    if (!hasErrors) {
      dispatch(SignupApi({ userRegister, dispatch, navigate }));
    }
    setFormValid(null);
    setSuccess("Form Submitted Successfully");
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

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
        style={{
          width: "100%",
          maxWidth: "400px",
          border: "2px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h1 style={{ display: "flex", justifyContent: "center" }}>Sign up</h1>
        <TextField
          fullWidth
          sx={{ marginTop: 4 }}
          id="outlined-basic"
          error={!!formErrors?.first_name}
          label="First Name"
          name="first_name"
          value={userRegister?.first_name}
          onChange={handleChange}
          helperText={formErrors?.first_name}
        />
        <TextField
          fullWidth
          sx={{ marginTop: 4 }}
          id="last_name"
          error={!!formErrors?.last_name}
          label="Last Name"
          name="last_name"
          value={userRegister?.last_name}
          onChange={handleChange}
          helperText={formErrors?.last_name}
        />
        <TextField
          fullWidth
          sx={{ marginTop: 4 }}
          id="username"
          error={!!formErrors?.username}
          label="Username"
          name="username"
          value={userRegister?.username}
          onChange={handleChange}
          helperText={formErrors?.username}
        />
        <TextField
          fullWidth
          sx={{ marginTop: 4 }}
          id="email"
          error={!!formErrors?.email}
          label="Email"
          name="email"
          value={userRegister?.email}
          onChange={handleChange}
          helperText={formErrors?.email}
        />
        <TextField
          fullWidth
          sx={{ marginTop: 4 }}
          id="password"
          type={showPassword ? "text" : "password"}
          error={!!formErrors?.password}
          label="Password"
          name="password"
          value={userRegister?.password}
          onChange={handleChange}
          helperText={formErrors?.password}
          InputProps={{
            endAdornment: (
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
            ),
          }}
        />
        <Button
          sx={{ marginTop: 4, borderRadius: "10px" }}
          fullWidth
          onClick={handleSubmit}
          variant="contained"
          color="warning"
          startIcon={<PersonAddAltIcon />}
        >
          SIGN UP
        </Button>
        <p className="mb-0 " style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <a
            href="/login"
            style={{ textDecoration: "none" }}
            className="text-white-50 fw-bold"
          >
            Login
          </a>
        </p>
        {formValid && <Alert severity="error">{formValid}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </form>
    </div>
  );
};

export default Signup;
