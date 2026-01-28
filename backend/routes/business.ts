import { Router } from 'express';
import { BusinessEntity } from '../models/BusinessEntity';
import { User } from '../models/User';
import { authorizeRoles } from '../middleware/auth';
import { Op } from 'sequelize';
import { cacheGet, cacheSet, cacheDelete, cacheInvalidatePattern } from '../config/redis';

const router = Router();

// Get all business entities
router.get('/', authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    // Create cache key based on parameters
    const cacheKey = `business:${page}:${limit}:${search || 'none'}:${status || 'none'}`;
    
    // Try to get from cache first
    const cachedResult = await cacheGet(cacheKey);
    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }

    // Build where clause for filtering
    const whereClause: any = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status) {
      whereClause.status = status;
    }

    const entities = await BusinessEntity.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit as string),
      offset: (parseInt(page as string) - 1) * parseInt(limit as string),
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'email'],
        // Optimize by only including necessary fields
      }],
      order: [['createdAt', 'DESC']]
    });

    const result = {
      data: entities.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: entities.count,
        pages: Math.ceil(entities.count / parseInt(limit as string))
      }
    };

    // Cache the result for 5 minutes
    await cacheSet(cacheKey, JSON.stringify(result), 300);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get business entity by ID
router.get('/:id', authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;

    // Try to get from cache first
    const cacheKey = `business:${id}`;
    const cachedEntity = await cacheGet(cacheKey);
    if (cachedEntity) {
      return res.json({ entity: JSON.parse(cachedEntity) });
    }

    const entity = await BusinessEntity.findByPk(id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    if (!entity) {
      return res.status(404).json({ message: 'Business entity not found' });
    }

    // Cache the entity for 10 minutes
    await cacheSet(cacheKey, JSON.stringify(entity), 600);

    return res.json({ entity });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Create business entity
router.post('/', authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { name, description, status, value } = req.body;
    const userId = (req as any).user.id; // Get user ID from authenticated request

    const entity = await BusinessEntity.create({
      name,
      description,
      status: status || 'pending',
      value: value || 0,
      ownerId: userId
    });

    // Populate the owner relationship for the response
    await entity.reload({
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    // Invalidate related cache patterns
    await cacheInvalidatePattern('business:*');

    return res.status(201).json({ message: 'Business entity created successfully', entity });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update business entity
router.put('/:id', authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, value } = req.body;

    const entity = await BusinessEntity.findByPk(id);
    if (!entity) {
      return res.status(404).json({ message: 'Business entity not found' });
    }

    await entity.update({
      name,
      description,
      status,
      value
    });

    // Populate the owner relationship for the response
    await entity.reload({
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    // Invalidate entity cache
    await cacheDelete(`business:${id}`);
    
    // Invalidate related cache patterns
    await cacheInvalidatePattern('business:*');

    return res.json({ message: 'Business entity updated successfully', entity });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete business entity
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const entity = await BusinessEntity.findByPk(id);
    if (!entity) {
      return res.status(404).json({ message: 'Business entity not found' });
    }

    await entity.destroy();

    // Invalidate entity cache
    await cacheDelete(`business:${id}`);
    
    // Invalidate related cache patterns
    await cacheInvalidatePattern('business:*');

    return res.json({ message: 'Business entity deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;