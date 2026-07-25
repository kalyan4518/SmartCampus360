import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Events = lazy(() => import("./pages/Events"));
const LostFound = lazy(() => import("./pages/LostFound"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Clubs = lazy(() => import("./pages/Clubs"));
const Resources = lazy(() => import("./pages/Resources"));
const Polls = lazy(() => import("./pages/Polls"));
const Announcements = lazy(() => import("./pages/Announcements"));
const NotFound = lazy(() => import("./pages/NotFound"));

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

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <p className="text-sm text-muted-foreground">Loading page…</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Suspense fallback={<RouteLoader />}>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
