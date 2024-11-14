import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Register from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import VerificationStatus from "./pages/Auth/VerificationStatus";
import { useEffect } from "react";
import { getUserInSessionAction } from "./state/reducers/userReducer";
import { useAppDispatch } from "./state/hooks";

// 3️⃣ Router singleton created
const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <HomePage /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "verification-status", element: <VerificationStatus /> },
    ],
  },
  {
    path: "/dashboard/*",
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "*", element: <BlogApp /> },
    ],
  },
  { path: "*", element: <Root /> },
]);

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserInSessionAction());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

function Root() {
  return (
    <Routes>
      {/* ⬆️ Blog splat route lifted */}
      <Route path="/users/*" element={<div>Blog</div>} />
    </Routes>
  );
}

function BlogApp() {
  return (
    <Routes>
      {/* ⬆️ Blog index route lifted */}
      <Route path="posts" element={<h1>Blog Posts</h1>} />
    </Routes>
  );
}
