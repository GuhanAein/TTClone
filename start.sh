#!/bin/bash

# TickTick Clone - Quick Start Script
# This script helps you get started quickly

set -e

echo "🚀 TickTick Clone - Quick Start"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating default .env file...${NC}"
    cat > .env << EOF
# JWT Secret (change this in production!)
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970

# Google OAuth (optional - leave empty to skip)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email Configuration (optional - leave empty to skip)
MAIL_USERNAME=
MAIL_PASSWORD=
EOF
    echo -e "${GREEN}✅ Created .env file with defaults${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env file to add your credentials if needed${NC}"
    echo ""
fi

echo "Starting services with Docker Compose..."
echo ""

# Start services
docker-compose up -d

echo ""
echo -e "${GREEN}✅ Services started successfully!${NC}"
echo ""
echo "📊 Service Status:"
docker-compose ps
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080"
echo "   PostgreSQL: localhost:5432"
echo "   Redis: localhost:6379"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo ""
echo -e "${GREEN}🎉 TickTick Clone is ready to use!${NC}"
echo ""
echo "📖 For more information, see:"
echo "   - README.md"
echo "   - DEPLOYMENT.md"
echo "   - PROJECT_SUMMARY.md"
