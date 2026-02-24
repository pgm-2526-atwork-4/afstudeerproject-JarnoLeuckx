import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

import { Home } from "./pages/Home";
import Rolstoelvervoer from "./pages/Rolstoelvervoer";
import {LuchthavenVervoer} from "./pages/Luchthavenvervoer";
import Assistentie from "./pages/Assistentie";
import Contact from "./pages/Contact";
import Reserveren from "./pages/Reserveren";

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
      </Routes>
    </Layout>
  );
}
