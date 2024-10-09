import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { CircularProgress } from "@mui/material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    signOut(auth);
  }, []);
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/read");
    } catch (error: any) {
      setMessage("Sai email hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-main">
      <div className="container">
        <div className="heading">Đăng nhập</div>
        <form action="" className="form" onSubmit={handleLogin}>
          <input
            className="input"
            type="email"
            name="email"
            id="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => (setEmail(e.target.value), setMessage(""))}
          />
          <input
            className="input"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => (setPassword(e.target.value), setMessage(""))}
          />
          <span className="forgot-password">
            <p onClick={() => navigate("/forgot-password")}>
              Quên mật khẩu ?
            </p>
          </span>

          <div className="message">{message}</div>
          <button className="login-button" type="submit" disabled={loading}>
            Đăng nhập
            {loading && <CircularProgress color="inherit" size={14} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
