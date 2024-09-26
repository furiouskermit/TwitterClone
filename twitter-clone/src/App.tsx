import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Screenshots from "./routes/screenshots";
import Spoilers from "./routes/spoilers";
import Tips from "./routes/tips";
import Profile from "./routes/profile";
import Login from "./routes/login";
import Signup from "./routes/signup";
import { auth } from "./firebase";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/protected-route";
import Loading from "./components/loading";
import { GlobalStyles } from "./css/global-styles";

const router = createBrowserRouter([
  {
    path: "/",
    element: (<ProtectedRoute><Layout /></ProtectedRoute>),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/screenshots",
        element: <Screenshots />,
      },
      {
        path: "/spoilers",
        element: <Spoilers />,
      },
      {
        path: "/tips",
        element: <Tips />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  }
]);

export default function App(){
  const [isLoading, setLoading] = useState(true);
  const init = async() => {
    try {
      await auth.authStateReady()
      setLoading(false);
    } catch(e) {
      console.log(e);
    }
  };
  useEffect(()=>{
    init();
  }, []);
  return (
    <>
      <GlobalStyles />
      {isLoading ? <Loading /> : <RouterProvider router={router} />}
    </>
  );
}