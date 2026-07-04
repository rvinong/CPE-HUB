import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Orders from '../components/Orders';
import Addresses from '../components/Addresses';
import { useAuth } from '../context/AuthContext';

const AccountDetails = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/account');
  };

  if (loading) {
    return (
      <div className="page-shell grid min-h-[50vh] place-items-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Loading account</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="page-shell py-10">
    <div className="surface-panel mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <p className="section-kicker">Account</p>
        <h1 className="mt-2 text-3xl font-black uppercase">Details</h1>
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
};

export default AccountDetails;
