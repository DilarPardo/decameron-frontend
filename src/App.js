import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./pages/layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Hoteles from "./pages/Hoteles";
import Asignaciones from './pages/Asignaciones';
import Login from "./pages/Login";
import TiposHabitacion from "./pages/TiposHabitacion";
import Alojamientos from "./pages/Alojamientos";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hoteles" element={<Hoteles />} />
          <Route path="asignaciones" element={<Asignaciones />} />      
          <Route path="tipos" element={<TiposHabitacion />} />
          <Route path="Alojamientos" element={<Alojamientos />} />
        </Route>

        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}