import 'dotenv/config.js';

import User from '../models/User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import validateImage from '../utils/validateImage.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const transporter = nodemailer.createTransport({
  // host: process.env.SMTP_HOST,
  // port: process.env.SMTP_PORT,
  // secure: false, // true for 465, false for other ports
  service: "gmail", // e.g., 'gmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASS,
  },
});



// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const upload = multer({ storage }).single('profilePicture');

export const register = async (req, res) => {
  try {
    // Multer handles file upload
    const { name, email, password } = req.body;
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }
    // Validate image if uploaded
    let profilePicturePath = '';
    if (req.file) {
      const imageError = validateImage(req.file);
      if (imageError) {
        // Remove uploaded file if invalid
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: imageError });
      }
      profilePicturePath = `/uploads/${req.file.filename}`;
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate email verification token
    const emailToken = crypto.randomBytes(32).toString('hex');
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      profilePicture: profilePicturePath,
      emailToken,
      isVerified: false,
    });
    await user.save();
    // Send verification email
    try {
      const verifyUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${emailToken}&email=${email}`;
      transporter.sendMail({
        from: `"Brain Inventory" <${process.env.EMAIL_HOST}>`,
        to: email,
        subject: "Verify your account",
        html: `<p>Hello ${name},</p><p>Please verify your account by clicking <a href="${verifyUrl}">here</a>.</p>`
      });
      res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr);
      console.log('SMTP_USER:', process.env.SMTP_USER);
      console.log('SMTP_PASS:', process.env.SMTP_PASS);

      res.status(201).json({ message: 'User registered, but verification email could not be sent.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const verifyEmail = async (req, res) => {
  const { token, email } = req.query;
  if (!token || !email) {
    return res.status(400).json({ message: 'Invalid verification link.' });
  }
  try {
    const user = await User.findOne({ email, emailToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }
    user.isVerified = true;
    user.emailToken = undefined;
    await user.save();
    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};