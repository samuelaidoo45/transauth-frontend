"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "../../utils/api"; // Use your Axios instance

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateInputs = (): boolean => {
    setValidationError(""); // Clear validation errors before validation

    if (username.length < 3) {
      setValidationError("Username must be at least 3 characters long.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address.");
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      setValidationError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character (@, $, !, %, *, ?, &, #)."
      );
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!validateInputs()) return;

    try {
      await api.post("/users/register", { username, email, password });
      // Redirect to login page after successful registration
      window.location.href = "/login";
    } catch (err: unknown) {
      // Use axios.isAxiosError to check if this is an Axios error
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.detail || "Registration failed. Please try again."
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md px-8 py-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleRegister}>
          {validationError && (
            <p className="mb-4 text-sm text-center text-red-500 bg-red-100 p-2 rounded-md">
              {validationError}
            </p>
          )}
          {error && (
            <p className="mb-4 text-sm text-center text-red-500 bg-red-100 p-2 rounded-md">
              {error}
            </p>
          )}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 text-gray-800 font-medium border border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-gray-800 font-medium border border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-gray-800 font-medium border border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 hover:underline font-medium"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
