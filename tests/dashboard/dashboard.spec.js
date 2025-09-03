/**
 * WordPress Dashboard Tests
 * Tests for dashboard functionality and navigation
 */

const { test, expect } = require('@playwright/test');
const { WordPressTestHelpers } = require('../utils/test-helpers');

test.describe('WordPress Dashboard', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new WordPressTestHelpers(page);
    await helpers.login();
  });

  test('should load dashboard successfully', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    
    // Check main dashboard elements
    await expect(page.locator('#wpbody-content')).toBeVisible();
    await expect(page.locator('#wpadminbar')).toBeVisible();
    await expect(page.locator('#adminmenu')).toBeVisible();
    
    // Check dashboard widgets
    await expect(page.locator('.dashboard-widget')).toBeVisible();
  });

  test('should display site information correctly', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    
    // Check "At a Glance" widget
    const atAGlance = page.locator('#dashboard_right_now');
    await expect(atAGlance).toBeVisible();
    
    // Should show post count, page count, etc.
    await expect(atAGlance).toContainText('Post');
    await expect(atAGlance).toContainText('Page');
  });

  test('should show site health status', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    
    // Check for site health widget
    const siteHealth = page.locator('#health_check_status');
    await expect(siteHealth).toBeVisible();
    
    // Should have a status indicator
    await expect(siteHealth.locator('.site-health-status')).toBeVisible();
  });

  test('should display WordPress version', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    
    // Check footer for WordPress version
    const footer = page.locator('#footer-upgrade');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Version');
  });

  test('should have functional navigation menu', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    
    // Test main navigation items
    const navItems = [
      { selector: 'a[href*="edit.php"]', text: 'Posts' },
      { selector: 'a[href*="edit.php?post_type=page"]', text: 'Pages' },
      { selector: 'a[href*="upload.php"]', text: 'Media' },
      { selector: 'a[href*="themes.php"]', text: 'Appearance' },
      { selector: 'a[href*="plugins.php"]', text: 'Plugins' },
      { selector: 'a[href*="users.php"]', text: 'Users' },
      { selector: 'a[href*="options-general.php"]', text: 'Settings' }
    ];

    for (const item of navItems) {
      const element = page.locator(item.selector);
      await expect(element).toBeVisible();
    }
  });

  test('should navigate to posts section', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    await page.click('a[href*="edit.php"]:not([href*="post_type"])');
    
    await expect(page).toHaveURL(/.*edit\.php.*/);
    await expect(page.locator('.wp-heading-inline')).toContainText('Posts');
  });

  test('should navigate to pages section', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    await page.click('a[href*="edit.php?post_type=page"]');
    
    await expect(page).toHaveURL(/.*post_type=page.*/);
    await expect(page.locator('.wp-heading-inline')).toContainText('Pages');
  });

  test('should navigate to media library', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    await page.click('a[href*="upload.php"]');
    
    await expect(page).toHaveURL(/.*upload\.php.*/);
    await expect(page.locator('.wp-heading-inline')).toContainText('Media Library');
  });

  test('should navigate to themes section', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    await page.click('a[href*="themes.php"]');
    
    await expect(page).toHaveURL(/.*themes\.php.*/);
    await expect(page.locator('.wp-heading-inline')).toContainText('Themes');
  });

  test('should navigate to plugins section', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    await page.click('a[href*="plugins.php"]');
    
    await expect(page).toHaveURL(/.*plugins\.php.*/);
    await expect(page.locator('.wp-heading-inline')).toContainText('Plugins');
  });

  test('should navigate to users section', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    await page.click('a[href*="users.php"]');
    
    await expect(page).toHaveURL(/.*users\.php.*/);
    await expect(page.locator('.wp-heading-inline')).toContainText('Users');
  });

  test('should navigate to settings section', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    await page.click('a[href*="options-general.php"]');
    
    await expect(page).toHaveURL(/.*options-general\.php.*/);
    await expect(page.locator('.wp-heading-inline')).toContainText('General Settings');
  });

  test('should display admin bar correctly', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    
    // Check admin bar elements
    await expect(page.locator('#wp-admin-bar-wp-logo')).toBeVisible();
    await expect(page.locator('#wp-admin-bar-site-name')).toBeVisible();
    await expect(page.locator('#wp-admin-bar-user-info')).toBeVisible();
    
    // Check for "Visit Site" link
    await expect(page.locator('#wp-admin-bar-view-site')).toBeVisible();
  });

  test('should handle dashboard widgets', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    
    // Check for common dashboard widgets
    const widgets = [
      '#dashboard_right_now', // At a Glance
      '#health_check_status', // Site Health
      '#dashboard_activity', // Activity
      '#dashboard_quick_press' // Quick Draft
    ];

    for (const widget of widgets) {
      if (await helpers.isElementVisible(widget)) {
        await expect(page.locator(widget)).toBeVisible();
      }
    }
  });

  test('should show recent activity', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    
    // Check for activity widget
    const activityWidget = page.locator('#dashboard_activity');
    if (await helpers.isElementVisible('#dashboard_activity')) {
      await expect(activityWidget).toBeVisible();
    }
  });

  test('should display quick draft functionality', async ({ page }) => {
    await helpers.navigateToAdminPage('dashboard');
    
    // Check for quick draft widget
    const quickDraft = page.locator('#dashboard_quick_press');
    if (await helpers.isElementVisible('#dashboard_quick_press')) {
      await expect(quickDraft).toBeVisible();
      
      // Test quick draft form
      await expect(quickDraft.locator('input[name="post_title"]')).toBeVisible();
      await expect(quickDraft.locator('textarea[name="content"]')).toBeVisible();
    }
  });
});
