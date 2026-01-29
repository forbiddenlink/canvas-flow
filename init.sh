#!/bin/bash

# PixelForge - Initialization Script
# This script sets up the development environment and starts the application

set -e  # Exit on any error

echo "======================================"
echo "  PixelForge Development Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js version 18 or higher is required${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node -v) detected"

# Check if npm/pnpm is available
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    echo -e "${GREEN}✓${NC} Using pnpm"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    echo -e "${GREEN}✓${NC} Using npm"
else
    echo -e "${RED}Error: No package manager found${NC}"
    exit 1
fi

echo ""
echo "======================================"
echo "  Step 1: Installing Dependencies"
echo "======================================"
echo ""

if [ ! -d "node_modules" ]; then
    echo "Installing project dependencies..."
    $PKG_MANAGER install
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${BLUE}ℹ${NC} Dependencies already installed. Run '$PKG_MANAGER install' to update."
fi

echo ""
echo "======================================"
echo "  Step 2: Environment Configuration"
echo "======================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "Creating .env file from .env.example..."
        cp .env.example .env
        echo -e "${YELLOW}⚠${NC} Please configure your .env file with:"
        echo "   - DATABASE_URL"
        echo "   - NEXTAUTH_SECRET"
        echo "   - REPLICATE_API_KEY (get from /tmp/api-key or replicate.com)"
        echo "   - Other API keys as needed"
        echo ""
        echo -e "${YELLOW}Note: API keys can be found at /tmp/api-key for testing${NC}"
    else
        echo -e "${YELLOW}⚠${NC} No .env file found. You'll need to create one."
    fi
else
    echo -e "${GREEN}✓${NC} .env file exists"
fi

echo ""
echo "======================================"
echo "  Step 3: Database Setup"
echo "======================================"
echo ""

# Check if Prisma is set up
if [ -d "prisma" ]; then
    echo "Setting up database with Prisma..."

    # Generate Prisma Client
    echo "Generating Prisma Client..."
    $PKG_MANAGER exec prisma generate

    # Push database schema (for development)
    echo "Syncing database schema..."
    $PKG_MANAGER exec prisma db push

    echo -e "${GREEN}✓${NC} Database configured"
else
    echo -e "${YELLOW}⚠${NC} Prisma not yet configured. Will be set up in project structure."
fi

echo ""
echo "======================================"
echo "  Step 4: Starting Development Server"
echo "======================================"
echo ""

echo -e "${BLUE}Starting Next.js development server...${NC}"
echo ""
echo -e "Application will be available at: ${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop the server${NC}"
echo ""

# Start the development server
$PKG_MANAGER run dev
