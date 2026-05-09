import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

type LoginRole = "student" | "teacher" | "admin";

type HardcodedUser = {
  id: string;
  email: string;
  password: string;
  role: LoginRole;
  name: string;
};

const HARDCODED_USERS: HardcodedUser[] = [
  {
    id: "66b0f6a10100000000000001",
    email: "student@klh.edu",
    password: "1234",
    role: "student",
    name: "Student User",
  },
  {
    id: "66b0f6a10100000000000002",
    email: "faculty@test.com",
    password: "1234",
    role: "teacher",
    name: "Faculty User",
  },
  {
    id: "66b0f6a10100000000000003",
    email: "admin@test.com",
    password: "1234",
    role: "admin",
    name: "Admin User",
  },
];

const roleLabelMap: Record<LoginRole, string> = {
  student: "Student",
  teacher: "Faculty",
  admin: "Admin",
};

const roleHomeRouteMap: Record<LoginRole, string> = {
  student: "/student",
  teacher: "/faculty",
  admin: "/admin",
};

const roleCredentialHintMap: Record<LoginRole, { email: string; password: string }> = {
  student: { email: "student@klh.edu", password: "1234" },
  teacher: { email: "faculty@test.com", password: "1234" },
  admin: { email: "admin@test.com", password: "1234" },
};

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<LoginRole>("student");
  const selectedCredentialHint = roleCredentialHintMap[role];

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("userRole") as LoginRole | null;

    if (token && storedRole && roleHomeRouteMap[storedRole]) {
      navigate(roleHomeRouteMap[storedRole], { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = HARDCODED_USERS.find(
      (user) => user.email === normalizedEmail && user.password === password && user.role === role
    );

    if (!matchedUser) {
      toast.error(`Invalid ${roleLabelMap[role]} login. Use the correct ${roleLabelMap[role]} account.`);
      setIsLoading(false);
      return;
    }

    const profile = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    };

    localStorage.setItem("authToken", "dummy-auth-token");
    localStorage.setItem("userProfile", JSON.stringify(profile));
    localStorage.setItem("userEmail", profile.email);
    localStorage.setItem("userRole", profile.role);
    localStorage.setItem("userName", profile.name);
    localStorage.setItem("userId", profile.id);

    toast.success(`Welcome ${roleLabelMap[profile.role]}!`);
    setIsLoading(false);
    navigate(roleHomeRouteMap[profile.role]);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/KLH-Aziznagar.jpeg')" }}
    >
  <div className="absolute inset-0 bg-black/50" />

  <Card className="w-full max-w-md relative z-10 shadow-2xl border border-white/30 bg-white/30 backdrop-blur text-white">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smart Campus
            </CardTitle>
            <CardDescription className="text-base mt-2 text-white/80">
              Your all-in-one campus ecosystem
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-black font-bold">Email</Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                placeholder={selectedCredentialHint.email}
                className="text-black font-semibold placeholder:text-gray-600 bg-white/80 border-white/40"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-black font-bold">Password</Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                placeholder={selectedCredentialHint.password}
                className="text-black font-semibold placeholder:text-gray-600 bg-white/80 border-white/40"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-role" className="text-black font-bold">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as LoginRole)} required>
                <SelectTrigger id="login-role" className="bg-white/80 text-black font-semibold border-white/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Faculty</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-black/90 font-semibold">
              Selected role: {roleLabelMap[role]} | Use: {selectedCredentialHint.email}
            </p>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
