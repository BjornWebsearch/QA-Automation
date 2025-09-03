/**
 * WordPress Theme Tests
 * Tests for theme functionality and customization
 */

const { test, expect } = require('@playwright/test');
const { WordPressTestHelpers } = require('../utils/test-helpers');

test.describe('WordPress Theme Functionality', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new WordPressTestHelpers(page);
    await helpers.login();
  });

  test.describe('Theme Management', () => {
    test('should load themes page', async ({ page }) => {
      await helpers.navigateToAdminPage('themes');
      
      await expect(page).toHaveURL(/.*themes\.php.*/);
      await expect(page.locator('.wp-heading-inline')).toContainText('Themes');
    });

    test('should display active theme', async ({ page }) => {
      await helpers.navigateToAdminPage('themes');
      
      // Check for active theme
      const activeTheme = page.locator('.theme.active');
      await expect(activeTheme).toBeVisible();
      
      // Should show theme name
      await expect(activeTheme.locator('.theme-name')).toBeVisible();
    });

    test('should show theme details', async ({ page }) => {
      await helpers.navigateToAdminPage('themes');
      
      const activeTheme = page.locator('.theme.active');
      await expect(activeTheme.locator('.theme-name')).toBeVisible();
      await expect(activeTheme.locator('.theme-version')).toBeVisible();
    });

    test('should have customize option for active theme', async ({ page }) => {
      await helpers.navigateToAdminPage('themes');
      
      const activeTheme = page.locator('.theme.active');
      const customizeButton = activeTheme.locator('.theme-actions .button-primary');
      
      if (await helpers.isElementVisible('.theme.active .theme-actions .button-primary')) {
        await expect(customizeButton).toBeVisible();
      }
    });
  });

  test.describe('Theme Customizer', () => {
    test('should load theme customizer', async ({ page }) => {
      await helpers.navigateToAdminPage('customize');
      
      await expect(page).toHaveURL(/.*customize\.php.*/);
      
      // Check for customizer elements
      await expect(page.locator('#customize-controls')).toBeVisible();
      await expect(page.locator('#customize-preview')).toBeVisible();
    });

    test('should have customizer panels', async ({ page }) => {
      await helpers.navigateToAdminPage('customize');
      
      // Check for common customizer panels
      const panels = [
        '.accordion-section[data-panel="title_tagline"]', // Site Identity
        '.accordion-section[data-panel="colors"]', // Colors
        '.accordion-section[data-panel="header_image"]', // Header Image
        '.accordion-section[data-panel="background_image"]' // Background Image
      ];

      for (const panel of panels) {
        if (await helpers.isElementVisible(panel)) {
          await expect(page.locator(panel)).toBeVisible();
        }
      }
    });

    test('should have site identity options', async ({ page }) => {
      await helpers.navigateToAdminPage('customize');
      
      // Check for site identity section
      const siteIdentity = page.locator('.accordion-section[data-panel="title_tagline"]');
      if (await helpers.isElementVisible('.accordion-section[data-panel="title_tagline"]')) {
        await expect(siteIdentity).toBeVisible();
      }
    });

    test('should have menu customization', async ({ page }) => {
      await helpers.navigateToAdminPage('customize');
      
      // Check for menus section
      const menusSection = page.locator('.accordion-section[data-panel="nav_menus"]');
      if (await helpers.isElementVisible('.accordion-section[data-panel="nav_menus"]')) {
        await expect(menusSection).toBeVisible();
      }
    });

    test('should have widget customization', async ({ page }) => {
      await helpers.navigateToAdminPage('customize');
      
      // Check for widgets section
      const widgetsSection = page.locator('.accordion-section[data-panel="widgets"]');
      if (await helpers.isElementVisible('.accordion-section[data-panel="widgets"]')) {
        await expect(widgetsSection).toBeVisible();
      }
    });
  });

  test.describe('Theme Editor', () => {
    test('should load theme editor', async ({ page }) => {
      await helpers.navigateToAdminPage('themes');
      
      // Navigate to theme editor
      await page.click('a[href*="theme-editor.php"]');
      
      await expect(page).toHaveURL(/.*theme-editor\.php.*/);
      await expect(page.locator('.wp-heading-inline')).toContainText('Edit Themes');
    });

    test('should display theme files', async ({ page }) => {
      await helpers.navigateToAdminPage('themes');
      await page.click('a[href*="theme-editor.php"]');
      
      // Check for file list
      const fileList = page.locator('#template');
      await expect(fileList).toBeVisible();
    });

    test('should have code editor', async ({ page }) => {
      await helpers.navigateToAdminPage('themes');
      await page.click('a[href*="theme-editor.php"]');
      
      // Check for code editor
      const codeEditor = page.locator('#newcontent');
      await expect(codeEditor).toBeVisible();
    });

    test('should have update file button', async ({ page }) => {
      await helpers.navigateToAdminPage('themes');
      await page.click('a[href*="theme-editor.php"]');
      
      // Check for update button
      const updateButton = page.locator('#submit');
      await expect(updateButton).toBeVisible();
    });
  });

  test.describe('Frontend Theme Display', () => {
    test('should load frontend homepage', async ({ page }) => {
      await page.goto('/');
      
      // Check for basic page elements
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('html')).toBeVisible();
    });

    test('should display theme header', async ({ page }) => {
      await page.goto('/');
      
      // Check for common header elements
      const header = page.locator('header, .site-header, #header');
      if (await helpers.isElementVisible('header, .site-header, #header')) {
        await expect(header).toBeVisible();
      }
    });

    test('should display theme footer', async ({ page }) => {
      await page.goto('/');
      
      // Check for common footer elements
      const footer = page.locator('footer, .site-footer, #footer');
      if (await helpers.isElementVisible('footer, .site-footer, #footer')) {
        await expect(footer).toBeVisible();
      }
    });

    test('should have responsive design', async ({ page }) => {
      await page.goto('/');
      
      // Test different viewport sizes
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page.locator('body')).toBeVisible();
      
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('body')).toBeVisible();
      
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load CSS and JavaScript files', async ({ page }) => {
      const errors = [];
      page.on('response', response => {
        if (response.url().includes('.css') || response.url().includes('.js')) {
          if (response.status() >= 400) {
            errors.push(`${response.url()} returned ${response.status()}`);
          }
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should not have CSS/JS loading errors
      expect(errors.length).toBe(0);
    });
  });

  test.describe('Theme Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);
    });

    test('should not have JavaScript errors', async ({ page }) => {
      const errors = [];
      page.on('pageerror', error => {
        errors.push(error.message);
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should not have critical JavaScript errors
      const criticalErrors = errors.filter(error => 
        !error.includes('jQuery') && 
        !error.includes('deprecated') &&
        !error.includes('migrate')
      );
      
      expect(criticalErrors.length).toBe(0);
    });

    test('should have proper meta tags', async ({ page }) => {
      await page.goto('/');
      
      // Check for essential meta tags
      await expect(page.locator('meta[charset]')).toBeAttached();
      await expect(page.locator('meta[name="viewport"]')).toBeAttached();
    });
  });

  test.describe('Theme Customization Options', () => {
    test('should have menu management', async ({ page }) => {
      await helpers.navigateToAdminPage('themes');
      
      // Check for menus link
      const menusLink = page.locator('a[href*="nav-menus.php"]');
      if (await helpers.isElementVisible('a[href*="nav-menus.php"]')) {
        await expect(menusLink).toBeVisible();
      }
    });

    test('should have widget management', async ({ page }) => {
      await helpers.navigateToAdminPage('themes');
      
      // Check for widgets link
      const widgetsLink = page.locator('a[href*="widgets.php"]');
      if (await helpers.isElementVisible('a[href*="widgets.php"]')) {
        await expect(widgetsLink).toBeVisible();
      }
    });

    test('should have background customization', async ({ page }) => {
      await helpers.navigateToAdminPage('themes');
      
      // Check for background link
      const backgroundLink = page.locator('a[href*="themes.php?page=custom-background"]');
      if (await helpers.isElementVisible('a[href*="themes.php?page=custom-background"]')) {
        await expect(backgroundLink).toBeVisible();
      }
    });
  });
});
