import dotenv from 'dotenv';

dotenv.config();

export const aiConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    organization: process.env.OPENAI_ORG_ID || '',
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7')
  },
  
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
    maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '4000'),
    temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE || '0.7')
  },
  
  google: {
    apiKey: process.env.GOOGLE_AI_API_KEY || '',
    model: process.env.GOOGLE_AI_MODEL || 'gemini-pro',
    maxTokens: parseInt(process.env.GOOGLE_AI_MAX_TOKENS || '4000'),
    temperature: parseFloat(process.env.GOOGLE_AI_TEMPERATURE || '0.7')
  },
  
  // AI service selection
  defaultProvider: process.env.DEFAULT_AI_PROVIDER || 'openai', // 'openai', 'anthropic', 'google'
  
  // Rate limiting
  rateLimit: {
    requestsPerMinute: parseInt(process.env.AI_RATE_LIMIT || '60'),
    requestsPerHour: parseInt(process.env.AI_RATE_LIMIT_HOUR || '1000')
  }
}; 