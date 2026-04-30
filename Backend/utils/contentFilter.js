// Content Filter & Auto-Flagging System
// Detects inappropriate content and flags posts for moderation

const PROFANITY_WORDS = [
  "badword1", "badword2", "badword3", // Add your profanity list
  // Add more as needed or use external library like "better-profanity"
];

const SPAM_PATTERNS = [
  /(?:http|https):\/\/[^\s]+/gi, // URLs
  /\b(?:\d{10}|[\w\.-]+@[\w\.-]+\.\w+)\b/g, // Phone numbers & emails
  /(?:follow|click|visit|buy|subscribe|contact)\s+(?:my|us|here|now|today)/gi, // Spam keywords
];

const SUSPICIOUS_DOMAINS = [
  "bit.ly",
  "tinyurl",
  "shortened.url", // Add known malicious domains
];

/**
 * Check if content contains profanity
 */
const containsProfanity = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return PROFANITY_WORDS.some((word) => lowerText.includes(word));
};

/**
 * Check if content is spam
 */
const isSpam = (text) => {
  if (!text) return false;
  return SPAM_PATTERNS.some((pattern) => pattern.test(text));
};

/**
 * Check for suspicious links
 */
const hasSuspiciousLinks = (text) => {
  if (!text) return false;
  return SUSPICIOUS_DOMAINS.some((domain) => text.includes(domain));
};

/**
 * Check if content has excessive caps (spam indicator)
 */
const hasExcessiveCaps = (text) => {
  if (!text || text.length < 5) return false;
  const capsCount = (text.match(/[A-Z]/g) || []).length;
  return capsCount / text.length > 0.5;
};

/**
 * Check if content is duplicate/low quality
 */
const isLowQuality = (text) => {
  if (!text) return false;
  // Check for very short content
  if (text.trim().length < 10) return true;
  // Check for repeated characters
  if (/(.)\1{4,}/.test(text)) return true;
  return false;
};

/**
 * Main auto-flagging function
 * Returns { shouldFlag: boolean, reasons: string[] }
 */
export const autoFlagContent = (data) => {
  const reasons = [];

  // Check title
  if (data.title) {
    if (containsProfanity(data.title)) reasons.push("Profanity in title");
    if (hasExcessiveCaps(data.title)) reasons.push("Excessive caps");
    if (isLowQuality(data.title)) reasons.push("Low quality title");
  }

  // Check description
  if (data.description) {
    if (containsProfanity(data.description)) reasons.push("Profanity detected");
    if (isSpam(data.description)) reasons.push("Spam pattern detected");
    if (hasSuspiciousLinks(data.description)) reasons.push("Suspicious links");
    if (hasExcessiveCaps(data.description)) reasons.push("Excessive capitalization");
    if (isLowQuality(data.description)) reasons.push("Low quality content");
  }

  // Check links
  if (data.links && Array.isArray(data.links)) {
    data.links.forEach((link) => {
      if (hasSuspiciousLinks(link.url || "")) {
        reasons.push(`Suspicious link: ${link.url}`);
      }
    });
  }

  return {
    shouldFlag: reasons.length > 0,
    reasons,
    flagLevel: reasons.length > 3 ? "high" : reasons.length > 1 ? "medium" : "low",
  };
};

/**
 * Sanitize user input (basic XSS prevention)
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim();
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check password strength
 */
export const checkPasswordStrength = (password) => {
  const requirements = {
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
    isLongEnough: password.length >= 8,
  };

  const strength =
    Object.values(requirements).filter(Boolean).length;

  return {
    isStrong: strength >= 4,
    strength: Math.ceil((strength / 5) * 100),
    requirements,
  };
};

/**
 * Check ADMIN password strength - STRICTER requirements
 * Required: 12+ chars, uppercase, lowercase, numbers, special chars
 */
export const checkAdminPasswordStrength = (password) => {
  const requirements = {
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+=\[\]{};:'",.<>?/\\|-]/.test(password),
    isLongEnough: password.length >= 12,
    noCommonPatterns: !hasCommonPasswordPatterns(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  const isStrong = metRequirements === Object.keys(requirements).length;

  return {
    isStrong,
    strength: Math.ceil((metRequirements / Object.keys(requirements).length) * 100),
    requirements,
    message: getPasswordMessage(requirements),
  };
};

/**
 * Check for common password patterns (admin security)
 */
const hasCommonPasswordPatterns = (password) => {
  const commonPatterns = [
    /123456/, // Sequential numbers
    /password/i, // Word "password"
    /qwerty/i, // Keyboard pattern
    /111111/, // Repeated numbers
    /admin/i, // Word "admin"
    /welcome/i, // Word "welcome"
    /letmein/i, // Word "letmein"
  ];

  return commonPatterns.some((pattern) => pattern.test(password));
};

/**
 * Get user-friendly password requirement message
 */
const getPasswordMessage = (requirements) => {
  const missing = Object.entries(requirements)
    .filter(([key, val]) => !val && key !== "noCommonPatterns")
    .map(([key]) => {
      const messages = {
        hasUpperCase: "uppercase letter (A-Z)",
        hasLowerCase: "lowercase letter (a-z)",
        hasNumbers: "number (0-9)",
        hasSpecialChar: "special character (!@#$%^&*)",
        isLongEnough: "at least 12 characters",
      };
      return messages[key];
    });

  if (requirements.noCommonPatterns === false) {
    missing.push("avoid common words (password, admin, etc)");
  }

  if (missing.length === 0) return "✓ Password meets all admin requirements";
  return `Admin password must include: ${missing.join(", ")}`;
};
