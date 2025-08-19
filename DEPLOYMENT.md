# Deployment Guide - Learning LMS

This guide provides step-by-step instructions for deploying the Learning LMS application to Vercel and setting up Supabase.

## 🚀 Quick Start

### 1. Supabase Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `learning-lms` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project initialization (2-3 minutes)

#### Configure Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `supabase/schema.sql`
3. Paste and execute the SQL script
4. Verify all tables are created in **Table Editor**

#### Get API Keys
1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon (public) key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### Configure Authentication
1. Go to **Authentication** → **Settings**
2. Enable **Email confirmations** (recommended for production)
3. Configure **Site URL** to your Vercel domain
4. Add redirect URLs:
   - `https://your-domain.vercel.app/auth/callback`
   - `https://your-domain.vercel.app/dashboard`

### 2. Vercel Deployment

#### Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

#### Environment Variables
1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

3. Click "Save" for each variable

#### Deploy
1. Click "Deploy" to start the build process
2. Wait for build completion (2-5 minutes)
3. Your app will be available at the provided Vercel URL

## 🔧 Advanced Configuration

### Custom Domain (Optional)
1. In Vercel, go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update Supabase redirect URLs with your custom domain

### Environment-Specific Variables
You can set different values for different environments:

```env
# Production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Preview/Development
NEXT_PUBLIC_APP_URL=https://your-project-git-main-yourusername.vercel.app
```

### Build Optimization
1. **Enable Edge Functions**: For better performance
2. **Image Optimization**: Vercel automatically optimizes images
3. **Analytics**: Enable Vercel Analytics for performance monitoring

## 📊 Monitoring & Analytics

### Vercel Analytics
1. Go to **Analytics** tab in your Vercel project
2. Enable **Web Analytics**
3. Monitor:
   - Page views and performance
   - Core Web Vitals
   - User behavior patterns

### Supabase Monitoring
1. **Database**: Monitor query performance and connections
2. **Auth**: Track authentication events and user growth
3. **Storage**: Monitor file uploads and storage usage
4. **Logs**: Review API requests and errors

## 🔒 Security Considerations

### Environment Variables
- ✅ **Public Variables**: `NEXT_PUBLIC_*` (visible in browser)
- ❌ **Private Variables**: `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- 🔐 **Never commit** `.env.local` to version control

### Supabase Security
- **RLS Policies**: Automatically applied via schema
- **API Keys**: Use anon key for client, service role for server
- **Authentication**: Configure proper redirect URLs
- **Database**: Regular backups and monitoring

### Vercel Security
- **HTTPS**: Automatically enabled
- **Headers**: Security headers automatically applied
- **Rate Limiting**: Built-in protection against abuse
- **DDoS Protection**: Cloudflare integration

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Vercel dashboard
# Common causes:
- Missing environment variables
- TypeScript compilation errors
- Dependency installation issues
```

#### Authentication Errors
```bash
# Verify Supabase configuration:
- Check API keys in environment variables
- Verify redirect URLs in Supabase Auth settings
- Ensure RLS policies are properly applied
```

#### Database Connection Issues
```bash
# Check Supabase status:
- Verify project is active
- Check database password
- Ensure IP restrictions allow Vercel
```

#### Performance Issues
```bash
# Optimize build:
- Enable Vercel Edge Functions
- Optimize images and assets
- Monitor Core Web Vitals
- Use proper caching strategies
```

### Debug Commands

#### Local Testing
```bash
# Test environment variables
npm run dev

# Check build locally
npm run build

# Verify TypeScript
npx tsc --noEmit
```

#### Vercel Debug
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Deploy preview
vercel --prod
```

## 📈 Performance Optimization

### Build Optimization
1. **Code Splitting**: Next.js automatic optimization
2. **Image Optimization**: Use Next.js Image component
3. **Bundle Analysis**: Monitor bundle size
4. **Tree Shaking**: Remove unused code

### Runtime Optimization
1. **Caching**: Implement proper cache headers
2. **CDN**: Vercel's global CDN
3. **Database**: Optimize queries and indexes
4. **Monitoring**: Track performance metrics

## 🔄 Continuous Deployment

### GitHub Integration
1. **Automatic Deploys**: Every push to main branch
2. **Preview Deploys**: Pull requests get preview URLs
3. **Branch Deploys**: Configure specific branch deployments

### Deployment Workflow
```yaml
# Example GitHub Actions (optional)
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📚 Additional Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Support
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **Community**: GitHub Discussions and Discord

### Monitoring Tools
- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Dashboard**: Database and auth monitoring
- **External Tools**: Google Analytics, Hotjar, etc.

---

## 🎯 Next Steps

After successful deployment:

1. **Test all functionality**:
   - User registration and authentication
   - Course browsing and lesson viewing
   - Quiz taking and scoring
   - Event tracking and analytics

2. **Monitor performance**:
   - Page load times
   - Database query performance
   - User engagement metrics

3. **Scale as needed**:
   - Add more courses and content
   - Implement advanced features
   - Optimize based on user feedback

4. **Security audit**:
   - Review access controls
   - Monitor for suspicious activity
   - Regular security updates

Your Learning LMS is now live and ready for users! 🚀

