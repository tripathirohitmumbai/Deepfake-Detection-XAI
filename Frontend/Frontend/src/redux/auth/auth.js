import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { json } from "react-router-dom";
import { toast } from "react-toastify";

// const BASE_URL = "http://35.154.171.148:8009";
const BASE_URL = "http://34.134.213.246:8008";

const initialState = {
  isLoading: false,
  imgResult: {},
  historyListing: [],
};

export const globalSlice = createSlice({
  name: "globalSlice",
  initialState,
  reducers: {
    StartLoading: (state, actions) => {
      state.isLoading = actions.payload;
    },
    SetImgResult: (state, action) => {
      const result = action.payload;
      if (Array.isArray(result)) {
        state.imgResult = result[0];
      } else {
        state.imgResult = result;
      }
    },
    ClearImgResult: (state) => {
      state.imgResult = [];
    },
    GetAllHistoryLists: (state, action) => {
      state.historyListing = action.payload;
    },
  },
});

export const {
  StartLoading,
  SetImgResult,
  ClearImgResult,
  GetAllHistoryLists,
} = globalSlice.actions;

export default globalSlice.reducer;

//------------------Signup-API----------------------
export function SignupApi({ userRegister, navigate, dispatch }) {
  return async () => {
    const formdata = new FormData();
    formdata.append("first_name", userRegister?.first_name);
    formdata.append("last_name", userRegister?.last_name);
    formdata.append("username", userRegister?.username);
    formdata.append("email", userRegister?.email);
    formdata.append("password", userRegister?.password);
    try {
      dispatch(StartLoading(true));
      const response = await axios.post(
        `${BASE_URL}/api/user_register`,
        formdata
      );
      if (response?.status === 201) {
        toast.success("Register successfully");
        dispatch(StartLoading(false));
        navigate("/login");
        return response?.data;
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.email);
      toast.error(error?.response?.data);
    } finally {
      dispatch(StartLoading(false));
    }
  };
}

//--------------------login user---------------------------
export function LoginUser({ loginData, setLoginData, navigate, dispatch }) {
  return async () => {
    const formData = new FormData();
    formData.append("username", loginData.email);
    formData.append("password", loginData.password);
    try {
      dispatch(StartLoading(true));
      const response = await axios.post(`${BASE_URL}/api/user_login`, formData);
      if (response?.data?.status === 200) {
        dispatch(StartLoading(false));
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("username", loginData?.username);
        navigate("/home");
        toast.success(response?.data?.message);
        setLoginData({ username: "", password: "" });
        return response?.data;
      } else {
        dispatch(StartLoading(false));
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      dispatch(StartLoading(false));
    }
  };
}

//--------------enter email api--------------------
export function Forgotpassword({
  emailData,
  setemailData,
  navigate,
  dispatch,
}) {
  return async () => {
    try {
      dispatch(StartLoading(true));
      const response = await axios.post(
        `${BASE_URL}/api/password/reset/`,
        emailData
      );
      if (response?.status === 200) {
        dispatch(StartLoading(false));
        localStorage.setItem("email", emailData?.email);
        toast.success(response?.data?.message);
        setemailData({ email: "" });
        navigate("/success");
        return response?.data;
      } else {
        dispatch(StartLoading(false));
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error);
      dispatch(StartLoading(false));
    }
  };
}

//--------------- Reset Password -------------------
export function Resetpaasword({ input, navigate, dispatch }) {
  const formdata = new FormData();
  formdata.append("new_password ", input.newPassword);
  formdata.append("confirm_password ", input.confirmPassword);
  formdata.append("token", input.token);
  return async () => {
    try {
      dispatch(StartLoading(true));
      const response = await axios.post(
        `${BASE_URL}/api/password/change/`,
        formdata
      );
      if (response?.status === 200) {
        dispatch(StartLoading(false));
        toast.success(response?.data?.message);
        navigate("/login");
        return response?.data;
      } else {
        dispatch(StartLoading(false));
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.email);
      dispatch(StartLoading(false));
    }
  };
}

// --------------------image/video upload ------------------------
export function ImageDetection({ file, dispatch, setRefreshPage }) {
  const formdata = new FormData();
  formdata.append("file", file);
  const token = localStorage.getItem("token");
  return async () => {
    try {
      dispatch(StartLoading(true));
      const headers = {
        Authorization: "token" + ' ' + token
      };
      const response = await axios.post(
        `${BASE_URL}/api/predict_result`,
        formdata, { headers }
      );
      if (response?.data) {
        dispatch(StartLoading(false));
        dispatch(SetImgResult(response?.data));
        toast.success("File uploaded successfully!");
      } else {
        dispatch(StartLoading(false));
        toast.error("Inavlid request!");
      }
    } catch (error) {
      toast.error("Something went wrong please try again!");
      dispatch(StartLoading(false));
    }
  };
}

// --------------------history list------------------------
export function historyList() {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
      dispatch(StartLoading(true));
      const headers = {
        Authorization: "token" + ' ' + token
      };
      const response = await axios.get(BASE_URL + `/api/user_history`, { headers });
      if (response?.data) {
        dispatch(StartLoading(false));
        dispatch(GetAllHistoryLists(response?.data));
        return response?.data;
      } else {
        toast.error("Something went wrong");
        dispatch(StartLoading(false));
      }
    } catch (error) {
      dispatch(StartLoading(false));
    }
  }
}
