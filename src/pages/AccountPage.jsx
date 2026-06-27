import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import Orders from "../components/Orders";
import Addresses from "../components/Addresses";
import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'orders' || tab === 'addresses') {
      setActiveTab(tab);
    }
  }, [location.search]);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  const handleLogout = () => {
    logout();
  };

  if (isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
        <div className="flex justify-between items-center border-b mb-6">
          <div>
            <button
              className={`px-4 py-2 font-semibold ${
                activeTab === 'orders' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button
              className={`ml-4 px-4 py-2 font-semibold ${
                activeTab === 'addresses' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('addresses')}
            >
              Addresses
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Log Out
          </button>
        </div>
        <div>
          {activeTab === 'orders' && <Orders />}
          {activeTab === 'addresses' && <Addresses />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
        {showLogin ? "Login" : "Sign Up"}
      </h1>
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        {showLogin ? (
          <>
            <LoginForm />
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot your password?
              </a>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={toggleForm}
                className="text-sm text-gray-600 hover:underline focus:outline-none"
              >
                Sign up
              </button>
            </div>
          </>
        ) : (
          <>
            <SignupForm />
            <div className="mt-6 text-center">
              <button
                onClick={toggleForm}
                className="text-sm text-gray-600 hover:underline focus:outline-none"
              >
                Log in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
