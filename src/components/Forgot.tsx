import React, { FormEvent, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { CircularProgress } from "@mui/material";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage("Email đặt lại mật khẩu đã được gửi!");
    } catch (error: any) {
      setMessage("Không thể gửi email. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-main">
      <div className="container">
        <div className="heading">Quên Mật Khẩu</div>
        <form className="form" onSubmit={handlePasswordReset}>
          <input
            className="input"
            type="email"
            name="email"
            id="email"
            placeholder="Nhập Email"
            value={email}
            onChange={(e) => (setEmail(e.target.value), setMessage(""))}
          />
          <div className="message">{message}</div>
         <div className="btn-group">
         <button className="login-button btn-secondary" type="submit" disabled={loading}>
            Đặt Lại Mật Khẩu
            {loading && <CircularProgress color="inherit" size={14} />}
          </button>
          <button
            type="button"
            className="login-button"
            onClick={() => navigate("/login")}
          >
            Quay lại Đăng Nhập
          </button>
         </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
