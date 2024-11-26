import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Register from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import EmailSent from "./pages/Auth/EmailSent";
import { useEffect } from "react";
import { getUserInSessionAction } from "./state/reducers/userReducer";
import { useAppDispatch } from "./state/hooks";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/static/AppSidebar";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import VerificationProtected from "./Protected/VerificationProtected";
import Home from "./pages/Dashboard/Home";
import Account from "./pages/Dashboard/Account";
import UserProtected from "./Protected/UserProtected";

// 3️⃣ Router singleton created
const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <HomePage /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      {
        path: "verification-status",
        element: (
          <VerificationProtected>
            <EmailSent />
          </VerificationProtected>
        ),
      },
      {
        path: "verify-email",
        element: (
          <VerificationProtected>
            <VerifyEmail />
          </VerificationProtected>
        ),
      },
    ],
  },
  {
    path: "/dashboard/*",
    element: (
      <UserProtected>
        <SidebarProvider>
          <AppSidebar />
          <Dashboard>
            <SidebarTrigger />
          </Dashboard>
        </SidebarProvider>
      </UserProtected>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "account",
        element: <Account />,
      },
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
