// Rate Limiting Middleware
// Prevents brute force attacks, spam, and DDoS attempts

const requestCounts = new Map();
const suspiciousIPs = new Set();

/**
 * General rate limiter for API endpoints
 * Limits requests per IP to prevent abuse
 */
export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const requests = requestCounts.get(ip);
    
    // Remove old requests outside the window
    const validRequests = requests.filter((time) => now - time < windowMs);
    requestCounts.set(ip, validRequests);

    if (validRequests.length >= maxRequests) {
      suspiciousIPs.add(ip);
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    validRequests.push(now);
    next();
  };
};

/**
 * Strict rate limiter for sensitive operations
 * (login, register, password reset)
 */
export const strictRateLimit = (maxRequests = 5, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const identifier = `${ip}:${req.originalUrl || req.path}`;
    const now = Date.now();

    if (!requestCounts.has(identifier)) {
      requestCounts.set(identifier, []);
    }

    const requests = requestCounts.get(identifier);
    const validRequests = requests.filter((time) => now - time < windowMs);
    requestCounts.set(identifier, validRequests);

    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        message: "Too many attempts. Please try again later.",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    validRequests.push(now);
    next();
  };
};

/**
 * Rate limiter for file uploads
 */
export const uploadRateLimit = (maxUploads = 10, windowMs = 60 * 60 * 1000) => {
  return (req, res, next) => {
    const userId = req.user?._id || req.ip;
    const now = Date.now();
    
    const key = `upload:${userId}`;
    if (!requestCounts.has(key)) {
      requestCounts.set(key, []);
    }

    const uploads = requestCounts.get(key);
    const validUploads = uploads.filter((time) => now - time < windowMs);
    requestCounts.set(key, validUploads);

    if (validUploads.length >= maxUploads) {
      return res.status(429).json({
        message: "Upload limit exceeded. Please try again later.",
      });
    }

    validUploads.push(now);
    next();
  };
};

/**
 * Clean up old rate limit entries (run periodically)
 */
export const cleanupRateLimits = () => {
  const now = Date.now();
  const maxAge = 60 * 60 * 1000; // 1 hour

  for (const [key, requests] of requestCounts.entries()) {
    const validRequests = requests.filter((time) => now - time < maxAge);
    if (validRequests.length === 0) {
      requestCounts.delete(key);
    } else {
      requestCounts.set(key, validRequests);
    }
  }
};

// Clean up every 30 minutes
setInterval(cleanupRateLimits, 30 * 60 * 1000);

/**
 * Get suspicious IPs
 */
export const getSuspiciousIPs = () => Array.from(suspiciousIPs);

/**
 * Clear rate limit for testing
 */
export const clearRateLimits = () => {
  requestCounts.clear();
  suspiciousIPs.clear();
};
