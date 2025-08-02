# Cloudinary Setup Guide

## Overview
This application now uses Cloudinary for cloud-based image storage, which provides:
- Reliable image hosting
- Automatic image optimization
- CDN delivery for fast loading
- Free tier with generous limits

## Setup Steps

### 1. Create a Cloudinary Account
1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your Credentials
After signing up, you'll find your credentials in the Dashboard:
- **Cloud Name**: Your unique cloud identifier
- **API Key**: Your API access key
- **API Secret**: Your API secret key

### 3. Configure Environment Variables

#### For Local Development
Create a `.env` file in your project root:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### For Production (Render)
Add these environment variables in your Render dashboard:
1. Go to your service in Render
2. Navigate to Environment
3. Add the following variables:
   - `CLOUDINARY_CLOUD_NAME`: your_cloud_name
   - `CLOUDINARY_API_KEY`: your_api_key
   - `CLOUDINARY_API_SECRET`: your_api_secret

### 4. Test the Setup
1. Start your application
2. Try uploading an image through the form
3. Check the logs for "Cloudinary storage enabled" message
4. Verify the image URL in the database is a Cloudinary URL

## Features

### Automatic Image Optimization
- Images are automatically resized to max 800x600
- Quality is optimized automatically
- Format is converted to the most efficient format

### Fallback System
- If Cloudinary is not configured, the app falls back to local storage
- Existing local images continue to work
- No data loss during migration

### Security
- Images are stored securely on Cloudinary's servers
- URLs are HTTPS by default
- No sensitive data is exposed

## Free Tier Limits
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Uploads**: 25,000/month

This is more than sufficient for most applications.

## Troubleshooting

### Images Not Uploading
1. Check that all environment variables are set correctly
2. Verify your Cloudinary credentials
3. Check the application logs for error messages

### Images Not Displaying
1. Ensure the image URLs are being saved correctly in the database
2. Check that the URLs are accessible in a browser
3. Verify CORS settings if needed

### Fallback to Local Storage
If you see "Cloudinary not enabled" in the logs, the app will automatically use local storage as a fallback. 