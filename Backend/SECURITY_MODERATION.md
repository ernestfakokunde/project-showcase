## 🔒 CONTENT MODERATION & SECURITY IMPLEMENTATION GUIDE

This document outlines all the security features and content moderation systems implemented in your project showcase platform.

---

## 1. AUTO-FLAGGING SYSTEM

### How It Works
When a user creates a **project** or **design**, the content is automatically scanned for:

- **Profanity** - Detects inappropriate language
- **Spam patterns** - Identifies spam keywords and promotional content
- **Suspicious links** - Warns about shortened or potentially malicious URLs
- **Excessive caps** - Flags content that looks like shouting/spam
- **Low quality** - Detects very short content or repeated characters

### Response Structure
```json
{
  "message": "Project created but flagged for moderation review",
  "project": { /* project data */ },
  "flagWarning": {
    "level": "medium",
    "reasons": ["Suspicious links", "Spam pattern detected"]
  }
}
```

### Flag Levels
- **low**: 1 flag reason (minor)
- **medium**: 2-3 flag reasons (moderate)
- **high**: 4+ flag reasons (severe)

---

## 2. REPORT SYSTEM

### User Reports
Users can report inappropriate content or abusive users:

**Create Report:**
```
POST /api/reports/create
Content-Type: application/json
Authorization: Bearer {token}

{
  "reportType": "project",  // "project", "design", "comment", "user"
  "reportedItem": "projectId",
  "reason": "Inappropriate content",  // from predefined list
  "description": "Additional details..."
}
```

**Valid Report Reasons:**
- Inappropriate content
- Spam
- Copyright violation
- Hate speech
- Harassment
- Misleading info
- Other

### Report Endpoints
- `POST /api/reports/create` - Create a report
- `GET /api/reports/my-reports` - View your reports
- `GET /api/reports/:id` - Get report details
- `DELETE /api/reports/:id` - Delete own report (pending only)

---

## 3. RATE LIMITING

### Protection Against
- Brute force login attacks
- Account takeover attempts
- Spam & DoS attacks
- Bot abuse

### Rate Limits Applied
| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/users/register` | 5 requests | 15 minutes |
| `/api/users/login` | 10 requests | 15 minutes |
| `/api/users/forgot-password` | 3 requests | 1 hour |
| All other endpoints | 100 requests | 15 minutes |

**Example Error:**
```json
{
  "message": "Too many requests. Please try again later.",
  "retryAfter": 900
}
```

---

## 4. CORS & HTTP SECURITY HEADERS

### CORS Configuration
- Origin: Restricted to frontend URL only
- Credentials: Required
- Methods: GET, POST, PUT, DELETE, PATCH only
- Allowed Headers: Content-Type, Authorization only

### Security Headers
| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | DENY | Prevent clickjacking |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-XSS-Protection | 1; mode=block | Enable XSS protection |
| Content-Security-Policy | default-src 'self' | Restrict resource loading |
| Cache-Control | no-store, no-cache | Prevent sensitive data caching |

---

## 5. INPUT VALIDATION & SANITIZATION

### Content Filter Utilities
Located in `utils/contentFilter.js`:

```javascript
// Sanitize user input (remove XSS)
sanitizeInput(userInput)

// Validate email format
isValidEmail(email)

// Check password strength
checkPasswordStrength(password)
```

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

---

## 6. ADMIN MODERATION PANEL

### Admin-Only Features

**Flagged Content Review:**
```
GET /api/admin/designs
GET /api/admin/projects
GET /api/admin/comments
```

**Take Action:**
```
POST /api/admin/designs/:id/approve
POST /api/admin/designs/:id/reject

