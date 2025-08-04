import dotenv from 'dotenv';

dotenv.config();

export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  currency: process.env.STRIPE_CURRENCY || 'usd',
  
  // Subscription plans
  plans: {
    basic: {
      id: process.env.STRIPE_BASIC_PLAN_ID || 'price_basic',
      name: 'Basic Plan',
      price: 9.99
    },
    pro: {
      id: process.env.STRIPE_PRO_PLAN_ID || 'price_pro',
      name: 'Pro Plan',
      price: 19.99
    },
    enterprise: {
      id: process.env.STRIPE_ENTERPRISE_PLAN_ID || 'price_enterprise',
      name: 'Enterprise Plan',
      price: 49.99
    }
  },
  
  // Payment methods
  paymentMethods: ['card', 'bank_transfer'],
  
  // Webhook events to handle
  webhookEvents: [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
    'invoice.payment_failed'
  ]
}; 