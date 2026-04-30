# 🚀 QUICK REFERENCE: Flagging & Report System

## 🎯 ENDPOINTS YOU CAN USE NOW

### User - Create Report
```bash
curl -X POST http://localhost:8000/api/reports/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reportType": "project",
    "reportedItem": "PROJECT_ID",
    "reason": "Spam",
    "description": "Optional details"
  }'
```

### User - View My Reports
```bash
curl http://localhost:8000/api/reports/my-reports?status=pending \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Admin - Get All Reports
```bash
curl http://localhost:8000/api/admin/reports \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Admin - Resolve Report
```bash
curl -X POST http://localhost:8000/api/admin/reports/REPORT_ID/resolve \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "removed",
    "adminNotes": "Violated guidelines"
  }'
```

---

## 🏗️ SYSTEM LAYERS

```
┌─────────────────────────────────────────────────┐
│  FRONTEND (React Components)                    │
│  - Report button on cards                       │
│  - Report modal                                 │
│  - Admin dashboard                              │
└──────────────┬──────────────────────────────────┘
               │ HTTP Requests
┌──────────────▼──────────────────────────────────┐
│  SECURITY MIDDLEWARE (Express)                  │
│  - Rate Limiting ✓                              │
│  - CORS Hardening ✓                             │
│  - Security Headers ✓                           │
│  - JWT Validation ✓                             │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│  BUSINESS LOGIC (Controllers)                   │
│  - Create Project (triggers auto-flag)          │
│  - Create Report                                │
│  - Resolve Report (logs action)                 │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│  CONTENT FILTERING (Utils)                      │
│  - autoFlagContent()                            │
│  - sanitizeInput()                              │
│  - isValidEmail()                               │
│  - checkPasswordStrength()                      │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│  DATABASE (MongoDB)                             │
│  - Projects (with flags)                        │
│  - Designs (with flags)                         │
│  - Reports                                      │
│  - Activity Logs                                │
└─────────────────────────────────────────────────┘
```

---

## 🚨 FLAG LEVELS EXPLAINED

### 🟢 Low
- 1 reason detected
- Examples: Minor spam, slight profanity
- Action: Monitor, no immediate action

### 🟡 Medium
- 2-3 reasons detected
- Examples: Multiple spam keywords, mixed issues
- Action: Review, likely needs approval

### 🔴 High
- 4+ reasons detected
- Examples: Heavy spam, multiple profanity, suspicious links
- Action: Immediate admin review, likely rejection

---

## 📋 REPORT REASONS

Users can report with these reasons:
1. Inappropriate content
2. Spam
3. Copyright violation
4. Hate speech
5. Harassment
6. Misleading info
7. Other

---

## 🔐 RATE LIMITS AT A GLANCE

| Endpoint | Limit | Window | Status |
|----------|-------|--------|--------|
| POST /register | 5 | 15 min | ✅ Active |
| POST /login | 10 | 15 min | ✅ Active |
| POST /forgot-password | 3 | 1 hour | ✅ Active |
| All others | 100 | 15 min | ✅ Active |

---

## 💾 DATA STRUCTURE

### Project/Design Object (with flagging)
```javascript
{
  // ... existing fields ...
  isFlagged: false,              // boolean
  flagLevel: "none",             // "none" | "low" | "medium" | "high"
  flags: [
    { reason: "Spam detected", flaggedAt: "2024-01-15T10:30:00Z" },
    { reason: "Suspicious links", flaggedAt: "2024-01-15T10:30:00Z" }
  ]
}
```

### Report Object
```javascript
{
  _id: "reportId",
  reportType: "project",                 // "project" | "design" | "comment" | "user"
  reportedItem: "projectId",             // ref to actual item
  reportedBy: { id, username, email },   // who reported
  reason: "Spam",                        // from predefined list
  description: "...",                    // optional details
  status: "pending",                     // "pending" | "approved" | "rejected" | "resolved"
  resolution: {
    action: "removed",                   // "removed" | "suspended" | "warning" | "no-action"
    resolvedBy: "adminId",
    resolvedAt: "2024-01-15T10:35:00Z",
    adminNotes: "Violated ToS"
  },
  createdAt: "2024-01-15T10:30:00Z"
}
```

