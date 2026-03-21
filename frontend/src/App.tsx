import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/layout/Layout";
import { getCurrentUser, onAuthChanged, type User } from "./auth/auth.api";

import { Home } from "./pages/Home";
import Rolstoelvervoer from "./pages/Rolstoelvervoer";
import { LuchthavenVervoer } from "./pages/Luchthavenvervoer";
import Assistentie from "./pages/Assistentie";
import Contact from "./pages/Contact";
import Reserveren from "./pages/Reserveren";
import AuthPage from "./auth/AuthPage";
import ForgotPasswordPage from "./auth/ForgotPasswordPage";
import ResetPasswordPage from "./auth/ResetPasswordPage";

import DriverAccountPage from "./pages/DriverAccount";
import CustomerAccountPage from "./pages/CustomerAccount";
import CustomerSettingsPage from "./pages/CustomerSettings";
import AccessDeniedPage from "./pages/AccessDenied";

type ProtectedRouteProps = {
  user: User | null;
  children: React.ReactElement;
  requiredRole?: "customer" | "driver";
};

function ProtectedRoute({ user, children, requiredRole }: ProtectedRouteProps) {
  const currentPath = window.location.pathname;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: currentPath }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <Navigate
        to="/geen-toegang"
        replace
        state={{ from: currentPath, requiredRole }}
      />
    );
  }

  return children;
}

type GuestRouteProps = {
  user: User | null;
  accountPath: string;
  children: React.ReactElement;
};

function GuestRoute({ user, accountPath, children }: GuestRouteProps) {
  if (user) {
    return <Navigate to={accountPath} replace />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  useEffect(() => {
    const sync = () => {
      setUser(getCurrentUser());
    };

    const offAuthChanged = onAuthChanged(sync);
    window.addEventListener("storage", sync);

    return () => {
      offAuthChanged();
      window.removeEventListener("storage", sync);
    };
  }, []);

  const accountPath =
    user?.role === "driver"
      ? "/driver/account"
      : user?.role === "customer"
        ? "/customer/account"
        : "/";

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rolstoelvervoer" element={<Rolstoelvervoer />} />
        <Route path="/luchthavenvervoer" element={<LuchthavenVervoer />} />
        <Route path="/assistentie" element={<Assistentie />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reserveren" element={<Reserveren />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <GuestRoute user={user} accountPath={accountPath}>
              <AuthPage mode="login" />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute user={user} accountPath={accountPath}>
              <AuthPage mode="register" />
            </GuestRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/driver/login"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/driver/register"
          element={<Navigate to="/register" replace />}
        />
        <Route path="/geen-toegang" element={<AccessDeniedPage />} />
        <Route
          path="/customer/account"
          element={
            <ProtectedRoute user={user} requiredRole="customer">
              <CustomerAccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/settings"
          element={
            <ProtectedRoute user={user} requiredRole="customer">
              <CustomerSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/account"
          element={
            <ProtectedRoute user={user} requiredRole="driver">
              <DriverAccountPage />
            </ProtectedRoute>
          }
        />
        {/* 404 fallback route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
// Simpele 404 pagina component
function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-5xl font-black text-blue-800 mb-4">404</h1>
      <p className="text-lg text-slate-700 mb-6">Deze pagina bestaat niet.</p>
      <a href="/" className="btn-primary">
        Ga naar de startpagina
      </a>
    </div>
  );
}
