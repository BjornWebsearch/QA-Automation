#!/bin/bash

# WordPress Simple Health Check
# Easy-to-use script for non-technical users

set -e

echo "🌐 WordPress Site Health Check"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WP_BASE_URL=${WP_BASE_URL:-"https://beratta.websearchpro.net"}
WP_ADMIN_USER=${WP_ADMIN_USER:-"admin"}
WP_ADMIN_PASS=${WP_ADMIN_PASS:-"taJdMiIvQdht4XGO%!ycgk6Z"}

echo -e "${BLUE}Checking website: $WP_BASE_URL${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing required software...${NC}"
    npm ci
fi

# Install Playwright browsers if needed
if [ ! -d "node_modules/@playwright/test" ]; then
    echo -e "${YELLOW}🌐 Installing browser software...${NC}"
    npx playwright install --with-deps
fi

# Create test results directory
mkdir -p test-results

echo -e "${BLUE}🧪 Running health checks...${NC}"
echo "This may take a few minutes..."
echo ""

# Run the essential tests
if npx playwright test tests/essential-tests.spec.js --reporter=list; then
    echo ""
    echo "=============================="
    echo -e "${GREEN}🎉 All health checks passed!${NC}"
    echo -e "${GREEN}✅ Your WordPress site is working correctly${NC}"
    echo ""
    echo -e "${BLUE}📊 View detailed report:${NC}"
    echo -e "${BLUE}   Open: simple-test-report.html${NC}"
    echo -e "${BLUE}   Or run: npx playwright show-report${NC}"
else
    echo ""
    echo "=============================="
    echo -e "${RED}❌ Some health checks failed${NC}"
    echo -e "${YELLOW}⚠️  Please review the detailed report${NC}"
    echo ""
    echo -e "${BLUE}📊 View detailed report:${NC}"
    echo -e "${BLUE}   Open: simple-test-report.html${NC}"
    echo -e "${BLUE}   Or run: npx playwright show-report${NC}"
    echo ""
    echo -e "${YELLOW}💡 What to do next:${NC}"
    echo -e "${YELLOW}   1. Open the HTML report to see what failed${NC}"
    echo -e "${YELLOW}   2. Contact your developer if you need help${NC}"
    echo -e "${YELLOW}   3. Check if your website is accessible in a browser${NC}"
fi

echo ""
echo -e "${BLUE}📁 Files created:${NC}"
echo -e "${BLUE}   • simple-test-report.html (Easy to read report)${NC}"
echo -e "${BLUE}   • playwright-report/ (Technical details)${NC}"
echo -e "${BLUE}   • test-results/ (Screenshots and logs)${NC}"
