import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";

import { Home } from "./pages/Home";
import Rolstoelvervoer from "./pages/Rolstoelvervoer";
import { LuchthavenVervoer } from "./pages/Luchthavenvervoer";
import Assistentie from "./pages/Assistentie";
import Contact from "./pages/Contact";
import Reserveren from "./pages/Reserveren";
import AuthPage from "./auth/AuthPage";

import DriverAccountPage from "./pages/DriverAccount"; // 👈 toevoegen
import CustomerAccountPage from "./pages/CustomerAccount";
import CustomerSettingsPage from "./pages/CustomerSettings";

export default function App() {
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
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route
          path="/driver/login"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/driver/register"
          element={<Navigate to="/register" replace />}
        />
        <Route path="/customer/account" element={<CustomerAccountPage />} />
        <Route path="/customer/settings" element={<CustomerSettingsPage />} />

        {/* 👇 NIEUWE ROUTE */}
        <Route path="/driver/account" element={<DriverAccountPage />} />
      </Routes>
    </Layout>
  );
}
