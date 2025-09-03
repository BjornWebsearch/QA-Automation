#!/bin/bash

# WordPress QA Test Runner
# This script runs the WordPress QA tests locally

set -e

echo "🚀 Starting WordPress QA Tests..."
echo "=================================="

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

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Install Playwright browsers if needed
if [ ! -d "node_modules/@playwright/test" ]; then
    echo -e "${YELLOW}🌐 Installing Playwright browsers...${NC}"
    npx playwright install
fi

# Create test results directory
mkdir -p test-results/screenshots

# Function to run tests
run_tests() {
    local test_type=$1
    local test_name=$2
    
    echo -e "${BLUE}🧪 Running $test_name tests...${NC}"
    
    if npx playwright test $test_type --reporter=list; then
        echo -e "${GREEN}✅ $test_name tests passed${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name tests failed${NC}"
        return 1
    fi
}

# Function to run specific test suite
run_suite() {
    local suite=$1
    local name=$2
    
    echo -e "${BLUE}🧪 Running $name test suite...${NC}"
    
    if npx playwright test tests/$suite/ --reporter=list; then
        echo -e "${GREEN}✅ $name test suite passed${NC}"
        return 0
    else
        echo -e "${RED}❌ $name test suite failed${NC}"
        return 1
    fi
}

# Parse command line arguments
case "${1:-all}" in
    "auth")
        run_suite "auth" "Authentication"
        ;;
    "dashboard")
        run_suite "dashboard" "Dashboard"
        ;;
    "content")
        run_suite "content" "Content Management"
        ;;
    "theme")
        run_suite "theme" "Theme Functionality"
        ;;
    "plugins")
        run_suite "plugins" "Plugin Functionality"
        ;;
    "api")
        run_suite "api" "API and Performance"
        ;;
    "quick")
        echo -e "${YELLOW}⚡ Running quick test suite...${NC}"
        run_tests "tests/wordpress-qa.spec.js" "Quick QA"
        ;;
    "all")
        echo -e "${YELLOW}🔄 Running all test suites...${NC}"
        
        failed_tests=0
        
        # Run individual test suites
        run_suite "auth" "Authentication" || ((failed_tests++))
        run_suite "dashboard" "Dashboard" || ((failed_tests++))
        run_suite "content" "Content Management" || ((failed_tests++))
        run_suite "theme" "Theme Functionality" || ((failed_tests++))
        run_suite "plugins" "Plugin Functionality" || ((failed_tests++))
        run_suite "api" "API and Performance" || ((failed_tests++))
        
        # Run comprehensive test suite
        run_tests "tests/wordpress-qa.spec.js" "Comprehensive QA" || ((failed_tests++))
        
        echo ""
        echo "=================================="
        if [ $failed_tests -eq 0 ]; then
            echo -e "${GREEN}🎉 All tests passed!${NC}"
        else
            echo -e "${RED}❌ $failed_tests test suite(s) failed${NC}"
        fi
        ;;
    "ui")
        echo -e "${BLUE}🖥️  Opening Playwright UI...${NC}"
        npx playwright test --ui
        ;;
    "headed")
        echo -e "${BLUE}👀 Running tests in headed mode...${NC}"
        npx playwright test --headed
        ;;
    "debug")
        echo -e "${BLUE}🐛 Running tests in debug mode...${NC}"
        npx playwright test --debug
        ;;
    "report")
        echo -e "${BLUE}📊 Opening test report...${NC}"
        npx playwright show-report
        ;;
    "help"|"-h"|"--help")
        echo "WordPress QA Test Runner"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  all       Run all test suites (default)"
        echo "  auth      Run authentication tests"
        echo "  dashboard Run dashboard tests"
        echo "  content   Run content management tests"
        echo "  theme     Run theme functionality tests"
        echo "  plugins   Run plugin functionality tests"
        echo "  api       Run API and performance tests"
        echo "  quick     Run quick QA test suite"
        echo "  ui        Open Playwright UI"
        echo "  headed    Run tests in headed mode"
        echo "  debug     Run tests in debug mode"
        echo "  report    Open test report"
        echo "  help      Show this help message"
        echo ""
        echo "Environment Variables:"
        echo "  WP_BASE_URL    WordPress site URL (default: https://beratta.websearchpro.net)"
        echo "  WP_ADMIN_USER  Admin username (default: admin)"
        echo "  WP_ADMIN_PASS  Admin password (default: [hidden])"
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}📁 Test results saved to: test-results/${NC}"
echo -e "${BLUE}📸 Screenshots saved to: test-results/screenshots/${NC}"
echo -e "${BLUE}📊 HTML report: npx playwright show-report${NC}"
