#!/bin/bash

set -e

echo "🚀 Setting up TeleDash..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ is required. Please upgrade your Node.js version."
    exit 1
fi

echo "✅ Node.js version check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your configuration"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your database and other configurations"
echo "2. Run 'npm run db:migrate' to set up the database"
echo "3. Run 'npm run db:seed' to seed sample data"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "Demo credentials after seeding:"
echo "  Admin: admin@teledash.io / admin123"
echo "  Agent: amara.kwame@telecel.com.gh / agent123"
