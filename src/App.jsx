import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import RootLayout from "./pages/Root";
import AuthRoot from "./pages/AuthRoot";
import HomePage, { loader as userLoader } from "./pages/HomePage";
import { action as LoginAction } from "./components/auth/AuthForm";
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: userLoader,
      },
    ],
  },
  {
    path: "/auth",
    errorElement: <ErrorPage />,
    element: <AuthRoot />,
    children: [{ path: "login", element: <LoginPage />, action: LoginAction }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
