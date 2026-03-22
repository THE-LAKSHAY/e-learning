import mongodb from "./mongodbconnection.js";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userSchema from "./schemas/Users.js";
import testDriveSchema from "./schemas/TestDriveSchema.js";
import bookingSchema from "./schemas/Bookingschema.js";
import enrollmentSchema from "./schemas/EnrollmentSchema.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

/* ═══════════════════════════════════════
   DATABASE
═══════════════════════════════════════ */
mongodb();

/* ═══════════════════════════════════════
   MODELS
═══════════════════════════════════════ */
const User       = mongoose.model("User",       userSchema);
const TestDrive  = mongoose.model("testdrive",  testDriveSchema);
const Booking    = mongoose.model("Bookings",   bookingSchema);
const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

/* ═══════════════════════════════════════
   JWT SECRET
═══════════════════════════════════════ */
const JWT_SECRET = process.env.JWT_SECRET || "learnify_super_secret_2025_change_in_prod";

/* ═══════════════════════════════════════
   MIDDLEWARE — protect routes with JWT
═══════════════════════════════════════ */
const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* Admin-only guard */
const adminMiddleware = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

/* ═══════════════════════════════════════
   PAYMENT OTP SYSTEM
   (used in PaymentGateway → OTPVerification)
═══════════════════════════════════════ */
let otpStore = {};   // { email: { otp, expiresAt } }

app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER || "lakshayyadav0014@gmail.com",
        pass: process.env.MAIL_PASS || "icwkytabivjlirct",
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER || "lakshayyadav0014@gmail.com",
      to: email,
      subject: "Learnify — Payment OTP Verification",
      html: `
        <div style="font-family:sans-serif;max-width:420px;margin:auto;padding:32px;
                    background:#0f1117;color:#eeedf6;border-radius:12px;">
          <h2 style="color:#f5c842;margin-bottom:8px;">Learnify</h2>
          <p style="color:#8b8ba8;margin-bottom:24px;">Your one-time payment verification code:</p>
          <div style="font-size:36px;font-weight:700;letter-spacing:12px;
                      text-align:center;padding:20px;background:#1a1d2e;
                      border-radius:8px;color:#f5c842;">${otp}</div>
          <p style="color:#8b8ba8;font-size:12px;margin-top:20px;">
            This code expires in <strong>5 minutes</strong>. Do not share it.
          </p>
        </div>`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("MAIL ERROR:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];
  if (!record) return res.json({ success: false, message: "No OTP found for this email" });
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.json({ success: false, message: "OTP expired" });
  }
  if (otp === record.otp) {
    delete otpStore[email];
    return res.json({ success: true });
  }
  return res.json({ success: false, message: "Invalid OTP" });
});

/* ═══════════════════════════════════════
   AUTH OTP SYSTEM
   (used in AuthPage login/signup flow)
═══════════════════════════════════════ */
let authOtpStore = {};   // separate from payment OTP

/* Check if email already exists — for signup pre-validation */
app.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ exists: false });
    const user = await User.findOne({ email: email.toLowerCase() });
    res.json({ exists: !!user });
  } catch {
    res.status(500).json({ exists: false });
  }
});

/* Check credentials before sending OTP — for login pre-validation */
app.post("/check-credentials", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ valid: false, message: "Email and password required." });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ valid: false, message: "No account found with this email." });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ valid: false, message: "Incorrect password." });
    }
    res.json({ valid: true });
  } catch {
    res.status(500).json({ valid: false, message: "Server error." });
  }
});

