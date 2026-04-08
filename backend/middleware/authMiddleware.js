const DUMMY_USERS = [
  {
    id: "66b0f6a10100000000000001",
    name: "Student User",
    email: "student@klh.edu",
    role: "student",
  },
  {
    id: "66b0f6a10100000000000002",
    name: "Faculty User",
    email: "faculty@test.com",
    role: "teacher",
  },
  {
    id: "66b0f6a10100000000000003",
    name: "Admin User",
    email: "admin@test.com",
    role: "admin",
  },
];

/**
 * Reads dummy auth identity from request headers and attaches req.user.
 */
export const authenticate = async (req, res, next) => {
  const roleHeader = req.headers["x-user-role"];
  const emailHeader = req.headers["x-user-email"];
  const nameHeader = req.headers["x-user-name"];
  const idHeader = req.headers["x-user-id"];

  const role = typeof roleHeader === "string" ? roleHeader.toLowerCase() : "";
  const email = typeof emailHeader === "string" ? emailHeader.toLowerCase() : "";

  if (!role || !email) {
    return res.status(401).json({ success: false, message: "Unauthorized", data: null });
  }

  const matchedUser = DUMMY_USERS.find((user) => user.email === email && user.role === role);

  if (!matchedUser) {
    return res.status(401).json({ success: false, message: "Unauthorized", data: null });
  }

  req.user = {
    id: typeof idHeader === "string" && idHeader.trim() ? idHeader.trim() : matchedUser.id,
    name: typeof nameHeader === "string" && nameHeader.trim() ? nameHeader.trim() : matchedUser.name,
    email,
    role: matchedUser.role,
  };

  return next();
};
