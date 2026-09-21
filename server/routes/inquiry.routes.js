// server/routes/inquiry.routes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateInquiry } = require('../middleware/validate');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/inquiries (Public: clients submit project proposals)
router.post('/', validateInquiry, async (req, res, next) => {
  try {
    const { clientName, email, company, serviceType, budget, timeline, details } = req.body;

    // Check if token was optionally passed in Authorization header
    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        userId = decoded.id;
      } catch (err) {
        // Continue as anonymous client if token is invalid
      }
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        clientName: clientName.trim(),
        email: email.trim().toLowerCase(),
        company: company ? company.trim() : null,
        serviceType,
        budget,
        timeline,
        details: details.trim(),
        status: 'PENDING',
        userId
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your project inquiry has been received. Our team will contact you within 24 hours.',
      data: { inquiry }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/inquiries (Protected: Admin sees all; Client sees their own)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    let inquiries;
    if (req.user.role === 'ADMIN') {
      inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } }
      });
    } else {
      inquiries = await prisma.inquiry.findMany({
        where: {
          OR: [
            { userId: req.user.id },
            { email: req.user.email }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json({
      success: true,
      count: inquiries.length,
      data: { inquiries }
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/inquiries/:id/status (Protected: Admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['PENDING', 'IN_REVIEW', 'ACCEPTED', 'REJECTED'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
      });
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status }
    });

    res.json({
      success: true,
      message: `Inquiry status updated to ${status}.`,
      data: { inquiry: updated }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/inquiries/:id (Protected: Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.inquiry.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Inquiry deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
