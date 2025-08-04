// src/components/AuthPage.jsx

import React, { useState } from 'react';
// 1. Import the auth object from your firebase config and the required functions
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 2. Add state to hold and display any errors
  const [error, setError] = useState('');

  // Make the function asynchronous to wait for Firebase
  const handleSignUp = async () => {
    setError(''); // Clear previous errors
    try {
      // 3. Call the Firebase function to create a user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signed up successfully!', userCredential.user);
      // We will handle navigation after successful signup later
    } catch (err) {
      // If Firebase returns an error, display it
      setError(err.message);
      console.error('Error signing up:', err.message);
    }
  };

  // Make the function asynchronous
  const handleLogin = async () => {
    setError(''); // Clear previous errors
    try {
      // 4. Call the Firebase function to sign in a user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully!', userCredential.user);
      // We will handle navigation after successful login later
    } catch (err) {
      // If Firebase returns an error, display it
      setError(err.message);
      console.error('Error logging in:', err.message);
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Welcome to MLCodeQuest
        </h2>
        
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* 5. Display the error message if it exists */}
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        {/* Buttons */}
        <div className="flex items-center justify-between space-x-4">
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
          <button
            onClick={handleSignUp}
            className="w-full px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;