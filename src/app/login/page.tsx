"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 
import api from "../../utils/api";  // Your custom Axios instance

// Extend if you want more fields from the token
interface DecodedToken {
  exp: number; // token expiration time
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to validate email format
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Function to validate password strength
  const validatePassword = (password: string): boolean => {
    // At least 8 characters, one uppercase, one lowercase, one number, and one special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return re.test(password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Input Validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the custom Axios instance for API call
      const response = await api.post("/users/login", {
        username: "string", // Hardcoded or remove if not required
        email,
        password,
      });

      const token = response.data.access_token;

      // Decode token to get expiration
      const decoded: DecodedToken = jwtDecode(token);
      const expires = new Date(decoded.exp * 1000); // Convert exp to milliseconds

      // Store the token securely in a cookie
      document.cookie = `token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict; Secure`;

      // Redirect to the profile page
      window.location.href = "/profile";
    } catch (err: unknown) {
      // Handle errors
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        if (detail) {
          if (Array.isArray(detail)) {
            // If 'detail' is an array, concatenate all messages
            const messages = detail
              .map((d: { msg: string }) => d.msg)
              .join(" ");
            setError(messages);
          } else if (typeof detail === "object") {
            // If 'detail' is an object, extract the 'msg' property
            const possibleMsg = (detail as { msg?: string }).msg;
            setError(possibleMsg || "An error occurred.");
          } else if (typeof detail === "string") {
            // If 'detail' is already a string
            setError(detail);
          } else {
            setError("An unexpected error occurred.");
          }
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        // Non-Axios errors
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Optional: Handle automatic logout on token expiry
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token has expired
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
          window.location.href = "/login";
        } else {
          // Set a timeout to logout when the token expires
          const timeout = (decoded.exp - currentTime) * 1000;
          const timer = setTimeout(() => {
            document.cookie =
              "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
            window.location.href = "/login";
          }, timeout);

          return () => clearTimeout(timer);
        }
      } catch {
        // If token is invalid or decoding fails
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        window.location.href = "/login";
      }
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md px-8 py-6 bg-white shadow-lg rounded-xl animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6 animate-fadeInDown">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin} className="animate-fadeInUp">
          {error && (
            <p className="mb-4 text-sm text-center text-red-500 bg-red-100 p-2 rounded-md animate-fadeIn">
              {error}
            </p>
          )}
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
              className="w-full px-4 py-2 text-gray-800 font-medium border border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400 transition duration-300"
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
              className="w-full px-4 py-2 text-gray-800 font-medium border border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400 transition duration-300"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Logging In..." : "Log In"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-blue-500 hover:underline font-medium"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
