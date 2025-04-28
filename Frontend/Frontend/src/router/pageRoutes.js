import Login from "../pages/login/login";
import Home from "../pages/home/home";
import Detect from "../pages/detect/detect";
import Signup from "../pages/signup/signup";
import Landingpage from "../pages/landingpage/landingpage";
import Forgotpass from "../pages/forgotpass/forgotpass";
import EmailPage from "../pages/emailpage/emailpage";
import Message from "../components/message";
import History from "../pages/history/history";

const PageRoutes = [
  {
    path: "/",
    element: <Landingpage />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <Forgotpass />,
  },
  {
    path: "/email-page",
    element: <EmailPage />,
  },
  {
    path: "/success",
    element: <Message />,
  },
  {
    path: "/history",
    element: <History />,
  },
];

export default PageRoutes;