---

## 🛠️ ADMIN WORKFLOW

### Step 1: Review Queue
- Admin sees flagged content
- Can see reasons for flagging
- Can preview actual content

### Step 2: Decision
| Decision | Action | Result |
|----------|--------|--------|
| **Approve** | Content is clean | Publish normally |
| **Reject** | Remove content | Content deleted, user notified |
| **Suspend User** | User violated policy | User temporarily suspended |
| **No Action** | False alarm | Content published, report closed |

### Step 3: Log Entry
- Action logged with timestamp
- Admin ID recorded
- Reason documented
- Appears in Activity Logs

---

## 🧪 TESTING CHECKLIST

### Test Auto-Flagging
```javascript
// Should flag (has spam keywords)
POST /api/projects/create
{
  "title": "Follow us at bit.ly/spam",
  "description": "CLICK NOW!!! Check this out...",
  "category": "Dev",
  "roles": [{ "title": "Dev", "description": "..." }]
}
// Response will have flagWarning with reasons
```

### Test Rate Limiting
```bash
# Run 11 times rapid fire (should fail after 10)
for i in {1..11}; do
  curl -X POST http://localhost:8000/api/users/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}' &
done
```

### Test Report Creation
```javascript
POST /api/reports/create
{
  "reportType": "project",
  "reportedItem": "VALID_PROJECT_ID",
  "reason": "Spam",
  "description": "This is spam content"
}
```

### Test Duplicate Prevention
```javascript
// Create same report twice
// Second attempt should fail with "already reported"
```

---

## 📊 MONITORING METRICS

Watch these numbers in production:

| Metric | Warning Level | Critical Level |
|--------|------------------|-----------------|
| Flagged % | > 30% content | > 50% content |
| Reports/day | > 100 | > 500 |
| Failed logins (same IP) | > 10 | > 50 |
| User suspension rate | > 5/day | > 20/day |
| Response time | > 500ms | > 2s |
| Database size | > 5GB | > 20GB |

---

## 🔧 TROUBLESHOOTING

### Report Not Appearing
```javascript
// Check:
1. User is authenticated (token valid)
2. reportedItem ID is valid (exists in DB)
3. reportType is valid (project|design|comment|user)
4. User hasn't already reported same item

// Debug:
db.reports.find({ reportedItem: "itemId" })
```

### Content Not Flagging
```javascript
// Check:
1. Content matches flagging keywords exactly
2. Case-insensitive matching is working
3. Check PROFANITY_WORDS list in contentFilter.js
4. Add more keywords if needed

// Debug:
import { autoFlagContent } from "./contentFilter.js"
const result = autoFlagContent({ 
  title: "test text", 
  description: "test"
})
console.log(result)
```

### Rate Limit Not Working
```javascript
// Check:
1. User is hitting same endpoint multiple times
2. Window time hasn't expired
3. Middleware is mounted correctly
4. Check rateLimit.js for bugs

// Debug:
// Check request counts in rateLimit.js requestCounts Map
```

---

## 📚 FULL DOCUMENTATION

- `Backend/SECURITY_MODERATION.md` - 100% detailed docs
- `Frontend/REPORTING_GUIDE.md` - Frontend implementation
- `IMPLEMENTATION_SUMMARY.md` - Overview & status

---

## ✅ DEPLOYMENT CHECKLIST

Before going live:
- [ ] Update JWT_SECRET to 32+ character random string
- [ ] Update FRONTEND_URL to production domain
- [ ] Enable HTTPS/SSL
- [ ] Add more profanity keywords
- [ ] Test all rate limits
- [ ] Setup monitoring/alerting
- [ ] Test admin report resolution
- [ ] Backup database
- [ ] Test email notifications
- [ ] Update ToS with moderation policy

---

**Ready to build? Start with the Frontend Implementation Guide!** 🎯
