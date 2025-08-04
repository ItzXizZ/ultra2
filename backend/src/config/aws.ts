import dotenv from 'dotenv';

dotenv.config();

export const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || 'us-east-1',
  
  s3: {
    bucket: process.env.AWS_S3_BUCKET || 'ultra-portal-files',
    region: process.env.AWS_S3_REGION || 'us-east-1',
    acl: process.env.AWS_S3_ACL || 'private',
    maxFileSize: parseInt(process.env.AWS_S3_MAX_FILE_SIZE || '10485760'), // 10MB
    allowedFileTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  },
  
  cloudfront: {
    distributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID || '',
    domain: process.env.AWS_CLOUDFRONT_DOMAIN || ''
  },
  
  ses: {
    region: process.env.AWS_SES_REGION || 'us-east-1',
    fromEmail: process.env.AWS_SES_FROM_EMAIL || 'noreply@ultraportal.com'
  }
}; 