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

import DriverAccountPage from "./pages/DriverAccount";
import CustomerAccountPage from "./pages/CustomerAccount";
import CustomerSettingsPage from "./pages/CustomerSettings";
import AccessDeniedPage from "./pages/AccessDenied";

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
            user ? (
              <Navigate to={accountPath} replace />
            ) : (
              <AuthPage mode="login" />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to={accountPath} replace />
            ) : (
              <AuthPage mode="register" />
            )
          }
        />
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
            !user ? (
              <Navigate to="/login" replace />
            ) : user.role !== "customer" ? (
              <Navigate
                to="/geen-toegang"
                replace
                state={{ from: "/customer/account", requiredRole: "customer" }}
              />
            ) : (
              <CustomerAccountPage />
            )
          }
        />
        <Route
          path="/customer/settings"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : user.role !== "customer" ? (
              <Navigate
                to="/geen-toegang"
                replace
                state={{ from: "/customer/settings", requiredRole: "customer" }}
              />
            ) : (
              <CustomerSettingsPage />
            )
          }
        />
        <Route
          path="/driver/account"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : user.role !== "driver" ? (
              <Navigate
                to="/geen-toegang"
                replace
                state={{ from: "/driver/account", requiredRole: "driver" }}
              />
            ) : (
              <DriverAccountPage />
            )
          }
        />
      </Routes>
    </Layout>
  );
}
