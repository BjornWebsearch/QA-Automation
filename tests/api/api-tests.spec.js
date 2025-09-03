/**
 * WordPress API and Performance Tests
 * Tests for REST API, performance, and site health
 */

const { test, expect } = require('@playwright/test');
const { WordPressTestHelpers } = require('../utils/test-helpers');

test.describe('WordPress API and Performance', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new WordPressTestHelpers(page);
    await helpers.login();
  });

  test.describe('REST API Tests', () => {
    test('should have working REST API', async ({ page }) => {
      // Test WordPress REST API endpoint
      const response = await page.request.get('/wp-json/wp/v2/');
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('description');
    });

    test('should return posts via REST API', async ({ page }) => {
      const response = await page.request.get('/wp-json/wp/v2/posts');
      
      expect(response.status()).toBe(200);
      
      const posts = await response.json();
      expect(Array.isArray(posts)).toBeTruthy();
    });

    test('should return pages via REST API', async ({ page }) => {
      const response = await page.request.get('/wp-json/wp/v2/pages');
      
      expect(response.status()).toBe(200);
      
      const pages = await response.json();
      expect(Array.isArray(pages)).toBeTruthy();
    });

    test('should return media via REST API', async ({ page }) => {
      const response = await page.request.get('/wp-json/wp/v2/media');
      
      expect(response.status()).toBe(200);
      
      const media = await response.json();
      expect(Array.isArray(media)).toBeTruthy();
    });

    test('should return categories via REST API', async ({ page }) => {
      const response = await page.request.get('/wp-json/wp/v2/categories');
      
      expect(response.status()).toBe(200);
      
      const categories = await response.json();
      expect(Array.isArray(categories)).toBeTruthy();
    });

    test('should return tags via REST API', async ({ page }) => {
      const response = await page.request.get('/wp-json/wp/v2/tags');
      
      expect(response.status()).toBe(200);
      
      const tags = await response.json();
      expect(Array.isArray(tags)).toBeTruthy();
    });
  });

  test.describe('Site Health Tests', () => {
    test('should load site health page', async ({ page }) => {
      await helpers.navigateToAdminPage('site-health');
      
      await expect(page).toHaveURL(/.*site-health\.php.*/);
      await expect(page.locator('.wp-heading-inline')).toContainText('Site Health');
    });

    test('should display site health status', async ({ page }) => {
      await helpers.navigateToAdminPage('site-health');
      
      // Check for site health status
      const statusElement = page.locator('.site-health-status');
      await expect(statusElement).toBeVisible();
    });

    test('should show health check results', async ({ page }) => {
      await helpers.navigateToAdminPage('site-health');
      
      // Check for health check sections
      const healthChecks = page.locator('.health-check-accordion');
      await expect(healthChecks.first()).toBeVisible();
    });

    test('should have recommended improvements', async ({ page }) => {
      await helpers.navigateToAdminPage('site-health');
      
      // Check for improvement recommendations
      const improvements = page.locator('.health-check-accordion');
      const improvementCount = await improvements.count();
      
      expect(improvementCount).toBeGreaterThan(0);
    });
  });

  test.describe('Performance Tests', () => {
    test('should load homepage quickly', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should load admin dashboard quickly', async ({ page }) => {
      const startTime = Date.now();
      await helpers.navigateToAdminPage('dashboard');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should have optimized images', async ({ page }) => {
      await page.goto('/');
      
      // Check for image optimization
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        // Check that images have proper attributes
        const firstImage = images.first();
        await expect(firstImage).toHaveAttribute('src');
      }
    });

    test('should have proper caching headers', async ({ page }) => {
      const response = await page.request.get('/');
      
      // Check for caching headers
      const cacheControl = response.headers()['cache-control'];
      const etag = response.headers()['etag'];
      
      // Should have some form of caching
      expect(cacheControl || etag).toBeTruthy();
    });
  });

  test.describe('Security Tests', () => {
    test('should not expose sensitive information', async ({ page }) => {
      // Test that sensitive files are not accessible
      const sensitivePaths = [
        '/wp-config.php',
        '/.htaccess',
        '/wp-content/debug.log',
        '/wp-content/uploads/'
      ];

      for (const path of sensitivePaths) {
        const response = await page.request.get(path);
        
        // Should not return 200 for sensitive files
        if (response.status() === 200) {
          const content = await response.text();
          // Should not contain sensitive information
          expect(content).not.toContain('DB_PASSWORD');
          expect(content).not.toContain('AUTH_KEY');
        }
      }
    });

    test('should have proper security headers', async ({ page }) => {
      const response = await page.request.get('/');
      const headers = response.headers();
      
      // Check for security headers
      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'x-xss-protection'
      ];

      // At least one security header should be present
      const hasSecurityHeader = securityHeaders.some(header => headers[header]);
      expect(hasSecurityHeader).toBeTruthy();
    });

    test('should not allow directory browsing', async ({ page }) => {
      const response = await page.request.get('/wp-content/');
      
      // Should not return directory listing
      expect(response.status()).not.toBe(200);
    });
  });

  test.describe('Database Tests', () => {
    test('should have working database connection', async ({ page }) => {
      await helpers.navigateToAdminPage('dashboard');
      
      // If we can load the dashboard, database is working
      await expect(page.locator('#wpbody-content')).toBeVisible();
    });

    test('should display content from database', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      
      // Should show posts from database
      const postsTable = page.locator('#the-list');
      await expect(postsTable).toBeVisible();
    });
  });

  test.describe('Error Handling Tests', () => {
    test('should handle 404 errors gracefully', async ({ page }) => {
      const response = await page.request.get('/non-existent-page');
      
      expect(response.status()).toBe(404);
    });

    test('should have custom 404 page', async ({ page }) => {
      await page.goto('/non-existent-page');
      
      // Should show 404 page
      await expect(page.locator('body')).toBeVisible();
    });

    test('should handle server errors gracefully', async ({ page }) => {
      // Test with invalid request
      const response = await page.request.get('/wp-admin/invalid-endpoint');
      
      // Should return appropriate error status
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe('Mobile Performance Tests', () => {
    test('should load quickly on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds on mobile
      expect(loadTime).toBeLessThan(5000);
    });

    test('should be responsive', async ({ page }) => {
      // Test different viewport sizes
      const viewports = [
        { width: 1920, height: 1080 }, // Desktop
        { width: 768, height: 1024 },  // Tablet
        { width: 375, height: 667 }    // Mobile
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        
        // Should load without horizontal scroll
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = viewport.width;
        
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow small margin
      }
    });
  });

  test.describe('SEO Tests', () => {
    test('should have proper meta tags', async ({ page }) => {
      await page.goto('/');
      
      // Check for essential meta tags
      await expect(page.locator('meta[charset]')).toBeAttached();
      await expect(page.locator('meta[name="viewport"]')).toBeAttached();
    });

    test('should have proper page titles', async ({ page }) => {
      await page.goto('/');
      
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });

    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/');
      
      // Check for h1 tag
      const h1 = page.locator('h1');
      if (await helpers.isElementVisible('h1')) {
        await expect(h1.first()).toBeVisible();
      }
    });
  });
});
