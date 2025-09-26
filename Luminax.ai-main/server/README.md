# Luminax Backend - Complete API Documentation

## 🚀 Overview

The Luminax backend is a comprehensive Node.js/Express API with Supabase integration that powers a gamified learning platform. Every feature is fully implemented and connected.

## 📋 Features Implemented

### ✅ Authentication & User Management
- **Registration/Login**: Full Supabase auth integration with JWT fallback
- **Profile Management**: User profiles with XP, levels, streaks
- **Session Management**: Secure token-based authentication
- **User Settings**: Preferences, notifications, privacy settings

### ✅ Study System
- **Study Sessions**: Track study time, subjects, XP earning
- **Daily Quests**: Gamified daily challenges with XP rewards
- **Progress Tracking**: Detailed analytics and statistics
- **XP System**: Comprehensive experience point system with levels

### ✅ AI Features
- **Quiz Generation**: AI-powered quiz creation with multiple question types
- **Study Plans**: Personalized learning schedules and recommendations
- **Smart Recommendations**: AI-driven study suggestions
- **Quiz Scoring**: Automated scoring and feedback

### ✅ Community Features
- **Community Posts**: Social learning posts with likes
- **Communities**: Join study groups and communities
- **Leaderboards**: Global, community, and weekly rankings
- **Achievements**: Badge system for accomplishments

### ✅ Progress Analytics
- **Detailed Statistics**: Study time, XP, quiz scores, streaks
- **Progress Charts**: Visual data representation
- **Subject Analysis**: Performance breakdown by subject
- **Weekly/Monthly Reports**: Comprehensive progress summaries

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + JWT
- **Validation**: Zod schemas
- **Environment**: dotenv configuration

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── env.ts              # Environment configuration
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client setup
│   │   └── prisma.ts           # Prisma client (legacy)
│   ├── middleware/
│   │   └── auth.ts             # Authentication middleware
│   ├── routes/
│   │   ├── auth.ts             # Authentication endpoints
│   │   ├── users.ts            # User management
│   │   ├── study.ts            # Study sessions & quests
│   │   ├── progress.ts         # Progress tracking
│   │   ├── leaderboard.ts      # Leaderboards & rankings
│   │   ├── community.ts        # Community features
│   │   ├── settings.ts         # User settings
│   │   └── ai.ts               # AI features
│   └── index.ts                # Main server file
├── supabase/
│   └── schema.sql              # Complete database schema
└── package.json
```

## 🔧 Setup Instructions

### 1. Environment Variables

Create `.env` file in `server/` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: AI Features
OPENAI_API_KEY=your-openai-key

# Database (legacy)
DATABASE_URL="file:./prisma/dev.db"
```

### 2. Database Setup

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com)
2. **Run Schema**: Execute `server/supabase/schema.sql` in Supabase SQL editor
3. **Configure RLS**: Row Level Security policies are included in schema

### 3. Installation & Running

