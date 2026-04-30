# StackLab Deployment Guide

## Quick Start

### 1. Backend Setup

```bash
cd Backend
npm install
```

Ensure these packages are in package.json:
- express 5.2.1
- mongoose 9.3.3
- socket.io 4.8.3
- jsonwebtoken 9.0.3
- bcrypt 6.0.0
- nodemailer 8.0.4
- express-validator 7.3.2
- dotenv (for environment variables)

### 2. Environment Configuration

Create `.env` in Backend folder:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/stacklab

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=30d

# Email (optional, for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create `.env` in Frontend folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

Open http://localhost:5173

---

## Admin Account Creation

1. Sign up normally via `/signup`
2. Access MongoDB and update user record:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```
3. Refresh and you'll see Admin Panel link in sidebar

---

## Testing the Features

### Test Auto-Flagging
1. Create a project with words like "viagra", "click here", "urgent!"
2. Watch for flag badge on project

### Test Reporting
1. Create a project
2. Click 🚩 Report button
3. Submit report with reason
4. Login as admin, check Reports queue

### Test Rate Limiting
```bash
# Bash script to test rate limiting
for i in {1..6}; do
  curl http://localhost:5000/api/users/login -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test123"}'
done
# Should get 429 on 6th request
```

### Test Admin Panel
1. Login as admin user
2. Navigate to `/admin`
3. Try each tab:
   - Overview: See stats
   - Users: Search and suspend
   - Projects: Remove/restore
   - Designs: Approve/reject
   - Comments: Approve/reject
   - Reports: View and action
   - Flagged: Review auto-flags
   - Logs: See audit trail

---

## Database Schema Requirements

### ActivityLogModel
```javascript
{
  adminId: ObjectId,
  action: String,
  details: Object,
  timestamp: Date
}
```

### ReportModel
```javascript
{
  reportedItem: ObjectId,
  reportType: String,
  reason: String,
  description: String,
  reporter: ObjectId,
  status: String,
  resolution: Object,
  createdAt: Date
}
```

### ProjectModel (additions)
```javascript
{
  isFlagged: Boolean,
  flagLevel: String,
  flags: [{reason: String, flaggedAt: Date}]
}
```

---

## Production Deployment

### 1. Environment Setup
- Use production MongoDB connection
- Set `NODE_ENV=production`
- Use strong JWT secret (generate with: `openssl rand -base64 32`)
- Enable HTTPS (required for production)

### 2. Security
- Change all default passwords
- Use environment variables for secrets (never commit .env)
- Enable CORS only for your domain
- Setup firewall rules for database

### 3. Monitoring
- Setup error tracking (Sentry, etc.)
- Monitor rate limit hits
- Setup alerts for admin actions
- Monitor database performance

### 4. Scaling (if needed)
- Replace in-memory rate limiting with Redis
- Use MongoDB Atlas for managed database
- Deploy backend to Node.js hosting (Render, Railway, etc.)
- Deploy frontend to CDN (Vercel, Netlify, etc.)

---

## Troubleshooting

**"Cannot POST /api/reports/create"**
- Check if reportRoutes.js is imported in index.js
- Verify route path matches

**"Admin panel shows blank"**
- Check browser console for errors
- Verify backend is running
- Check user.role in database

**"Rate limiting not working"**
- Check if rateLimit middleware is applied globally
- Verify RATE_LIMIT_WINDOW_MS is set
- Look at middleware order in index.js

**"Reports not saving"**
- Check MongoDB connection
- Verify ReportModel is created
- Check backend logs for errors

---

## Maintenance

### Weekly
- Check admin activity logs for unusual patterns
- Review pending reports

### Monthly
- Cleanup old audit logs (older than 90 days)
- Review and update auto-flagging rules
- Check database performance

### Quarterly
- Security audit (update dependencies)
- Performance optimization
- User feedback review

---

## Support

For issues or questions:
1. Check server logs: `tail -f Backend/logs/*`
2. Check browser console for errors
3. Check database for data
4. Post in GitHub issues with logs
