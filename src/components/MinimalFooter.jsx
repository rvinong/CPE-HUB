import React from 'react';
import { Link } from 'react-router-dom';

const MinimalFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 p-4 flex justify-center max-w-7xl mx-auto">
      <Link to="/" className="text-2xl font-bold text-gray-900">
        CPE HUB
      </Link>
    </footer>
  );
};

export default MinimalFooter;
