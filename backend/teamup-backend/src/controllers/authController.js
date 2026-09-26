import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// POST /auth/register
export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({ token, user: user.toJSON() });
}

// POST /auth/login
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
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
  const user = await User.findOne({ email });

  // Always respond the same way whether or not the user exists,
  // so this endpoint can't be used to check which emails are registered.
  if (!user) {
    return res.json({ message: 'If that account exists, a reset link has been sent' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save();

  // In production, email `resetToken` to the user instead of logging it.
  console.log(`Password reset token for ${email}: ${resetToken}`);

  res.json({ message: 'If that account exists, a reset link has been sent' });
}

// POST /auth/reset-password
export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
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
