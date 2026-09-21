// server/middleware/validate.js

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validateInquiry(req, res, next) {
  const { clientName, email, serviceType, budget, timeline, details } = req.body;
  const errors = [];

  if (!clientName || clientName.trim().length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }

  if (!email || !validateEmail(email)) {
    errors.push('Please provide a valid email address.');
  }

  if (!serviceType || serviceType.trim().length === 0) {
    errors.push('Please select a service type.');
  }

  if (!budget || budget.trim().length === 0) {
    errors.push('Please specify an estimated budget.');
  }

  if (!timeline || timeline.trim().length === 0) {
    errors.push('Please specify an expected timeline.');
  }

  if (!details || details.trim().length < 10) {
    errors.push('Project details must be at least 10 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors
    });
  }

  next();
}

function validateAuth(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !validateEmail(email)) {
    errors.push('A valid email address is required.');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors
    });
  }

  next();
}

module.exports = {
  validateInquiry,
  validateAuth
};
