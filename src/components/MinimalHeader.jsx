import React from 'react';
import { Link } from 'react-router-dom';

const MinimalHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between max-w-7xl mx-auto">
      <Link to="/" className="text-2xl font-bold text-gray-900">
        CPE HUB
      </Link>
      <Link to="/cart" aria-label="Cart" className="text-gray-700 hover:text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293 1.293a1 1 0 000 1.414L7 17m10-4v6a2 2 0 11-4 0v-6m4 0H7"
          />
        </svg>
      </Link>
    </header>
  );
};

export default MinimalHeader;
