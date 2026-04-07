import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/email.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate 6 digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      isVerified: false
    });

    const emailSent = await sendVerificationEmail(email, verificationCode);
    
    if (!emailSent) {
      // We could optionally delete the user here, but leaving it allows retry logic if implemented later.
      console.error("Failed to send verification email to:", email);
    }

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      emailSent
    });

  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// VERIFY EMAIL
export async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = "";
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify Email Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// LOGIN
export async function login(req, res) {
  try {
    console.log("Login request received with body:", req.body);
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // console.log(JWT_SECRET);
    
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Signed");

    return res.json({
      token
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
