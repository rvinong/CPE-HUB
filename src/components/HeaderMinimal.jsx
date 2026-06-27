import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HeaderMinimal() {
  const { isAdmin, isAuthenticated } = useAuth();

  return (
    <header>
      {isAdmin && isAuthenticated && (
        <div>
          <Link to="/admin">Admin Dashboard</Link>
        </div>
      )}
    </header>
  );
}

export default HeaderMinimal;
