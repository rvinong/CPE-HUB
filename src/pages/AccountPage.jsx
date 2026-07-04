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
  const { isAuthenticated, loading, logout } = useAuth();
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

  if (loading) {
    return (
      <div className="page-shell grid min-h-[50vh] place-items-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Loading account</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="page-shell py-10">
      <div className="surface-panel mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <p className="section-kicker">Account</p>
          <h1 className="mt-2 text-3xl font-black uppercase">Your Orders</h1>
        </div>
        <div className="token-divider mb-6 flex items-center justify-between border-b">
          <div>
            <button
              className={`account-tab px-4 py-2 font-semibold ${
                activeTab === 'orders' ? 'account-tab-active' : ''
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button
              className={`account-tab ml-4 px-4 py-2 font-semibold ${
                activeTab === 'addresses' ? 'account-tab-active' : ''
              }`}
              onClick={() => setActiveTab('addresses')}
            >
              Addresses
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="ui-button-danger px-4 py-2"
          >
            Log Out
          </button>
        </div>
        <div>
          {activeTab === 'orders' && <Orders />}
          {activeTab === 'addresses' && <Addresses />}
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="app-canvas flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <p className="section-kicker">Account</p>
        <h1 className="mt-2 text-4xl font-extrabold uppercase">{showLogin ? "Log In" : "Sign Up"}</h1>
        <p className="body-copy mt-3 max-w-md">Track orders, keep addresses ready, and manage CPE merch checkout.</p>
      </div>
      <div className="surface-panel w-full max-w-md p-8">
        {showLogin ? (
          <>
            <LoginForm />
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-neutral-500 hover:text-neutral-950 hover:underline">
                Forgot your password?
              </a>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={toggleForm}
                className="text-sm text-neutral-500 hover:text-neutral-950 hover:underline focus:outline-none"
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
                className="text-sm text-neutral-500 hover:text-neutral-950 hover:underline focus:outline-none"
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
