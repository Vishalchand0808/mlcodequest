// src/components/Navbar.jsx
import React from 'react';

const CodeIcon = () => (
    <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CodeIcon />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Problems</a>
                <a href="#" className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contest</a>
                <a href="#" className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Discuss</a>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
              <a href="#" className="text-gray-500 hover:text-gray-700">Login</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;