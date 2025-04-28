import { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import PageRoutes from "./pageRoutes";

const Routerdata = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && window.location.pathname === "/home") {
      navigate("/login");
    } else if (token && window.location.pathname === "/login") {
      navigate("/home");
    }
  }, [token]);
  return useRoutes(PageRoutes);
};

export default Routerdata;
