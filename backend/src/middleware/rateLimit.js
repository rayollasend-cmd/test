// src/middleware/rateLimit.js - Rate limiting middleware using token bucket algorithm

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
      message: 'Too many requests, please try again later',
      retryAfter: Math.ceil(windowMs / 1000)
    });
  }

  next();
};

export default rateLimiter;
