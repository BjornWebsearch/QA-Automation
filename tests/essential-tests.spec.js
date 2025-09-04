const { test, expect } = require('@playwright/test');

test.describe('WordPress Essential Health Check', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for slow sites
    test.setTimeout(120000);
  });

  test('🌐 Website loads successfully', async ({ page }) => {
    const response = await page.goto(process.env.WP_BASE_URL || 'https://beratta.websearchpro.net');
    expect(response.status()).toBe(200);
    
    // Check that the page title is not empty
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('🔐 Admin login page is accessible', async ({ page }) => {
    const loginUrl = `${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-admin/`;
    const response = await page.goto(loginUrl);
    expect(response.status()).toBe(200);
    
    // Check for login form elements
    await expect(page.locator('#user_login')).toBeVisible();
    await expect(page.locator('#user_pass')).toBeVisible();
    await expect(page.locator('#wp-submit')).toBeVisible();
  });

  test('👤 Admin login works with valid credentials', async ({ page }) => {
    const loginUrl = `${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-admin/`;
    await page.goto(loginUrl);
    
    // Fill login form
    await page.fill('#user_login', process.env.WP_ADMIN_USER || 'admin');
    await page.fill('#user_pass', process.env.WP_ADMIN_PASS || 'taJdMiIvQdht4XGO%!ycgk6Z');
    await page.click('#wp-submit');
    
    // Wait for redirect to dashboard
    await page.waitForURL(/.*wp-admin.*/, { timeout: 30000 });
    
    // Check that we're on the dashboard
    await expect(page.locator('#wpbody-content')).toBeVisible();
  });

  test('📊 WordPress dashboard loads after login', async ({ page }) => {
    // Login first
    const loginUrl = `${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-admin/`;
    await page.goto(loginUrl);
    await page.fill('#user_login', process.env.WP_ADMIN_USER || 'admin');
    await page.fill('#user_pass', process.env.WP_ADMIN_PASS || 'taJdMiIvQdht4XGO%!ycgk6Z');
    await page.click('#wp-submit');
    await page.waitForURL(/.*wp-admin.*/, { timeout: 30000 });
    
    // Check dashboard elements
    await expect(page.locator('#wpbody-content')).toBeVisible();
    
    // Check for WordPress admin menu
    await expect(page.locator('#adminmenu')).toBeVisible();
  });

  test('📝 Posts section is accessible', async ({ page }) => {
    // Login first
    const loginUrl = `${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-admin/`;
    await page.goto(loginUrl);
    await page.fill('#user_login', process.env.WP_ADMIN_USER || 'admin');
    await page.fill('#user_pass', process.env.WP_ADMIN_PASS || 'taJdMiIvQdht4XGO%!ycgk6Z');
    await page.click('#wp-submit');
    await page.waitForURL(/.*wp-admin.*/, { timeout: 30000 });
    
    // Navigate to posts
    await page.goto(`${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-admin/edit.php`);
    
    // Check posts page loads
    await expect(page.locator('#wpbody-content')).toBeVisible();
  });

  test('📄 Pages section is accessible', async ({ page }) => {
    // Login first
    const loginUrl = `${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-admin/`;
    await page.goto(loginUrl);
    await page.fill('#user_login', process.env.WP_ADMIN_USER || 'admin');
    await page.fill('#user_pass', process.env.WP_ADMIN_PASS || 'taJdMiIvQdht4XGO%!ycgk6Z');
    await page.click('#wp-submit');
    await page.waitForURL(/.*wp-admin.*/, { timeout: 30000 });
    
    // Navigate to pages
    await page.goto(`${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-admin/edit.php?post_type=page`);
    
    // Check pages page loads
    await expect(page.locator('#wpbody-content')).toBeVisible();
  });

  test('🎨 Themes section is accessible', async ({ page }) => {
    // Login first
    const loginUrl = `${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-admin/`;
    await page.goto(loginUrl);
    await page.fill('#user_login', process.env.WP_ADMIN_USER || 'admin');
    await page.fill('#user_pass', process.env.WP_ADMIN_PASS || 'taJdMiIvQdht4XGO%!ycgk6Z');
    await page.click('#wp-submit');
    await page.waitForURL(/.*wp-admin.*/, { timeout: 30000 });
    
    // Navigate to themes
    await page.goto(`${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-admin/themes.php`);
    
    // Check themes page loads
    await expect(page.locator('#wpbody-content')).toBeVisible();
  });

  test('🔌 Plugins section is accessible', async ({ page }) => {
    // Login first
    const loginUrl = `${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-admin/`;
    await page.goto(loginUrl);
    await page.fill('#user_login', process.env.WP_ADMIN_USER || 'admin');
    await page.fill('#user_pass', process.env.WP_ADMIN_PASS || 'taJdMiIvQdht4XGO%!ycgk6Z');
    await page.click('#wp-submit');
    await page.waitForURL(/.*wp-admin.*/, { timeout: 30000 });
    
    // Navigate to plugins
    await page.goto(`${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-admin/plugins.php`);
    
    // Check plugins page loads
    await expect(page.locator('#wpbody-content')).toBeVisible();
  });

  test('⚙️ Settings section is accessible', async ({ page }) => {
    // Login first
    const loginUrl = `${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-admin/`;
    await page.goto(loginUrl);
    await page.fill('#user_login', process.env.WP_ADMIN_USER || 'admin');
    await page.fill('#user_pass', process.env.WP_ADMIN_PASS || 'taJdMiIvQdht4XGO%!ycgk6Z');
    await page.click('#wp-submit');
    await page.waitForURL(/.*wp-admin.*/, { timeout: 30000 });
    
    // Navigate to general settings
    await page.goto(`${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-admin/options-general.php`);
    
    // Check settings page loads
    await expect(page.locator('#wpbody-content')).toBeVisible();
  });

  test('🔗 WordPress REST API is working', async ({ page }) => {
    const apiUrl = `${process.env.WP_BASE_URL || 'https://beratta.websearchpro.net'}/wp-json/wp/v2/`;
    const response = await page.request.get(apiUrl);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('description');
  });

  test('📱 Website is mobile-friendly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const response = await page.goto(process.env.WP_BASE_URL || 'https://beratta.websearchpro.net');
    expect(response.status()).toBe(200);
    
    // Check that page loads without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = 375;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow small margin
  });

  test('⚡ Website loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    const response = await page.goto(process.env.WP_BASE_URL || 'https://beratta.websearchpro.net');
    const loadTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    expect(loadTime).toBeLessThan(30000); // Should load within 30 seconds
  });
});
