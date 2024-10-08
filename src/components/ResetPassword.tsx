import React, { useState } from "react";
import {
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const ChangePasswordPage = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        setMessage("Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }
      setLoading(true);
      const credential = EmailAuthProvider.credential(email, oldPassword);

      await reauthenticateWithCredential(user, credential)
        .then(async () => {
          await updatePassword(user, newPassword);
          setMessage("Đổi mật khẩu thành công!");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        })
        .catch((error) => {
          setMessage("Sai tài khoản hoặc mật khẩu cũ, vui lòng nhập lai.");
          return;
        });
    } catch (error) {
      setMessage("Có lỗi xảy ra khi đổi mật khẩu. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-main">
      <div className="container">
        <div className="heading">Đổi mật khẩu</div>
        <form className="form" onSubmit={handleChangePassword}>
          <input
            className="input"
            type="email"
            placeholder="Nhập Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Nhập mật khẩu cũ"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="message">{message}</div>
          <button className="login-button" type="submit" disabled={loading}>
          Đổi mật khẩu
            {loading && <CircularProgress color="inherit" size={14} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
