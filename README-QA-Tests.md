# WordPress QA Test Suite

This repository contains comprehensive automated QA tests for the WordPress site "Berätta för 100 andra" (https://beratta.websearchpro.net/).

## 🎯 Overview

The test suite covers all major aspects of WordPress functionality including:
- Authentication and security
- Dashboard and navigation
- Content management (posts, pages, media)
- Theme functionality and customization
- Plugin functionality and management
- API endpoints and performance
- Site health and security

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Access to the WordPress site

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

#### Using the Test Runner Script (Recommended)
```bash
# Run all tests
./run-qa-tests.sh

# Run specific test suites
./run-qa-tests.sh auth
./run-qa-tests.sh dashboard
./run-qa-tests.sh content
./run-qa-tests.sh theme
./run-qa-tests.sh plugins
./run-qa-tests.sh api

# Run quick test suite
./run-qa-tests.sh quick

# Open Playwright UI
./run-qa-tests.sh ui

# Run in headed mode (see browser)
./run-qa-tests.sh headed

# Debug mode
./run-qa-tests.sh debug
```

#### Using npm Scripts
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:auth
npm run test:dashboard
npm run test:content
npm run test:theme
npm run test:plugins
npm run test:api

# Run with UI
npm run test:ui

# Run in headed mode
npm run test:headed

# Debug mode
npm run test:debug

# Show test report
npm run test:report
```

#### Using Playwright Directly
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/auth/login.spec.js

# Run with specific browser
npx playwright test --project=chromium

# Run with UI
npx playwright test --ui

# Run in headed mode
npx playwright test --headed
```

## 📁 Test Structure

```
tests/
├── auth/                    # Authentication tests
│   └── login.spec.js
├── dashboard/               # Dashboard and navigation tests
│   └── dashboard.spec.js
├── content/                 # Content management tests
│   └── content-management.spec.js
├── theme/                   # Theme functionality tests
│   └── theme-functionality.spec.js
├── plugins/                 # Plugin functionality tests
│   └── plugin-functionality.spec.js
├── api/                     # API and performance tests
│   └── api-tests.spec.js
├── utils/                   # Test utilities and helpers
│   └── test-helpers.js
└── wordpress-qa.spec.js     # Comprehensive test suite
```

## 🔧 Configuration

### Environment Variables
```bash
# WordPress site configuration
export WP_BASE_URL="https://beratta.websearchpro.net"
export WP_ADMIN_USER="admin"
export WP_ADMIN_PASS="your_password_here"
```

### Playwright Configuration
The `playwright.config.js` file contains:
- Browser configurations (Chromium, Firefox, WebKit)
- Test settings (retries, timeouts, parallel execution)
- Reporter configurations (HTML, JSON, JUnit)
- Base URL and other global settings

## 📊 Test Reports

### HTML Report
```bash
npx playwright show-report
```

### JSON Report
Test results are saved to `test-results/results.json`

### JUnit Report
Test results are saved to `test-results/results.xml`

### Screenshots
Screenshots are automatically captured on test failures and saved to `test-results/screenshots/`

## 🚀 CI/CD Integration

### GitHub Actions
The repository includes a GitHub Actions workflow (`.github/workflows/wordpress-qa.yml`) that:
- Runs tests on multiple browsers (Chromium, Firefox, WebKit)
- Executes on push, pull requests, and scheduled runs
- Uploads test results and screenshots as artifacts
- Generates QA summary reports

### Local CI/CD
```bash
# Run tests for CI/CD pipeline
./run-qa-tests.sh all

# Check exit code for CI/CD
echo $?  # 0 = success, 1 = failure
```

## 🧪 Test Categories

### 1. Authentication Tests (`tests/auth/`)
- Login functionality
- Logout functionality
- Session management
- Security features
- Access control

### 2. Dashboard Tests (`tests/dashboard/`)
- Dashboard loading
- Navigation menu
- Widget functionality
- Site information display
- Admin bar functionality

### 3. Content Management Tests (`tests/content/`)
- Posts management
- Pages management
- Media library
- Content editor
- Publishing functionality

### 4. Theme Tests (`tests/theme/`)
- Theme management
- Theme customizer
- Theme editor
- Frontend display
- Responsive design
- Performance

### 5. Plugin Tests (`tests/plugins/`)
- Plugin management
- ACF functionality
- Post SMTP
- User Role Editor
- Other active plugins

### 6. API Tests (`tests/api/`)
- REST API endpoints
- Site health
- Performance metrics
- Security checks
- Database connectivity
- Error handling

## 🔍 Test Utilities

### WordPressTestHelpers Class
Located in `tests/utils/test-helpers.js`, this class provides:
- Login/logout functionality
- Navigation helpers
- Element visibility checks
- Screenshot capture
- WordPress version detection
- Site health status checking

## 🐛 Debugging

### Debug Mode
```bash
./run-qa-tests.sh debug
```

### Headed Mode
```bash
./run-qa-tests.sh headed
```

### UI Mode
```bash
./run-qa-tests.sh ui
```

### Console Logs
Tests automatically capture console errors and warnings.

### Screenshots
Screenshots are taken on test failures and saved to `test-results/screenshots/`.

## 📈 Performance Testing

The test suite includes performance tests that check:
- Page load times
- API response times
- Resource loading
- Mobile performance
- Responsive design

## 🔒 Security Testing

Security tests include:
- Authentication security
- Access control
- Sensitive file exposure
- Security headers
- Directory browsing protection

## 🎨 Customization

### Adding New Tests
1. Create a new test file in the appropriate directory
2. Import the `WordPressTestHelpers` class
3. Use the existing test patterns
4. Add the test to the main test suite if needed

### Modifying Existing Tests
1. Edit the relevant test file
2. Update test descriptions and expectations
3. Run tests to ensure they still pass

### Configuration Changes
1. Modify `playwright.config.js` for global settings
2. Update environment variables for site-specific settings
3. Modify test helpers for common functionality changes

## 📝 Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Descriptions**: Use descriptive test names
3. **Proper Assertions**: Use appropriate expect statements
4. **Error Handling**: Handle expected errors gracefully
5. **Performance**: Keep tests fast and efficient
6. **Maintenance**: Keep tests up to date with site changes

## 🆘 Troubleshooting

### Common Issues

1. **Browser Installation Issues**
   ```bash
   npx playwright install --force
   ```

2. **Login Failures**
   - Check credentials in environment variables
   - Verify site accessibility
   - Check for CAPTCHA or security measures

3. **Test Timeouts**
   - Increase timeout in `playwright.config.js`
   - Check site performance
   - Verify network connectivity

4. **Element Not Found**
   - Check if element selectors are correct
   - Verify page has loaded completely
   - Check for dynamic content loading

### Getting Help
1. Check the test output for error messages
2. Review screenshots in `test-results/screenshots/`
3. Use debug mode to step through tests
4. Check Playwright documentation

## 📄 License

This test suite is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add or modify tests
4. Run the test suite
5. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review test output and screenshots
3. Create an issue in the repository
4. Contact the QA team

---

**Happy Testing! 🎉**
