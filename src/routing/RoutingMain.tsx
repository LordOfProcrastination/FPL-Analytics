import { Routes, Route } from "react-router-dom";
import { HomePage, TeamPage } from "../pages";

export default function RoutingMain() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/team" element={<TeamPage />} />
    </Routes>
  );
}