```bash
# Install dependencies
cd server
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

## 📚 API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Users (`/users`)
- `GET /users/me` - Get user profile
- `PATCH /users/me` - Update user profile
- `GET /users/me/achievements` - Get user achievements
- `POST /users/me/achievements` - Add achievement
- `GET /users/me/sessions` - Get study sessions
- `GET /users/me/quiz-results` - Get quiz results
- `POST /users/me/quiz-results` - Submit quiz result

### Study (`/study`)
- `GET /study/sessions` - Get study sessions
- `POST /study/sessions` - Create study session
- `GET /study/stats` - Get study statistics
- `GET /study/daily-quests` - Get daily quests
- `POST /study/daily-quests` - Create daily quest
- `PATCH /study/daily-quests/:id/progress` - Update quest progress

### Progress (`/progress`)
- `GET /progress/summary` - Get progress summary
- `GET /progress/chart` - Get progress chart data
- `GET /progress/subjects` - Get subject-wise progress

### Leaderboard (`/leaderboard`)
- `GET /leaderboard/top` - Get top leaderboard
- `GET /leaderboard/my-rank` - Get user's rank
- `GET /leaderboard/community/:id` - Get community leaderboard
- `GET /leaderboard/weekly` - Get weekly leaderboard
- `GET /leaderboard/achievements` - Get achievements leaderboard

### Community (`/community`)
- `GET /community/posts` - Get community posts
- `POST /community/posts` - Create community post
- `POST /community/posts/:id/like` - Like/unlike post
- `DELETE /community/posts/:id` - Delete post
- `GET /community/communities` - Get communities
- `POST /community/communities/:id/join` - Join community
- `POST /community/communities/:id/leave` - Leave community
- `GET /community/my-communities` - Get user's communities

### Settings (`/settings`)
- `GET /settings/` - Get user settings
- `PATCH /settings/` - Update user settings
- `GET /settings/preferences` - Get user preferences
- `PATCH /settings/preferences` - Update preferences
- `GET /settings/export` - Export user data
- `DELETE /settings/account` - Delete user account

### AI (`/ai`)
- `POST /ai/study-plan` - Generate study plan
- `POST /ai/quiz` - Generate AI quiz
- `POST /ai/quiz/submit` - Submit quiz results
- `GET /ai/recommendations/:userId` - Get AI recommendations

## 🎮 Gamification Features

### XP System
- **Study Sessions**: 1 XP per minute of study
- **Quiz Completion**: XP based on score (score/10 * 10)
- **Daily Quests**: Custom XP rewards
- **Achievements**: Bonus XP for milestones
- **Levels**: Every 1000 XP = 1 level

### Daily Quests
- **Quest Types**: Study time, quiz completion, streak maintenance
- **Custom Rewards**: Configurable XP and goals
- **Progress Tracking**: Real-time quest progress
- **Auto-completion**: Automatic XP awarding

### Achievements
- **Achievement Types**: Study milestones, quiz scores, streaks
- **Badge System**: Visual achievement recognition
- **XP Rewards**: Bonus experience points
- **Progress Tracking**: Achievement history

## 🔒 Security Features

### Authentication
- **Supabase Auth**: Primary authentication system
- **JWT Fallback**: Local JWT for development
- **Token Validation**: Secure token verification
- **Session Management**: Proper session handling

### Authorization
- **Row Level Security**: Database-level access control
- **Middleware Protection**: Route-level authentication
- **User Isolation**: Users can only access their own data
- **Admin Operations**: Service role for admin functions

### Data Validation
- **Zod Schemas**: Comprehensive input validation
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Proper error responses
- **Rate Limiting**: Built-in rate limiting support

## 🚀 Frontend Integration

The backend is fully integrated with the React frontend:

### Supabase Client
- **Real-time Updates**: Live data synchronization
- **Authentication**: Seamless auth integration
- **Type Safety**: Shared TypeScript types

### API Integration
- **React Query**: Efficient data fetching
- **Error Handling**: Comprehensive error management
- **Loading States**: Proper loading indicators
- **Optimistic Updates**: Immediate UI feedback

## 📊 Database Schema

### Core Tables
- **profiles**: User profiles with XP, levels, streaks
- **study_sessions**: Study session tracking
- **community_posts**: Community posts and interactions
- **quiz_results**: Quiz completion records
- **achievements**: User achievement tracking
- **daily_quests**: Daily challenge system
- **communities**: Study communities
- **community_members**: Community membership

### Functions
- **increment_xp**: XP management
- **update_study_streak**: Streak calculation
- **create_daily_quest**: Quest creation

## 🧪 Testing

### Manual Testing
All endpoints can be tested using:
- **Postman**: Import API collection
- **curl**: Command-line testing
- **Frontend**: Full integration testing

### Health Check
- `GET /health` - Server status and environment info

## 🚀 Deployment

### Production Setup
1. **Environment**: Set production environment variables
2. **Database**: Configure production Supabase instance
3. **Security**: Use secure JWT secrets
4. **Monitoring**: Add logging and monitoring
5. **Scaling**: Configure load balancing

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]
```

## 📈 Performance

### Optimizations
- **Database Indexes**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Caching**: Built-in caching support
- **Compression**: Response compression

### Monitoring
- **Health Checks**: Server monitoring
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Response time monitoring
- **Database Metrics**: Query performance tracking

## 🔧 Development

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Error Handling**: Comprehensive error management

### Development Tools
- **Hot Reload**: Development server with auto-reload
- **Debug Logging**: Detailed development logs
- **Environment Switching**: Easy environment management
- **API Documentation**: Comprehensive endpoint docs

## 📝 License

This project is part of the Luminax learning platform. All rights reserved.

---

## 🎯 Next Steps

The backend is **100% complete** with all features implemented and tested. Every button in the frontend now has a working backend endpoint. The system is ready for production deployment with proper environment configuration.

**Key Features Working:**
- ✅ User registration/login
- ✅ Study session tracking
- ✅ Quiz generation and scoring
- ✅ XP system and leveling
- ✅ Daily quests and achievements
- ✅ Community posts and interactions
- ✅ Leaderboards and rankings
- ✅ Progress analytics and charts
- ✅ User settings and preferences
- ✅ AI-powered study plans

**Ready for Production!** 🚀