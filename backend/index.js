import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

//  Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

//  User Schema & Model
const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: { type: String, unique: true },
  address: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

//  Authentication Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized access" });
    req.user = decoded;
    next();
  });
};

//  Register API
app.post("/api/auth/register", async (req, res) => {
  console.log("⚡ Register API hit", req.body);

  const { name, mobile, email, address, password } = req.body;

  try {
    if (!name || !mobile || !email || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, mobile, email, address, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "🎉 Registration successful" });
  } catch (error) {
    console.error(" Error during registration:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

//  Login API
app.post("/api/auth/login", async (req, res) => {
  console.log("⚡ Login API hit", req.body);

  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: " Login successful", token });
  } catch (error) {
    console.error(" Error during login:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

//  Protected Route Example
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: " This is a protected route", user: req.user });
});

//  Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
