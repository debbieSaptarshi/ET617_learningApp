# Learning LMS - Interactive Learning Management System

A modern, full-stack learning management system built with Next.js, Supabase, and Vercel. This application provides interactive learning content, video lessons, quizzes, and comprehensive activity tracking.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Course Management**: Browse and access published courses
- **Interactive Lessons**: Rich text content and embedded YouTube videos
- **Quiz System**: Multiple choice, single choice, and short answer questions
- **Progress Tracking**: Monitor quiz results and learning achievements

### Advanced Features
- **Event Tracking**: Comprehensive clickstream and activity monitoring
- **Video Analytics**: Track video play, pause, seek, and completion events
- **Quiz Analytics**: Monitor quiz performance and user responses
- **Real-time Updates**: Live session management and progress tracking

## 🏗️ Architecture

### Frontend
- **Next.js 14**: App Router for modern React development
- **TypeScript**: Full type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **React Markdown**: Rich text rendering for lesson content

### Backend
- **Supabase**: Complete backend-as-a-service solution
- **PostgreSQL**: Robust relational database with Row Level Security
- **Real-time Subscriptions**: Live updates and notifications
- **Storage**: File management for course assets

### Deployment
- **Vercel**: Optimized hosting for Next.js applications
- **Environment Variables**: Secure configuration management
- **Automatic Deployments**: GitHub integration for CI/CD

## 📊 Database Schema

### Core Tables
- `profiles`: User profiles and roles
- `courses`: Course information and publishing status
- `lessons`: Individual lesson content and metadata
- `quizzes`: Quiz definitions and passing criteria
- `quiz_questions`: Question content and types
- `quiz_options`: Multiple choice options
- `quiz_attempts`: User quiz submissions
- `quiz_answers`: Individual question responses
- `events`: Comprehensive activity tracking

### Event Tracking
The system tracks various user interactions:
- Page views and navigation
- Click events on interactive elements
- Video playback events (play, pause, seek, complete)
- Quiz interactions (start, submit, question answers)
- Session management and user engagement

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- Vercel account for deployment

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learning-lms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Database Setup**
   - Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
   - This creates all tables, indexes, and RLS policies

5. **Start Development Server**
   ```bash
   npm run dev
   ```

### Supabase Configuration

1. **Create Project**: Set up a new Supabase project
2. **Database Schema**: Execute the provided SQL schema
3. **Authentication**: Configure email authentication settings
4. **Row Level Security**: RLS policies are automatically applied
5. **API Keys**: Copy project URL and anon key to environment variables

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add the same environment variables in Vercel dashboard
3. **Build Settings**: Vercel automatically detects Next.js configuration
4. **Deploy**: Automatic deployments on every push to main branch

## 🔐 Security Features

### Row Level Security (RLS)
- Users can only access their own profiles and quiz attempts
- Published content is publicly readable
- Event tracking respects user privacy settings
- Secure API endpoints with proper authentication

### Authentication
- Supabase Auth with email/password
- Secure session management
- Protected routes and API endpoints
- Automatic profile creation on signup

## 📱 User Experience

### Learning Flow
1. **Browse Courses**: View available learning materials
2. **Start Learning**: Access lesson content and videos
3. **Take Quizzes**: Test knowledge with interactive assessments
4. **Track Progress**: Monitor learning achievements and scores
5. **Dashboard**: Comprehensive overview of learning journey

### Interactive Elements
- **Rich Text Content**: Markdown rendering with syntax highlighting
- **Video Player**: YouTube integration with progress tracking
- **Quiz Interface**: Multi-format question types
- **Progress Indicators**: Visual feedback on learning status

## 🚀 Performance Optimizations

### Frontend
- Next.js App Router for optimal routing
- Component-level code splitting
- Optimized image loading and video embedding
- Efficient state management and re-rendering

### Backend
- Database indexing for fast queries
- Efficient RLS policies
- Batch event processing
- Optimized API response handling

## 📊 Analytics & Insights

### Event Tracking
- **User Behavior**: Page views, clicks, and interactions
- **Learning Analytics**: Quiz performance and completion rates
- **Video Engagement**: Playback patterns and completion rates
- **Session Data**: User journey and engagement metrics

### Data Export
- Events stored in PostgreSQL for analysis
- JSONB properties for flexible event data
- Timestamp tracking for temporal analysis
- User and session correlation

## 🔧 Customization

### Content Management
- Add new courses and lessons via database
- Configure quiz questions and options
- Set passing scores and assessment criteria
- Manage user roles and permissions

### Styling
- Tailwind CSS for consistent design
- Custom component library
- Responsive design patterns
- Theme customization options

## 🧪 Testing

### Manual Testing
- User registration and authentication
- Course navigation and lesson viewing
- Quiz completion and scoring
- Event tracking and analytics

### Quality Assurance
- TypeScript for compile-time error checking
- ESLint for code quality
- Responsive design testing
- Cross-browser compatibility

## 📈 Monitoring & Maintenance

### Performance Monitoring
- Vercel Analytics integration
- Database query performance
- API response times
- User engagement metrics

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Logging and monitoring
- Graceful degradation

## 🤝 Contributing

### Development Guidelines
- Follow TypeScript best practices
- Use consistent code formatting
- Write clear component documentation
- Test changes thoroughly

### Code Structure
- Components in `/components` directory
- Pages in `/app` directory (Next.js App Router)
- Utilities in `/lib` directory
- Types in `/lib/types.ts`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues
- **Authentication Errors**: Check Supabase configuration and environment variables
- **Database Issues**: Verify schema execution and RLS policies
- **Build Errors**: Ensure Node.js version compatibility
- **Deployment Issues**: Check Vercel environment variables

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 🎯 Roadmap

### Future Enhancements
- **Content Creation UI**: Admin interface for course management
- **Advanced Analytics**: Learning path recommendations
- **Social Features**: Discussion forums and peer learning
- **Mobile App**: React Native companion application
- **AI Integration**: Personalized learning recommendations
- **Multi-language Support**: Internationalization features

---

Built with ❤️ using modern web technologies for the best learning experience.
