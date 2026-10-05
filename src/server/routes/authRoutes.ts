import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database/db.ts';
import { generateToken, requireAuth, AuthenticatedRequest } from '../auth.ts';
import { User } from '../database/types.ts';

export const authRouter = Router();

// Customer or Staff Login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    // Don't return password hash
    const { passwordHash, ...userSafe } = user;

    res.json({
      token,
      user: userSafe
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Customer Registration
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: 'customer',
      phone: phone?.trim(),
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.createUser(newUser);
    const token = generateToken(newUser);
    const { passwordHash: _, ...userSafe } = newUser;

    res.status(201).json({
      token,
      user: userSafe,
      message: 'Account created successfully!'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// Get current user profile
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { passwordHash, ...userSafe } = req.user;
  res.json({ user: userSafe });
});

// Update profile & addresses
authRouter.put('/profile', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { name, phone, addresses, newPassword } = req.body;
  const updates: Partial<User> = {};

  if (name) updates.name = name.trim();
  if (phone !== undefined) updates.phone = phone.trim();
  if (addresses) updates.addresses = addresses;

  if (newPassword && newPassword.length >= 6) {
    updates.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  const updated = db.updateUser(req.user.id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { passwordHash, ...userSafe } = updated;
  res.json({ user: userSafe, message: 'Profile updated successfully.' });
});

// Forgot password simulation
authRouter.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  // Always return friendly response for security
  res.json({
    message: 'If an account exists with that email, a password reset link has been dispatched to your inbox.'
  });
});
