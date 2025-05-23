import LoginForm from "./components/loginForm";
import Dashboard from "./components/dashboard";
import UploadDistributors from "./components/uploadDistributos";
import CreateCustomer from "./components/createCustomers";
import PrivateRoute from "./components/PrivateRoute";
import userLogoutConfirmation from "./components/userLogoutConfirmation";
import { Routes, Route } from "react-router-dom";
import './main.css'

// Separate component to use hooks inside Router context
function AppRoutes() {
  userLogoutConfirmation(); // ✅ now inside Router context

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/upload-distributors"
        element={
          <PrivateRoute>
            <UploadDistributors />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-customer"
        element={
          <PrivateRoute>
            <CreateCustomer />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
      <AppRoutes />
  );
}

export default App;
