"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api"; // Axios instance for API requests
import { jwtDecode } from "jwt-decode"; // To decode JWT tokens
import Cookies from "js-cookie"; // To manage cookies

interface DecodedToken {
  exp: number;
}

interface UserProfile {
  username: string;
  email: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Utility function to get the token from cookies
  const getToken = (): string | null => {
    return Cookies.get("token") || null;
  };

  // Function to validate the token
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // in seconds
      return decoded.exp > currentTime;
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  };

  // Fetch the user's profile information
  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();

      if (!token) {
        // No token found, redirect to login
        router.push("/login");
        return;
      }

      if (!isTokenValid(token)) {
        // Token is invalid or expired
        Cookies.remove("token"); // Clear the invalid token
        router.push("/login");
        return;
      }

      try {
        // Set the Authorization header with the token
        const response = await api.get<UserProfile>("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile. Redirecting to login...");
        // Clear the token and redirect after a short delay
        Cookies.remove("token");
        setTimeout(() => router.push("/login"), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Logout function
  const handleLogout = () => {
    Cookies.remove("token"); // Clear token cookie
    router.push("/login"); // Redirect to login page
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
        <div className="w-full max-w-md px-8 py-6 bg-white shadow-lg rounded-xl flex flex-col items-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md px-8 py-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
          Profile
        </h2>
        {error ? (
          <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded-md mb-4">
            {error}
          </p>
        ) : (
          <>
            {user ? (
              <div className="text-center">
                <p className="text-lg font-medium text-gray-800">
                  Welcome, {user.username}
                </p>
                <p className="text-sm text-gray-600 mb-6">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <p className="text-gray-600 text-center">No user data available.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
