import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const CURRENT_USER_QUERY_KEY = ["current-user"] as const;

export const useAuth = () => {
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const userRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  useEffect(() => {
    if (!token) {
      navigate("/auth", { replace: true });
    }
  }, [token, navigate]);

  const query = useQuery({
    queryKey: [...CURRENT_USER_QUERY_KEY, userRole, userEmail],
    queryFn: () => api.get<UserProfile>("/api/user/me"),
    enabled: Boolean(token && userRole && userEmail),
    retry: (failureCount, error) => {
      if ((error as { status?: number })?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userProfile");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        navigate("/auth", { replace: true });
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5,
  });

  return query;
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin" | string;
  profilePic?: string;
  roleDetails?: Record<string, unknown> | null;
}
