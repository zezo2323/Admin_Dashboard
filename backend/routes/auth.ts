import { Router } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

// Type assertion to ensure JWT_SECRET is not undefined
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const router = Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user data without password
    const { password: _, ...userData } = user.toJSON();
    return res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Validate input
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email },
          { username }
        ]
      } 
    });
    
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email or username already exists' });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role: 'user' // Default role
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user data without password
    const { password: _, ...userData } = user.toJSON();
    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: userData
    });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    // This route is protected by authenticateToken middleware
    // The user object is attached to the request by the middleware
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access token is required' });
    }

    // Verify token to get user ID
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    
    // Find user by ID
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;