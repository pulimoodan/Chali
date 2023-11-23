import { Outlet } from "react-router-dom";
import "./AuthLayout.css";
import { useEffect } from "react";

function AuthLayout() {
  useEffect(() => {
    document.body.classList.add("auth-page");

    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  return (
    <div className="auth">
      <div className="card">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
