# Uplift Wellbeing Portal

A comprehensive mental health and wellness platform designed to support users on their journey to better mental health. Uplift provides a safe, supportive space for mood tracking, journaling, meditation, goal setting, AI-powered assistance, and community support.

![Uplift Logo](https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=400&fit=crop&crop=center)

## 🌟 Features

### Core Wellness Tools
- **Mood Tracking**: Daily mood logging with emotion tagging and pattern recognition
- **Digital Journal**: Private journaling with mood ratings and reflection prompts
- **Meditation Timer**: Guided meditation sessions with progress tracking
- **Wellness Goals**: Set, track, and achieve personal wellness objectives
- **AI Assistant**: 24/7 AI-powered mental health support and guidance

### Community & Support
- **Community Forum**: Connect with others, share experiences, and find support
- **Crisis Resources**: 24/7 access to mental health crisis support and hotlines
- **Anonymous Sharing**: Option to share experiences anonymously for privacy

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Secure Authentication**: Email/password authentication with profile management
- **Data Privacy**: All personal data is encrypted and securely stored
- **Progress Analytics**: Visual insights into mood patterns and wellness trends

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with enhanced IDE support
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality, accessible React components
- **Lucide React** - Beautiful, customizable icons
- **React Router DOM** - Client-side routing and navigation
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Date-fns** - Modern JavaScript date utility library
- **Recharts** - Composable charting library for React

### Backend & Database
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework for Node.js
- **MongoDB** - NoSQL document database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for secure authentication
- **bcryptjs** - Password hashing for security

### AI & External Services
- **Google Gemini AI** - Advanced AI for mental health conversations
- **Axios** - Promise-based HTTP client for API requests

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **Prettier** - Code formatting and style consistency
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Lovable Tagger** - Development component tagging

### Deployment & Infrastructure
- **Netlify** - Frontend hosting and deployment
- **MongoDB Atlas** - Cloud-hosted MongoDB database
- **Heroku/Railway** - Backend hosting and deployment
- **CDN** - Global content delivery for optimal performance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Google AI API key (for AI assistant)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uplift-wellbeing-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   - Install MongoDB locally or create a MongoDB Atlas account
   - Create a new database called `uplift_wellbeing`
   - Get your MongoDB connection string

4. **Set up the backend**
   ```bash
   cd server
   npm install
   
   # Create .env file with your configuration
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

5. **Configure environment variables**
   ```bash
   # Frontend (.env)
   VITE_API_URL=http://localhost:5000/api
   
   # Backend (server/.env)
   MONGODB_URI=mongodb://localhost:27017/uplift_wellbeing
   JWT_SECRET=your_super_secret_jwt_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

6. **Seed the database (optional)**
   ```bash
   cd server
   npm run build
   node dist/scripts/seedCrisisResources.js
   ```

7. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

8. **Open your browser**
   - Frontend: `http://localhost:8080`
   - Backend API: `http://localhost:5000`

## 📱 Usage

### Getting Started
1. **Sign Up**: Create an account with email and password
2. **Complete Profile**: Add your name and preferences
3. **Explore Features**: Start with mood tracking or journaling
4. **Set Goals**: Define your wellness objectives
5. **Join Community**: Connect with others on similar journeys

### Daily Workflow
1. **Morning Check-in**: Log your mood and set daily intentions
2. **Mindful Moments**: Use the meditation timer throughout the day
3. **Journal Reflection**: Write about your experiences and thoughts
4. **Community Engagement**: Share insights or seek support
5. **Evening Review**: Track progress toward your wellness goals

## 🔒 Privacy & Security

- **Password Hashing**: Secure password storage with bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Data Validation**: Input validation and sanitization
- **Anonymous Options**: Share in community without revealing identity
- **Data Ownership**: You control your data and can export/delete anytime
- **CORS Protection**: Cross-origin request security

## 🤝 Contributing

We welcome contributions to make Uplift better for everyone!

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow TypeScript conventions for both frontend and backend
4. Write meaningful commit messages
5. Test your changes thoroughly
6. Submit a pull request

### Code Style
- Use TypeScript for both frontend and backend
- Follow existing component patterns
- Use proper error handling in API routes
- Maintain accessibility standards
- Write self-documenting code with clear variable names

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Crisis Resources

If you're experiencing a mental health crisis:

- **US**: Call 988 (Suicide & Crisis Lifeline)
- **US**: Text HOME to 741741 (Crisis Text Line)
- **International**: Visit [findahelpline.com](https://findahelpline.com)
- **Emergency**: Call your local emergency services

## 🙏 Acknowledgments

- Mental health professionals who provided guidance
- Open source community for amazing tools and libraries
- Users who trust us with their wellness journey
- Crisis support organizations for their vital work

## 📞 Contact

For questions, suggestions, or support:
- Email: support@uplift-wellness.com
- Community Forum: Available in the app
- GitHub Issues: For technical problems

---

**Remember**: Uplift is designed to support your mental health journey, but it's not a replacement for professional mental health care. Always consult with qualified healthcare providers for serious mental health concerns.

Made with ❤️ for mental health and wellbeing.