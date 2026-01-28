import { Router } from 'express';
import { User } from '../models/User';
import { authorizeRoles } from '../middleware/auth';
import { Op } from 'sequelize';
import { cacheGet, cacheSet, cacheDelete, cacheInvalidatePattern } from '../config/redis';

const router = Router();

// Get all users (admin only)
router.get('/', authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;

    // Create cache key based on parameters
    const cacheKey = `users:${page}:${limit}:${search || 'none'}:${role || 'none'}`;
    
    // Try to get from cache first
    const cachedResult = await cacheGet(cacheKey);
    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }

    // Build where clause for filtering
    const whereClause: any = {};
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (role) {
      whereClause.role = role;
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit as string),
      offset: (parseInt(page as string) - 1) * parseInt(limit as string),
      attributes: { exclude: ['password'] }, // Don't return passwords
      order: [['createdAt', 'DESC']]
    });

    const result = {
      users: users.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: users.count,
        pages: Math.ceil(users.count / parseInt(limit as string))
      }
    };

    // Cache the result for 5 minutes
    await cacheSet(cacheKey, JSON.stringify(result), 300);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;

    // Try to get from cache first
    const cacheKey = `user:${id}`;
    const cachedUser = await cacheGet(cacheKey);
    if (cachedUser) {
      return res.json({ user: JSON.parse(cachedUser) });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cache the user for 10 minutes
    await cacheSet(cacheKey, JSON.stringify(user), 600);

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user
router.put('/:id', authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    await user.update({
      firstName,
      lastName,
      email,
      role,
      isActive
    });

    // Invalidate user cache
    await cacheDelete(`user:${id}`);
    
    // Invalidate related cache patterns
    await cacheInvalidatePattern('users:*');

    return res.json({ message: 'User updated successfully', user });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Deactivate user (soft delete)
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Instead of deleting, we deactivate the user
    await user.update({ isActive: false });

    // Invalidate user cache
    await cacheDelete(`user:${id}`);
    
    // Invalidate related cache patterns
    await cacheInvalidatePattern('users:*');

    return res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;