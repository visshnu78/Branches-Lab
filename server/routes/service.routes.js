// server/routes/service.routes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/services (Public: with optional category and search query filters)
router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const where = {};

    if (category && category !== 'ALL') {
      where.category = category.toUpperCase();
    }

    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } }
      ];
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { createdAt: 'asc' }
    });

    res.json({
      success: true,
      count: services.length,
      data: { services }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/services (Protected: Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { title, slug, category, description, icon, featured } = req.body;

    if (!title || !slug || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, slug, category, and description are required.'
      });
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        category: category.toUpperCase(),
        description,
        icon: icon || '💡',
        featured: Boolean(featured)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: { service }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/services/:id (Protected: Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, category, description, icon, featured } = req.body;

    const updated = await prisma.service.update({
      where: { id },
      data: {
        title,
        slug,
        category: category ? category.toUpperCase() : undefined,
        description,
        icon,
        featured: featured !== undefined ? Boolean(featured) : undefined
      }
    });

    res.json({
      success: true,
      message: 'Service updated successfully.',
      data: { service: updated }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/services/:id (Protected: Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Service deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
