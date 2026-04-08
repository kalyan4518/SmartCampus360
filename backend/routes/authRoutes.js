import { Router } from "express";

const router = Router();

const DUMMY_USERS = [
  { id: "66b0f6a10100000000000001", email: "student@klh.edu", password: "1234", role: "student", name: "Student User" },
  { id: "66b0f6a10100000000000002", email: "faculty@test.com", password: "1234", role: "teacher", name: "Faculty User" },
  { id: "66b0f6a10100000000000003", email: "admin@test.com", password: "1234", role: "admin", name: "Admin User" },
];

router.post("/login", (req, res) => {
  const email = req.body?.email?.toString().trim().toLowerCase();
  const password = req.body?.password?.toString().trim();
  const role = req.body?.role?.toString().trim().toLowerCase();

  const matchedUser = DUMMY_USERS.find(
    (user) => user.email === email && user.password === password && user.role === role
  );

  if (!matchedUser) {
    return res.status(401).json({ success: false, message: "Invalid credentials", data: null });
  }

  return res.status(200).json({
    success: true,
    message: "Dummy login successful",
    data: {
      token: "dummy-auth-token",
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
      },
    },
  });
});

router.post("/logout", (req, res) => {
  return res.status(200).json({ success: true, message: "Dummy logout successful", data: null });
});

export default router;
