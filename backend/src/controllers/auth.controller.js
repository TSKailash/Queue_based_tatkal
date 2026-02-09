import { signToken } from "../utils/jwt.js";

export function login(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId required" });
  }

  const token = signToken({ userId });

  return res.json({
    token,
  });
}
