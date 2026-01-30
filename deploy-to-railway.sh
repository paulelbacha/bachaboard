#!/bin/bash

echo "🚂 Railway Deployment Script for BachaBoard"
echo "==========================================="
echo ""
echo "This script will guide you through deploying BachaBoard to Railway."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed. Installing..."
    brew install railway
fi

echo "📋 Step 1: Login to Railway"
echo "----------------------------"
echo "Run: railway login"
echo "This will open your browser to authenticate."
echo ""
read -p "Press enter after you've logged in..."

echo ""
echo "📦 Step 2: Create a new Railway project"
echo "---------------------------------------"
railway init

echo ""
echo "🔗 Step 3: Link to GitHub repository"
echo "------------------------------------"
echo "The project should auto-detect the GitHub repo."
echo ""

echo ""
echo "🗄️ Step 4: Add PostgreSQL database"
echo "----------------------------------"
railway add

echo ""
echo "🔑 Step 5: Set environment variables"
echo "------------------------------------"
echo "Setting up environment variables..."

# Generate a secure secret key
SECRET_KEY=$(openssl rand -hex 32)

railway variables set SECRET_KEY="$SECRET_KEY"
railway variables set RAILWAY_ENVIRONMENT="production"

echo ""
echo "⚠️  IMPORTANT: You need to add Cloudinary credentials manually:"
echo "----------------------------------------------------------------"
echo "1. Go to https://cloudinary.com and sign up (free)"
echo "2. Get your credentials from the dashboard"
echo "3. Run these commands with your actual values:"
echo ""
echo "railway variables set CLOUDINARY_CLOUD_NAME='your-cloud-name'"
echo "railway variables set CLOUDINARY_API_KEY='your-api-key'"
echo "railway variables set CLOUDINARY_API_SECRET='your-api-secret'"
echo ""
read -p "Press enter after adding Cloudinary credentials..."

echo ""
echo "🚀 Step 6: Deploy to Railway"
echo "----------------------------"
railway up

echo ""
echo "✅ Deployment initiated!"
echo "========================"
echo ""
echo "Railway will now:"
echo "1. Build your frontend (React)"
echo "2. Build your backend (FastAPI)"
echo "3. Set up PostgreSQL"
echo "4. Deploy to a public URL"
echo ""
echo "Check your deployment status at: https://railway.app"
echo ""
echo "Once deployed, you'll get a URL like: https://bachaboard.up.railway.app"
echo ""
echo "🎯 Next Steps:"
echo "- Wait for deployment to complete"
echo "- Access your app via the Railway-provided URL"
echo "- SSH into the service to run seed script for users"