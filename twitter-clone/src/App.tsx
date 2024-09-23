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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
  * {
    box-sizing: border-box;
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
  }
  body {
    margin: 0;
    padding: 0;
  }
  button {
    outline: none;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
  img {
    object-fit: cover;
  }
`;

export default function App(){
  
  return (
    <>
      <GlobalStyles />
      <RouterProvider router={router} />
    </>
  );
}