POST /api/admin/comments/:id/approve
POST /api/admin/comments/:id/reject
```

**User Management:**
```
POST /api/admin/users/:id/suspend
POST /api/admin/users/:id/delete
POST /api/admin/users/:id/promote
```

**Reports:**
```
GET /api/admin/reports
POST /api/admin/reports/:id/resolve
```

---

## 7. AUDIT LOGGING

### What Gets Logged
- ✅ User suspension/deletion
- ✅ Project/design removal
- ✅ Comment moderation
- ✅ Report resolutions
- ✅ Admin role changes
- ✅ Security events (login attempts, password resets)

### Log Entry Structure
```json
{
  "admin": "adminUserId",
  "action": "user_suspend",
  "details": {
    "targetUserId": "userId",
    "reason": "Harassment"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

### Access Logs
```
GET /api/admin/activity-logs
```

---

## 8. AUTHENTICATION & JWT SECURITY

### Best Practices Implemented
- ✅ JWT tokens with expiration
- ✅ Password hashing with bcrypt
- ✅ Secure password reset flow
- ✅ Email verification for sensitive operations

### Token Structure
```javascript
// Generated on login/register
{
  _id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,  // "user" or "admin"
  token: generateToken(user._id, user.role)
}
```

---

## 9. FILE UPLOAD SECURITY

### Size Limits
- JSON/URL-encoded: 10MB max
- File uploads: Rate limited per user

### Validation
- File type checking
- File size enforcement
- Virus scanning recommended (integrate with VirusTotal API)

---

## 10. ADMIN PROTECTION

### All Admin Routes Protected By
1. **Authentication Middleware** (`protect`)
   - Verifies JWT token
   - Confirms user is logged in

2. **Admin-Only Middleware** (`adminOnly`)
   - Checks user role is "admin"
   - Prevents non-admin access

**Example Protected Route:**
```javascript
router.post("/users/:id/suspend", protect, adminOnly, toggleSuspendUser);
```

---

## 🚀 UPCOMING SECURITY ENHANCEMENTS

### Phase 2 Features
- [ ] 2FA (Two-Factor Authentication)
- [ ] OAuth2 integration (Google, GitHub login)
- [ ] IP whitelisting for admin accounts
- [ ] Advanced analytics/bot detection
- [ ] Automated backup & disaster recovery
- [ ] Encrypted database fields
- [ ] API key management for integrations
- [ ] WAF (Web Application Firewall) integration

---

## ⚠️ SECURITY BEST PRACTICES FOR DEPLOYMENT

### Environment Variables Required
```
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=very_long_random_string_minimum_32_chars
DB_CONNECTION_STRING=mongodb+srv://...
ADMIN_EMAIL=admin@yourdomain.com
```

### Production Checklist
- [ ] Use HTTPS only (SSL/TLS)
- [ ] Set `NODE_ENV=production`
- [ ] Disable debug logging
- [ ] Use strong JWT secret (32+ chars)
- [ ] Enable database encryption
- [ ] Set up automated backups
- [ ] Configure firewall rules
- [ ] Enable DDOS protection (Cloudflare)
- [ ] Regular security audits
- [ ] Monitor suspicious activity
- [ ] Keep dependencies updated

---

## 🔍 MONITORING & ALERTS

### Key Metrics to Monitor
- Failed login attempts (multiple = attack)
- Suspension requests trends
- Flagged content ratio
- Report volume increases
- Suspicious IP patterns
- Disk space & database size

### Alerts Setup
Set up notifications for:
- 5+ failed logins from same IP
- Multiple user suspensions from admin
- Report spike (>10 in 1 hour)
- High flag rate (>50% flagged content)

---

## 📞 SUPPORT & INCIDENTS

### Incident Response Procedure
1. **Detect** - Monitoring system alerts
2. **Assess** - Review logs & affected content
3. **Act** - Take immediate action (block, suspend, remove)
4. **Communicate** - Inform affected users
5. **Document** - Log incident & resolution
6. **Review** - Prevent recurrence

---

## API REFERENCE

### Content Filter Functions
```javascript
import { 
  autoFlagContent,
  sanitizeInput,
  isValidEmail,
  checkPasswordStrength
} from "./utils/contentFilter.js"

// Auto-flag posts
const result = autoFlagContent({ 
  title: "...", 
  description: "...", 
  links: [...]
});
// Returns: { shouldFlag, reasons, flagLevel }

// Sanitize input
const clean = sanitizeInput(userInput);

// Validate email
if (isValidEmail(email)) { /* ... */ }

// Check password
const strength = checkPasswordStrength(password);
// Returns: { isStrong, strength (0-100), requirements }
```

---

## 🎯 QUICK SETUP

### 1. Install Dependencies (if needed)
```bash
npm install
```

### 2. Start Backend with Security
```bash
npm run dev
```

### 3. Test Rate Limiting
```bash
# Rapid fire login attempts should fail after 10
curl -X POST http://localhost:8000/api/users/login
```

### 4. Test Report System
```bash
# Create a report
curl -X POST http://localhost:8000/api/reports/create \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"reportType":"project","reportedItem":"id","reason":"Spam"}'
```

---

That's your complete security & moderation system! 🛡️
