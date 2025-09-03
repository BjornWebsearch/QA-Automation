#!/bin/bash

# WordPress Quick QA Test Runner
# This script runs essential WordPress QA tests quickly

set -e

echo "🚀 Starting WordPress Quick QA Tests..."
echo "======================================"

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

echo -e "${BLUE}Configuration:${NC}"
echo "  Base URL: $WP_BASE_URL"
echo "  Admin User: $WP_ADMIN_USER"
echo "  Admin Pass: [HIDDEN]"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Create test results directory
mkdir -p test-results/screenshots

# Function to run tests
run_tests() {
    local test_type=$1
    local test_name=$2
    
    echo -e "${BLUE}🧪 Running $test_name tests...${NC}"
    
    if npx playwright test $test_type --reporter=list --timeout=60000; then
        echo -e "${GREEN}✅ $test_name tests passed${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name tests failed${NC}"
        return 1
    fi
}

# Run essential tests
echo -e "${YELLOW}🔄 Running essential WordPress QA tests...${NC}"

failed_tests=0

# 1. Authentication tests
run_tests "tests/auth/login.spec.js" "Authentication" || ((failed_tests++))

# 2. Basic functionality tests
run_tests "tests/dashboard/dashboard.spec.js" "Dashboard" || ((failed_tests++))

# 3. Content management tests
run_tests "tests/content/content-management.spec.js" "Content Management" || ((failed_tests++))

# 4. API tests
run_tests "tests/api/api-tests.spec.js" "API and Performance" || ((failed_tests++))

echo ""
echo "======================================"
if [ $failed_tests -eq 0 ]; then
    echo -e "${GREEN}🎉 All essential tests passed!${NC}"
    echo -e "${GREEN}✅ WordPress site is functioning correctly${NC}"
else
    echo -e "${RED}❌ $failed_tests test suite(s) failed${NC}"
    echo -e "${YELLOW}⚠️  Please review the test results and fix any issues${NC}"
fi

echo ""
echo -e "${BLUE}📁 Test results saved to: test-results/${NC}"
echo -e "${BLUE}📸 Screenshots saved to: test-results/screenshots/${NC}"
echo -e "${BLUE}📊 HTML report: npx playwright show-report${NC}"

# Exit with appropriate code
exit $failed_tests
