import "./App.css";
import Layout from "./components/layout/layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/home/home";
import ProtectedRoute from "./router/protectedRoutes";
import Detect from "./pages/detect/detect";
import PageRoutes from "./router/pageRoutes";
import Loader from "./components/loader/loader";
import { useSelector } from "react-redux";
import ProtectedRoutes from "./router/protectedRoutes";
import Routerdata from "./router/router";

function App() {
  const { isLoading } = useSelector((state) => state.dataSlice);
  return (
    <>
      <Router>
        {isLoading && <Loader />}
        <Routerdata />
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
