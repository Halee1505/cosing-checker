import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      } else {
        navigate("/read");
      }
    });
    return () => unsubscribe();
  }, [navigate]);
  return <div></div>;
};

export default HomePage;
