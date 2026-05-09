import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const CURRENT_USER_QUERY_KEY = ["current-user"] as const;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin" | string;
  profilePic?: string;
  roleDetails?: Record<string, unknown> | null;
}

export const useAuth = () => {
  const navigate = useNavigate();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("authToken")
      : null;

  useEffect(() => {
    if (!token) {
      navigate("/auth", { replace: true });
    }
  }, [token, navigate]);

  const profile =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userProfile") || "null")
      : null;

  return {
    data: profile,
    isLoading: false,
    error: null,
  };
};