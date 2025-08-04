// src/components/Navbar.jsx
import React from 'react';
import { auth } from '../firebase.js';
import { signOut } from "firebase/auth";

const CodeIcon = () => (
    <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

function Navbar({ user, onNavigate }) {

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged in App.jsx will handle these state updates
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
            {/* Conditional rendering for the right side of the navbar */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.email}</span>
                <button 
                  onClick={handleLogout} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              // The login link is no longer needed since the page shows automatically
              // We can leave this empty or add a "Login" text for visual consistency
              <span className="text-gray-500">Login</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;