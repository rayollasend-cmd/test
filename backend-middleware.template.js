// src/middleware/ - Key middleware functions

// ============ AUTHENTICATE MIDDLEWARE ============
// middleware/authenticate.js
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided'
    });
  }

  try {
    // Verify JWT token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token'
    });
  }
};

// ============ ERROR HANDLER MIDDLEWARE ============
// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// ============ RATE LIMIT MIDDLEWARE ============
// middleware/rateLimit.js
const requestCounts = new Map();

export const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000; // 15 minutes
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const timestamps = requestCounts.get(ip);
  const validTimestamps = timestamps.filter(t => now - t < windowMs);
  validTimestamps.push(now);
  requestCounts.set(ip, validTimestamps);

  if (validTimestamps.length > maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later'
    });
  }

  next();
};

// ============ VALIDATE REQUEST MIDDLEWARE ============
// middleware/validateRequest.js
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    req.validatedBody = value;
    next();
  };
};

// ============ AUTHORIZE MIDDLEWARE ============
// middleware/authorize.js
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient permissions'
      });
    }

    next();
  };
};
