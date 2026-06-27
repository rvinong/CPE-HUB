import React, { useState, useEffect } from "react";
import { getOrders, getUsers, getAddresses } from "../api/apiClient";

const API_BASE_URL = "http://localhost:5000/api";

export default function UserAccount({ token, setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("orders"); // "orders" or "address"
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupBirthday, setSignupBirthday] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  useEffect(() => {
    if (token) {
      fetchUserProfile();
      fetchOrders();
      fetchAddresses();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(API_BASE_URL + "/profile", {
        headers: { Authorization: "Bearer " + token },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
      }
    } catch {
      setUser(null);
      setToken("");
      localStorage.removeItem("token");
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch {
      setOrders([]);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await getAddresses();
      setAddresses(response.data);
    } catch {
      setAddresses([]);
    }
  };

  // The rest of the component code should be in UserAccount_Part2.jsx
}
