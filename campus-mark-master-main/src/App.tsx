import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import LostFound from "./pages/LostFound";
import Feedback from "./pages/Feedback";
import Clubs from "./pages/Clubs";
import Resources from "./pages/Resources";
import Polls from "./pages/Polls";
import Announcements from "./pages/Announcements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const roleHomeRouteMap: Record<"student" | "teacher" | "admin", string> = {
  student: "/student",
  teacher: "/faculty",
  admin: "/admin",
};

const getRoleHomeRoute = (role: string | null) => {
  if (!role) {
    return "/auth";
  }

  return roleHomeRouteMap[role as "student" | "teacher" | "admin"] ?? "/auth";
};

const ProtectedRoute = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

const RoleProtectedRoute = ({ allowedRoles }: { allowedRoles: Array<"student" | "teacher" | "admin"> }) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

  if (!token || !role) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(role as "student" | "teacher" | "admin")) {
    return <Navigate to={getRoleHomeRoute(role)} replace />;
  }

  return <Outlet />;
};

const RoleHomeRedirect = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return <Navigate to={getRoleHomeRoute(role)} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<RoleHomeRedirect />} />
            <Route path="/events" element={<Events />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/polls" element={<Polls />} />
            <Route path="/announcements" element={<Announcements />} />
          </Route>
          <Route element={<RoleProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student" element={<Dashboard />} />
          </Route>
          <Route element={<RoleProtectedRoute allowedRoles={["teacher"]} />}>
            <Route path="/faculty" element={<Dashboard />} />
          </Route>
          <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<Dashboard />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
