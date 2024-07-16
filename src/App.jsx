import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <Routes>
      <Route path="admin/*" element={<DashboardLayout />} />
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default App;
