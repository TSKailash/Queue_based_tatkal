import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tatkal_secret";
const JWT_EXPIRY = "1h";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