/* Send auth OTP to email */
app.post("/send-auth-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    authOtpStore[email.toLowerCase()] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,   // 5 minutes
    };

    console.log(`Auth OTP for ${email}: ${otp}`);   // for testing in terminal

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER || "lakshayyadav0014@gmail.com",
        pass: process.env.MAIL_PASS || "icwkytabivjlirct",
      },
    });

    await transporter.sendMail({
      from:    process.env.MAIL_USER || "lakshayyadav0014@gmail.com",
      to:      email,
      subject: "Learnify — Your Login Verification Code",
      html: `
        <div style="font-family:sans-serif;max-width:440px;margin:auto;
                    background:#0a0a08;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#e8c84a,#e05c2a);
                      padding:24px 32px;">
            <h1 style="color:#0a0a08;margin:0;font-size:28px;
                       font-family:sans-serif;letter-spacing:3px;font-weight:900;">
              LEARNIFY
            </h1>
          </div>
          <div style="padding:32px;">
            <p style="color:#a0998a;font-size:13px;margin-bottom:8px;
                      text-transform:uppercase;letter-spacing:2px;">
              Email Verification
            </p>
            <p style="color:#f0ede4;font-size:16px;margin-bottom:28px;line-height:1.6;">
              Use this code to verify your identity and access your Learnify account.
            </p>
            <div style="background:#1a1a14;border:1px solid rgba(232,200,74,0.20);
                        border-radius:14px;padding:28px;text-align:center;
                        margin-bottom:24px;">
              <p style="color:#a0998a;font-size:11px;letter-spacing:3px;
                        text-transform:uppercase;margin-bottom:14px;margin-top:0;">
                Your verification code
              </p>
              <div style="font-size:44px;font-weight:800;letter-spacing:18px;
                          color:#e8c84a;font-family:monospace;line-height:1;">
                ${otp}
              </div>
            </div>
            <p style="color:#6b6460;font-size:12px;line-height:1.8;text-align:center;margin:0;">
              This code expires in <strong style="color:#a0998a;">5 minutes</strong>.<br/>
              Never share this code with anyone — Learnify will never ask for it.
            </p>
          </div>
          <div style="border-top:1px solid #1a1a14;padding:16px 32px;text-align:center;">
            <p style="color:#4a443e;font-size:11px;margin:0;">
              © 2025 Learnify · If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Auth OTP send error:", error);
    res.status(500).json({ message: "Failed to send OTP. Check your email settings." });
  }
});

/* Verify auth OTP */
app.post("/verify-auth-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = authOtpStore[email?.toLowerCase()];

  if (!record) {
    return res.json({ success: false, message: "No OTP found. Please request a new one." });
  }
  if (Date.now() > record.expiresAt) {
    delete authOtpStore[email.toLowerCase()];
    return res.json({ success: false, message: "OTP has expired. Please request a new one." });
  }
  if (otp !== record.otp) {
    return res.json({ success: false, message: "Incorrect code. Please try again." });
  }

  delete authOtpStore[email.toLowerCase()];
  res.json({ success: true });
});

/* ═══════════════════════════════════════
   REGISTER
═══════════════════════════════════════ */
app.post("/register", async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName: fullName.trim(),
      phone,
      email: email.toLowerCase().trim(),
      password: hashed,
      isAdmin: false,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, fullName: user.fullName, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, phone: user.phone, isAdmin: user.isAdmin },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Error creating account" });
  }
});

/* ═══════════════════════════════════════
   LOGIN
═══════════════════════════════════════ */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, fullName: user.fullName, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, phone: user.phone, isAdmin: user.isAdmin },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════
   ADMIN LOGIN
═══════════════════════════════════════ */
app.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), isAdmin: true });
    if (!user) {
      return res.status(401).json({ message: "Not an admin account" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, fullName: user.fullName, isAdmin: true },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, isAdmin: true },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════
   SEED ADMIN
═══════════════════════════════════════ */
app.post("/seed-admin", async (req, res) => {
  try {
    const { secret } = req.body;
    if (secret !== "learnify2025") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const exists = await User.findOne({ email: "admin@learnify.com" });
    if (exists) {
      return res.json({ message: "Admin already exists" });
    }

    const hashed = await bcrypt.hash("Admin@1234", 12);
    await User.create({
      fullName: "Administrator",
      phone: "0000000000",
      email: "admin@learnify.com",
      password: hashed,
      isAdmin: true,
    });

    res.json({
      message: "Admin created!",
      credentials: { email: "admin@learnify.com", password: "Admin@1234" },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin" });
  }
});

/* ═══════════════════════════════════════
   GET LOGGED-IN USER PROFILE
═══════════════════════════════════════ */
app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════
   ENROLLMENTS
═══════════════════════════════════════ */
app.post("/enrollments", authMiddleware, async (req, res) => {
  try {
    const { courseTitle, courseImage, price, paidAmount, paymentMethod, tech, level } = req.body;

    const already = await Enrollment.findOne({ userId: req.user.id, courseTitle });
    if (already) {
      return res.status(409).json({ message: "Already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      userId:        req.user.id,
      userEmail:     req.user.email,
      userName:      req.user.fullName,
      courseTitle,
      courseImage,
      price,
      paidAmount,
      paymentMethod,
      tech,
      level,
      progress:      0,
      status:        "active",
    });

    res.status(201).json({ message: "Enrollment saved", enrollment });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Error saving enrollment" });
  }
});

app.get("/enrollments/my", authMiddleware, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(enrollments);
  } catch {
    res.status(500).json({ message: "Error fetching enrollments" });
  }
});

/* ═══════════════════════════════════════
   TEST DRIVES
═══════════════════════════════════════ */
app.post("/book-testdrive", async (req, res) => {
  try {
    const newBooking = new TestDrive(req.body);
    await newBooking.save();
    res.status(201).json({ message: "Test drive booked successfully", data: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Error booking test drive", error: error.message });
  }
});

app.get("/testdrives/:email", async (req, res) => {
  try {
    const bookings = await TestDrive.find({ email: req.params.email });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching test drives", error: error.message });
  }
});

/* ═══════════════════════════════════════
   BOOKINGS
═══════════════════════════════════════ */
app.get("/fetchbooking/:email", async (req, res) => {
  try {
    const bookings = await Booking.find({ "customer.email": req.params.email });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
});

app.post("/Booking", async (req, res) => {
  try {
    const { car, customer, bookingPeriod } = req.body;
    const newBooking = new Booking({ car, customer, bookingPeriod });
    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
});

/* ═══════════════════════════════════════
   ADMIN ROUTES
═══════════════════════════════════════ */
app.get("/admin/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch {
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.get("/admin/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [totalUsers, totalEnrollments, totalBookings, totalTestDrives] = await Promise.all([
      User.countDocuments({ isAdmin: false }),
      Enrollment.countDocuments(),
      Booking.countDocuments(),
      TestDrive.countDocuments(),
    ]);

    const revenueAgg = await Enrollment.aggregate([
      { $group: { _id: null, total: { $sum: "$paidAmount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyEnrollments = await Enrollment.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const coursePop = await Enrollment.aggregate([
      { $group: { _id: "$courseTitle", students: { $sum: 1 }, revenue: { $sum: "$paidAmount" } } },
      { $sort: { students: -1 } },
    ]);

    res.json({
      totalUsers,
      totalEnrollments,
      totalBookings,
      totalTestDrives,
      totalRevenue,
      dailyEnrollments,
      coursePop,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

app.get("/admin/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Enrollment.find().sort({ createdAt: -1 }).limit(100);
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

app.delete("/admin/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting user" });
  }
});

/* ═══════════════════════════════════════
   SERVER
═══════════════════════════════════════ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`
  ─────────────────────────────────────
  To create admin, run this once:
  POST http://localhost:${PORT}/seed-admin
  Body: { "secret": "learnify2025" }

  Admin credentials:
  Email:    admin@learnify.com
  Password: Admin@1234
  ─────────────────────────────────────
  `);
});