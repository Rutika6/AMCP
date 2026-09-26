import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) =>
  typeof password === 'string' && /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);

// POST /auth/register
export async function register(req, res) {
  const { name, email, password } = req.body;

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ message: 'Name is required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Enter a valid email address' });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({ message: 'Password must be 8+ characters and include a letter and a number' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
  const token = generateToken(user._id);

  res.status(201).json({ token, user: user.toJSON() });
}

// POST /auth/login
export async function login(req, res) {
  const { email, password } = req.body;

  if (!isValidEmail(email) || typeof password !== 'string' || !password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user._id);
  const safeUser = user.toObject();
  delete safeUser.password;

  res.json({ token, user: { ...safeUser, id: user._id } });
}

// POST /auth/forgot-password
export async function forgotPassword(req, res) {
  const { email } = req.body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const user = isValidEmail(normalizedEmail)
    ? await User.findOne({ email: normalizedEmail })
    : null;

  // Always respond the same way whether or not the user exists,
  // so this endpoint can't be used to check which emails are registered.
  if (!user) {
    return res.json({ message: 'If that account exists, a reset link has been sent' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save();

  // Replace this with an email provider in production. Keeping the reset URL in
  // the development log lets the existing reset flow be tested locally.
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  console.log(`Password reset URL for ${normalizedEmail}: ${clientUrl}/reset-password?token=${resetToken}`);

  res.json({ message: 'If that account exists, a reset link has been sent' });
}

// POST /auth/reset-password
export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  if (typeof token !== 'string' || !isValidPassword(newPassword)) {
    return res.status(400).json({ message: 'Password must be 8+ characters and include a letter and a number' });
  }
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    return res.status(400).json({ message: 'Reset link is invalid or has expired' });
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password has been reset, you can now log in' });
}
