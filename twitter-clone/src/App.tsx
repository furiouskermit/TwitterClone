import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Screenshots from "./routes/screenshots";
import Spoilers from "./routes/spoilers";
import Tips from "./routes/tips";
import Profile from "./routes/profile";
import Login from "./routes/login";
import Signup from "./routes/signup";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { auth } from "./firebase";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/protected-route";
import Loading from "./components/loading";

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

const GlobalStyles = createGlobalStyle`
  ${reset};
  :root {
    --point: #1F60ED;
    --text-muted: #979797;
    --border-color: #dee2e6;
    --bd-rad: 7px;
  }
  * {
    box-sizing: border-box;
    font-family: "Pretendard Variable" !important;
    letter-spacing: -0.2px;
  }
  body {
    margin: 0;
    padding: 0;
    font-size: 15px;
  }
  a {
    font-size: 15px;
    color: var(--point);
  }
  button {
    outline: none;
    background-color: transparent;
    border: none;
    font-size: 15px;
    cursor: pointer;
  }
  input {
    &[type="submit"] {
      cursor: pointer;
    }
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: var(--text-muted);
    }
  }
  img {
    object-fit: cover;
  }

  /* CSS MODULE */
  .d-none {
    display: none !important;
  }
  .d-block {
    display: block !important;
  }
  .bg-point {
    background-color: var(--point) !important;
    color: #fff !important;
    transition: 0.1s;
    &:hover {
      background-color: #1c53cc !important;
    }
  }
  .text-muted {
    color: var(--text-muted) !important;
  }
`;

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