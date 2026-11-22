import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AuthLayout from "./components/AuthPage";

export default function App() {
  return (
      <Routes>
        <Route path="/login" element={
          <AuthLayout>
            <Login />
          </AuthLayout> } />

        <Route path="/register" element={
          <AuthLayout>
            <Register />
          </AuthLayout> } />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}