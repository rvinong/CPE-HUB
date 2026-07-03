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
};

export default AccountDetails;
