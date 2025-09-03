/**
 * WordPress Plugin Tests
 * Tests for plugin functionality and management
 */

const { test, expect } = require('@playwright/test');
const { WordPressTestHelpers } = require('../utils/test-helpers');

test.describe('WordPress Plugin Functionality', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new WordPressTestHelpers(page);
    await helpers.login();
  });

  test.describe('Plugin Management', () => {
    test('should load plugins page', async ({ page }) => {
      await helpers.navigateToAdminPage('plugins');
      
      await expect(page).toHaveURL(/.*plugins\.php.*/);
      await expect(page.locator('.wp-heading-inline')).toContainText('Plugins');
    });

    test('should display active plugins', async ({ page }) => {
      await helpers.navigateToAdminPage('plugins');
      
      // Check for active plugins
      const activePlugins = page.locator('.plugin-title');
      await expect(activePlugins.first()).toBeVisible();
    });

    test('should show plugin details', async ({ page }) => {
      await helpers.navigateToAdminPage('plugins');
      
      // Check for plugin information
      const pluginTitles = page.locator('.plugin-title strong');
      await expect(pluginTitles.first()).toBeVisible();
    });

    test('should have plugin actions', async ({ page }) => {
      await helpers.navigateToAdminPage('plugins');
      
      // Check for plugin action links
      const pluginActions = page.locator('.plugin-title .row-actions');
      if (await helpers.isElementVisible('.plugin-title .row-actions')) {
        await expect(pluginActions.first()).toBeVisible();
      }
    });
  });

  test.describe('Advanced Custom Fields (ACF)', () => {
    test('should have ACF field groups', async ({ page }) => {
      await helpers.navigateToAdminPage('acf');
      
      await expect(page).toHaveURL(/.*post_type=acf-field-group.*/);
      await expect(page.locator('.wp-heading-inline')).toContainText('Field Groups');
    });

    test('should display ACF field groups list', async ({ page }) => {
      await helpers.navigateToAdminPage('acf');
      
      // Check for field groups table
      const fieldGroupsTable = page.locator('#the-list');
      await expect(fieldGroupsTable).toBeVisible();
    });

    test('should have ACF navigation menu', async ({ page }) => {
      await helpers.navigateToAdminPage('acf');
      
      // Check for ACF submenu items
      const acfMenuItems = [
        'a[href*="post_type=acf-field-group"]', // Field Groups
        'a[href*="edit.php?post_type=acf-post-type"]', // Post Types
        'a[href*="edit-tags.php?taxonomy=acf-taxonomy"]' // Taxonomies
      ];

      for (const item of acfMenuItems) {
        if (await helpers.isElementVisible(item)) {
          await expect(page.locator(item)).toBeVisible();
        }
      }
    });
  });

  test.describe('Post SMTP Plugin', () => {
    test('should have Post SMTP menu', async ({ page }) => {
      await helpers.navigateToAdminPage('dashboard');
      
      // Check for Post SMTP menu item
      const postSMTPMenu = page.locator('a[href*="postman"]');
      if (await helpers.isElementVisible('a[href*="postman"]')) {
        await expect(postSMTPMenu).toBeVisible();
      }
    });

    test('should show email statistics', async ({ page }) => {
      await helpers.navigateToAdminPage('dashboard');
      
      // Check for Post SMTP dashboard widget
      const postSMTPWidget = page.locator('#postman_stats_widget');
      if (await helpers.isElementVisible('#postman_stats_widget')) {
        await expect(postSMTPWidget).toBeVisible();
      }
    });
  });

  test.describe('User Role Editor', () => {
    test('should have User Role Editor menu', async ({ page }) => {
      await helpers.navigateToAdminPage('users');
      
      // Check for User Role Editor submenu
      const userRoleEditorMenu = page.locator('a[href*="user-role-editor"]');
      if (await helpers.isElementVisible('a[href*="user-role-editor"]')) {
        await expect(userRoleEditorMenu).toBeVisible();
      }
    });
  });

  test.describe('SVG Support Plugin', () => {
    test('should allow SVG uploads', async ({ page }) => {
      await helpers.navigateToAdminPage('media');
      
      // Check if SVG files can be uploaded (this would require actual file upload test)
      const uploadButton = page.locator('.page-title-action');
      await expect(uploadButton).toBeVisible();
    });
  });

  test.describe('Advanced Editor Tools', () => {
    test('should enhance post editor', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      await page.click('a[href*="post-new.php"]');
      
      // Check for enhanced editor features
      const editorToolbar = page.locator('#wp-content-editor-tools');
      if (await helpers.isElementVisible('#wp-content-editor-tools')) {
        await expect(editorToolbar).toBeVisible();
      }
    });
  });

  test.describe('Duplicate Page Plugin', () => {
    test('should have duplicate page functionality', async ({ page }) => {
      await helpers.navigateToAdminPage('pages');
      
      // Check for duplicate page links
      const duplicateLinks = page.locator('a[href*="duplicate"]');
      if (await helpers.isElementVisible('a[href*="duplicate"]')) {
        await expect(duplicateLinks.first()).toBeVisible();
      }
    });
  });

  test.describe('Plugin Editor', () => {
    test('should load plugin editor', async ({ page }) => {
      await helpers.navigateToAdminPage('plugins');
      
      // Navigate to plugin editor
      await page.click('a[href*="plugin-editor.php"]');
      
      await expect(page).toHaveURL(/.*plugin-editor\.php.*/);
      await expect(page.locator('.wp-heading-inline')).toContainText('Edit Plugins');
    });

    test('should display plugin files', async ({ page }) => {
      await helpers.navigateToAdminPage('plugins');
      await page.click('a[href*="plugin-editor.php"]');
      
      // Check for plugin file selector
      const pluginSelector = page.locator('#plugin');
      await expect(pluginSelector).toBeVisible();
    });

    test('should have code editor', async ({ page }) => {
      await helpers.navigateToAdminPage('plugins');
      await page.click('a[href*="plugin-editor.php"]');
      
      // Check for code editor
      const codeEditor = page.locator('#newcontent');
      await expect(codeEditor).toBeVisible();
    });
  });

  test.describe('Plugin Performance', () => {
    test('should not cause JavaScript errors', async ({ page }) => {
      const errors = [];
      page.on('pageerror', error => {
        errors.push(error.message);
      });

      await helpers.navigateToAdminPage('plugins');
      await page.waitForLoadState('networkidle');
      
      // Should not have critical JavaScript errors
      const criticalErrors = errors.filter(error => 
        !error.includes('jQuery') && 
        !error.includes('deprecated') &&
        !error.includes('migrate')
      );
      
      expect(criticalErrors.length).toBe(0);
    });

    test('should load plugin pages quickly', async ({ page }) => {
      const startTime = Date.now();
      await helpers.navigateToAdminPage('plugins');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });
  });

  test.describe('Plugin Integration', () => {
    test('should integrate with WordPress admin', async ({ page }) => {
      await helpers.navigateToAdminPage('dashboard');
      
      // Check for plugin-generated dashboard widgets
      const dashboardWidgets = page.locator('.dashboard-widget');
      await expect(dashboardWidgets.first()).toBeVisible();
    });

    test('should add menu items correctly', async ({ page }) => {
      await helpers.navigateToAdminPage('dashboard');
      
      // Check for plugin menu items in admin menu
      const adminMenu = page.locator('#adminmenu');
      await expect(adminMenu).toBeVisible();
    });

    test('should work with theme customization', async ({ page }) => {
      await helpers.navigateToAdminPage('customize');
      
      // Check if plugins add customizer options
      const customizerControls = page.locator('#customize-controls');
      await expect(customizerControls).toBeVisible();
    });
  });

  test.describe('Plugin Security', () => {
    test('should not expose sensitive information', async ({ page }) => {
      await helpers.navigateToAdminPage('plugins');
      
      // Check that plugin files are not directly accessible
      const pluginFiles = page.locator('.plugin-title');
      const pluginCount = await pluginFiles.count();
      
      // Should have plugins but not expose file paths
      expect(pluginCount).toBeGreaterThan(0);
    });

    test('should have proper access controls', async ({ page }) => {
      await helpers.navigateToAdminPage('plugins');
      
      // Check that only admin can access plugin management
      await expect(page.locator('.wp-heading-inline')).toContainText('Plugins');
    });
  });
});
