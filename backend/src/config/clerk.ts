import dotenv from 'dotenv';

dotenv.config();

export const clerkConfig = {
  secretKey: process.env.CLERK_SECRET_KEY || '',
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
  jwtSecret: process.env.CLERK_JWT_SECRET || '',
  webhookSecret: process.env.CLERK_WEBHOOK_SECRET || '',
  apiUrl: process.env.CLERK_API_URL || 'https://api.clerk.dev',
  frontendApi: process.env.CLERK_FRONTEND_API || 'https://clerk.your-domain.com'
}; 