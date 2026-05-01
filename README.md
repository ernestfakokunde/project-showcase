# Project Showcase

A full-stack web application for showcasing design projects, enabling collaboration, messaging, and community engagement.

## 🌟 Features

- **Project Management** - Create, edit, and showcase design projects
- **Design Feed** - Browse designs by categories (UI, Web, App, Branding, Illustration, Motion, 3D)
- **Collaboration Requests** - Send and manage collaboration requests
- **Real-time Messaging** - Chat with other users
- **Notifications** - Get updates on messages, collaboration requests, and activities
- **User Profiles** - Showcase portfolio and connect with designers
- **Admin Panel** - Moderation, user management, and content control
- **Content Moderation** - Report inappropriate content with automated filtering
- **Activity Logging** - Track all user activities for security and compliance
- **Rate Limiting** - Protect API endpoints from abuse

## 🛠 Tech Stack

**Frontend:**
- React 18+ with Vite
- TailwindCSS for styling
- Socket.io for real-time features
- Axios for API calls
- React Router for navigation

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Email notifications

## 📋 Project Structure

```
project-showcase/
├── Frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Context API providers
│   │   ├── services/        # API calls
│   │   └── utils/           # Helper functions
│   └── package.json
├── Backend/                  # Node.js server
│   ├── controllers/         # Request handlers
│   ├── models/              # Database schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── utils/               # Helper functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB instance (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-showcase
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## 📚 Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run lint` - Run linter

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Content moderation and filtering
- Input validation and sanitization
- CORS protection
- Activity logging for audit trails
- Admin middleware for protected routes

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Designs
- `GET /api/designs` - Get designs (with filtering)
- `POST /api/designs` - Upload design
- `GET /api/designs/:id` - Get design details

### Messages
- `GET /api/messages/:userId` - Get conversation with user
- `POST /api/messages` - Send message

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read

## 🚀 Deployment

### Deploy to Render/Railway/Heroku

1. **Backend Deployment**
   - Set up MongoDB Atlas cluster
   - Configure environment variables
   - Deploy to your hosting platform
   - Set `FRONTEND_URL` to your frontend domain

2. **Frontend Deployment**
   - Build the application: `npm run build`
   - Deploy the `dist` folder to Vercel, Netlify, or similar
   - Set `VITE_API_URL` to your backend API URL

### Docker Deployment (Optional)

Create `Dockerfile` for both Frontend and Backend, and use `docker-compose.yml` for orchestration.

## 📸 Screenshots

[Add your screenshots here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💡 Future Enhancements

- Advanced search and filtering
- Design collaboration tools
- Portfolio analytics
- Payment integration
- API rate limiting improvements
- Mobile app development
- Social features (likes, comments)

## 📧 Support

For support, email support@projectshowcase.com, ernest.dev10@gmail.com or open an issue on GitHub.

## 👨‍💻 Author

[Ernest Fakokunde] 

---

**Last Updated:** May 2026
