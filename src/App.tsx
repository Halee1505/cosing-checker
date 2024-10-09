import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/Login"; // Example component
import NavBar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoutes";
import ExcelReader from "./components/ReadData";
import ResetPasswordPage from "./components/ResetPassword";
import HomePage from "./components/Home";
import Register from "./components/Register";
import ForgotPasswordPage from "./components/Forgot";

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route
          path="/reset"
          element={
            <ProtectedRoute>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/read"
          element={
            <ProtectedRoute>
              <div>
                <NavBar />
                <ExcelReader />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
