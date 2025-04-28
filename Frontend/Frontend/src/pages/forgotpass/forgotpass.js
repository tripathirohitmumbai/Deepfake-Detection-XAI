import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Token, Visibility, VisibilityOff } from "@mui/icons-material";
import { Resetpaasword } from "../../redux/auth/auth";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const Forgotpass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [input, setInput] = useState({
    newPassword: "",
    confirmPassword: "",
    error: "",
    token: "",
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validatePasswords = () => {
    const { newPassword, confirmPassword } = input;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setInput((prevData) => ({
        ...prevData,
        error: "Passwords do not match.",
      }));
      return false;
    }

    // Check password strength
    const strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    if (!strongRegex.test(newPassword)) {
      setInput((prevData) => ({
        ...prevData,
        error:
          "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      }));
      return false;
    }

    setInput((prevData) => ({ ...prevData, error: "" }));
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatePasswords()) {
      dispatch(Resetpaasword({ dispatch, navigate, input }));
    }
  };

  useEffect(() => {
    const token = searchParams.get("token");
    setInput((prevData) => ({
      ...prevData,
      token: token,
    }));
  }, [searchParams]);

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
        onSubmit={handleSubmit}
      >
        <h1 style={{ display: "flex", justifyContent: "center" }}>
          Change Password
        </h1>
        <FormControl sx={{ marginTop: "25px" }} fullWidth>
          <InputLabel
            error={Boolean(
              input.error && input.newPassword !== input.confirmPassword
            )}
            htmlFor="outlined-adornment-new-password"
          >
            New Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-new-password"
            error={Boolean(
              input.error && input.newPassword !== input.confirmPassword
            )}
            type={showPassword ? "text" : "password"}
            name="newPassword"
            value={input.newPassword}
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
            label="New Password"
          />
        </FormControl>
        <FormControl sx={{ marginTop: "25px" }} fullWidth>
          <InputLabel
            error={Boolean(
              input.error && input.newPassword !== input.confirmPassword
            )}
            htmlFor="outlined-adornment-confirm-password"
          >
            Confirm Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-confirm-password"
            error={Boolean(
              input.error && input.newPassword !== input.confirmPassword
            )}
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={input.confirmPassword}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
          />
        </FormControl>
        {input.error && (
          <Typography sx={{ color: "red", marginTop: 1 }}>
            {input.error}
          </Typography>
        )}
        <Button
          fullWidth
          sx={{ marginTop: 4, borderRadius: "10px" }}
          type="submit"
          variant="contained"
        >
          <Typography
            textAlign="center"
            sx={{ textTransform: "none", color: "white" }}
          >
            Submit
          </Typography>
        </Button>
      </form>
    </div>
  );
};

export default Forgotpass;
