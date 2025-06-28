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
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **PostgreSQL** - Robust, ACID-compliant relational database
- **Row Level Security (RLS)** - Database-level security policies
- **Real-time subscriptions** - Live data updates across clients

### AI & External Services
- **Google Gemini AI** - Advanced AI for mental health conversations
- **Supabase Edge Functions** - Serverless functions for AI integration
- **Deno Runtime** - Modern, secure runtime for edge functions

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **Prettier** - Code formatting and style consistency
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Lovable Tagger** - Development component tagging

### Deployment & Infrastructure
- **Netlify** - Frontend hosting and deployment
- **Supabase Cloud** - Managed backend infrastructure
- **Edge Functions** - Global serverless function deployment
- **CDN** - Global content delivery for optimal performance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
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

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations from `supabase/migrations/`
   - Copy your Supabase URL and anon key

4. **Configure environment variables**
   ```bash
   # Create .env file with your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Set up AI Assistant (Optional)**
   - Get a Google AI API key
   - Add it to your Supabase project secrets as `GEMINI_API_KEY`

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:8080`

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

- **End-to-End Encryption**: All personal data is encrypted
- **HIPAA Compliance**: Designed with healthcare privacy standards
- **Anonymous Options**: Share in community without revealing identity
- **Data Ownership**: You control your data and can export/delete anytime
- **Secure Authentication**: Industry-standard security practices

## 🤝 Contributing

We welcome contributions to make Uplift better for everyone!

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow TypeScript and ESLint conventions
4. Write meaningful commit messages
5. Test your changes thoroughly
6. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow existing component patterns
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