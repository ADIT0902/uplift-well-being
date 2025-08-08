# Uplift Wellbeing Portal - Setup Guide

This guide will help you set up the Uplift Wellbeing Portal with all required services and API keys.

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local installation or MongoDB Atlas account)
- Google AI Studio account (for Gemini API)

## Step 1: Install Dependencies

```bash
# Install all dependencies (frontend and backend)
npm run setup
```

## Step 2: Database Setup

### Option A: Local MongoDB
1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/
2. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb/brew/mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```
3. Your MongoDB URI will be: `mongodb://localhost:27017/uplift_wellbeing`

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/atlas
2. Create a free account and cluster
3. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/uplift_wellbeing`)
4. Whitelist your IP address in Atlas security settings

## Step 3: Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key (starts with `AIza...`)

## Step 4: Configure Environment Variables

### Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file with your actual values:
   ```env
   # Database - Replace with your actual MongoDB URI
   MONGODB_URI=mongodb://localhost:27017/uplift_wellbeing
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/uplift_wellbeing

   # JWT Secret - Change this to a secure random string
   JWT_SECRET=your_super_secure_jwt_secret_key_here_change_this

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:8080

   # Gemini AI API Key - Replace with your actual API key
   GEMINI_API_KEY=AIza_your_actual_gemini_api_key_here

   # Optional: Email configuration (for password reset)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

### Frontend Configuration
1. In the root directory, create a `.env` file:
   ```bash
   # Create .env file in root directory
   touch .env
   ```

2. Add the following content:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

## Step 5: Initialize Database

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In another terminal, seed the crisis resources:
   ```bash
   cd backend
   npm run seed
   ```

## Step 6: Start the Application

### Option A: Start Both Services Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Option B: Start Both Services Together (if you have concurrently installed)
```bash
# Install concurrently globally
npm install -g concurrently

# Start both services
npm run dev:full
```

## Step 7: Access the Application

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `.env`
   - For Atlas: verify IP whitelist and credentials

2. **JWT Secret Error**
   - Make sure `JWT_SECRET` is set in backend `.env`
   - Use a long, random string (at least 32 characters)

3. **Gemini API Not Working**
   - Verify your API key is correct
   - Check if you have API quota remaining
   - Ensure the key has proper permissions

4. **CORS Errors**
   - Check that `FRONTEND_URL` in backend `.env` matches your frontend URL
   - Ensure both servers are running on correct ports

5. **Port Already in Use**
   - Change `PORT` in backend `.env` to a different port
   - Update `VITE_API_URL` in frontend `.env` accordingly

### Environment Variable Checklist

Backend `.env` file must have:
- ✅ `MONGODB_URI` - Your MongoDB connection string
- ✅ `JWT_SECRET` - A secure random string
- ✅ `GEMINI_API_KEY` - Your Google AI API key
- ✅ `FRONTEND_URL` - Frontend URL for CORS

Frontend `.env` file must have:
- ✅ `VITE_API_URL` - Backend API URL

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique JWT secrets in production
- Regularly rotate API keys
- Use environment-specific configurations for different deployments

## Production Deployment

For production deployment:
1. Use environment variables instead of `.env` files
2. Set `NODE_ENV=production`
3. Use a production MongoDB instance
4. Configure proper CORS origins
5. Use HTTPS for all communications
6. Set up proper logging and monitoring

## Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all services are running
4. Check the network tab in browser dev tools for API errors

For additional support, check the project documentation or create an issue in the repository.