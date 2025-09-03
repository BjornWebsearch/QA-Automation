/**
 * WordPress QA Test Helpers
 * Utility functions for WordPress testing
 */

const { expect } = require('@playwright/test');

class WordPressTestHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Login to WordPress admin
   * @param {string} username - Admin username
   * @param {string} password - Admin password
   */
  async login(username = 'admin', password = 'taJdMiIvQdht4XGO%!ycgk6Z') {
    await this.page.goto('/wp-admin');
    await this.page.fill('#user_login', username);
    await this.page.fill('#user_pass', password);
    await this.page.click('#wp-submit');
    
    // Wait for redirect after login
    await this.page.waitForURL(/.*wp-admin.*/, { timeout: 15000 });
    
    // Wait for dashboard to load
    await this.page.waitForLoadState('networkidle');
    
    // Verify login was successful
    await expect(this.page).toHaveURL(/.*wp-admin.*/);
    
    // Check for either dashboard content or admin bar
    const dashboardContent = this.page.locator('#wpbody-content');
    const adminBar = this.page.locator('#wpadminbar');
    
    if (await this.isElementVisible('#wpbody-content')) {
      await expect(dashboardContent).toBeVisible();
    } else if (await this.isElementVisible('#wpadminbar')) {
      await expect(adminBar).toBeVisible();
    }
  }

  /**
   * Logout from WordPress admin
   */
  async logout() {
    await this.page.click('#wp-admin-bar-logout a');
    await this.page.waitForURL(/.*wp-login\.php.*/);
  }

  /**
   * Navigate to a specific admin page
   * @param {string} page - Admin page slug
   */
  async navigateToAdminPage(page) {
    const adminPages = {
      'dashboard': '/wp-admin/',
      'posts': '/wp-admin/edit.php',
      'pages': '/wp-admin/edit.php?post_type=page',
      'media': '/wp-admin/upload.php',
      'themes': '/wp-admin/themes.php',
      'plugins': '/wp-admin/plugins.php',
      'users': '/wp-admin/users.php',
      'settings': '/wp-admin/options-general.php',
      'customize': '/wp-admin/customize.php',
      'site-health': '/wp-admin/site-health.php',
      'tools': '/wp-admin/tools.php',
      'acf': '/wp-admin/edit.php?post_type=acf-field-group'
    };

    const url = adminPages[page];
    if (!url) {
      throw new Error(`Unknown admin page: ${page}`);
    }

    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if element exists and is visible
   * @param {string} selector - CSS selector
   * @returns {boolean}
   */
  async isElementVisible(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get console errors
   * @returns {Array} Array of console error messages
   */
  async getConsoleErrors() {
    const errors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }

  /**
   * Check for JavaScript errors on page load
   */
  async checkForJSErrors() {
    const errors = [];
    this.page.on('pageerror', error => {
      errors.push(error.message);
    });
    return errors;
  }

  /**
   * Take screenshot with timestamp
   * @param {string} name - Screenshot name
   */
  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Check WordPress version
   * @returns {string} WordPress version
   */
  async getWordPressVersion() {
    const versionElement = await this.page.locator('#footer-upgrade').textContent();
    return versionElement?.match(/Version (\d+\.\d+\.\d+)/)?.[1] || 'Unknown';
  }

  /**
   * Check active theme name
   * @returns {string} Active theme name
   */
  async getActiveTheme() {
    await this.navigateToAdminPage('themes');
    const activeTheme = await this.page.locator('.theme.active .theme-name').textContent();
    return activeTheme?.trim() || 'Unknown';
  }

  /**
   * Get list of active plugins
   * @returns {Array} Array of active plugin names
   */
  async getActivePlugins() {
    await this.navigateToAdminPage('plugins');
    const plugins = await this.page.locator('.plugin-title strong').allTextContents();
    return plugins;
  }

  /**
   * Check site health status
   * @returns {Object} Site health information
   */
  async getSiteHealthStatus() {
    await this.navigateToAdminPage('site-health');
    
    const status = await this.page.locator('.site-health-status').textContent();
    const issues = await this.page.locator('.health-check-accordion').count();
    
    return {
      status: status?.trim() || 'Unknown',
      issuesCount: issues
    };
  }
}

module.exports = { WordPressTestHelpers };
