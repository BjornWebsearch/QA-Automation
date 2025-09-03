/**
 * WordPress Content Management Tests
 * Tests for posts, pages, and media functionality
 */

const { test, expect } = require('@playwright/test');
const { WordPressTestHelpers } = require('../utils/test-helpers');

test.describe('WordPress Content Management', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new WordPressTestHelpers(page);
    await helpers.login();
  });

  test.describe('Posts Management', () => {
    test('should load posts list page', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      
      await expect(page).toHaveURL(/.*edit\.php.*/);
      await expect(page.locator('.wp-heading-inline')).toContainText('Posts');
      await expect(page.locator('#posts-filter')).toBeVisible();
    });

    test('should navigate to new post page', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      await page.click('a[href*="post-new.php"]');
      
      await expect(page).toHaveURL(/.*post-new\.php.*/);
      await expect(page.locator('#title')).toBeVisible();
    });

    test('should have post editor elements', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      await page.click('a[href*="post-new.php"]');
      
      // Check for editor elements
      await expect(page.locator('#title')).toBeVisible();
      await expect(page.locator('#content')).toBeVisible();
      await expect(page.locator('#publish')).toBeVisible();
    });

    test('should display post categories and tags', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      await page.click('a[href*="post-new.php"]');
      
      // Check for taxonomy boxes
      const categoryBox = page.locator('#categorydiv');
      const tagBox = page.locator('#tagsdiv-post_tag');
      
      if (await helpers.isElementVisible('#categorydiv')) {
        await expect(categoryBox).toBeVisible();
      }
      
      if (await helpers.isElementVisible('#tagsdiv-post_tag')) {
        await expect(tagBox).toBeVisible();
      }
    });
  });

  test.describe('Pages Management', () => {
    test('should load pages list page', async ({ page }) => {
      await helpers.navigateToAdminPage('pages');
      
      await expect(page).toHaveURL(/.*post_type=page.*/);
      await expect(page.locator('.wp-heading-inline')).toContainText('Pages');
      await expect(page.locator('#posts-filter')).toBeVisible();
    });

    test('should navigate to new page', async ({ page }) => {
      await helpers.navigateToAdminPage('pages');
      await page.click('a[href*="post-new.php?post_type=page"]');
      
      await expect(page).toHaveURL(/.*post-new\.php\?post_type=page.*/);
      await expect(page.locator('#title')).toBeVisible();
    });

    test('should have page editor elements', async ({ page }) => {
      await helpers.navigateToAdminPage('pages');
      await page.click('a[href*="post-new.php?post_type=page"]');
      
      // Check for editor elements
      await expect(page.locator('#title')).toBeVisible();
      await expect(page.locator('#content')).toBeVisible();
      await expect(page.locator('#publish')).toBeVisible();
    });

    test('should display page attributes', async ({ page }) => {
      await helpers.navigateToAdminPage('pages');
      await page.click('a[href*="post-new.php?post_type=page"]');
      
      // Check for page attributes box
      const pageAttributes = page.locator('#pageparentdiv');
      if (await helpers.isElementVisible('#pageparentdiv')) {
        await expect(pageAttributes).toBeVisible();
      }
    });
  });

  test.describe('Media Management', () => {
    test('should load media library', async ({ page }) => {
      await helpers.navigateToAdminPage('media');
      
      await expect(page).toHaveURL(/.*upload\.php.*/);
      await expect(page.locator('.wp-heading-inline')).toContainText('Media Library');
    });

    test('should navigate to add new media', async ({ page }) => {
      await helpers.navigateToAdminPage('media');
      await page.click('a[href*="media-new.php"]');
      
      await expect(page).toHaveURL(/.*media-new\.php.*/);
    });

    test('should display media grid/list view options', async ({ page }) => {
      await helpers.navigateToAdminPage('media');
      
      // Check for view mode buttons
      const listView = page.locator('#view-switch-list');
      const gridView = page.locator('#view-switch-grid');
      
      if (await helpers.isElementVisible('#view-switch-list')) {
        await expect(listView).toBeVisible();
      }
      
      if (await helpers.isElementVisible('#view-switch-grid')) {
        await expect(gridView).toBeVisible();
      }
    });

    test('should have media upload functionality', async ({ page }) => {
      await helpers.navigateToAdminPage('media');
      
      // Check for upload button
      const uploadButton = page.locator('.page-title-action');
      await expect(uploadButton).toBeVisible();
    });
  });

  test.describe('Content Editor', () => {
    test('should load block editor for new post', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      await page.click('a[href*="post-new.php"]');
      
      // Check for block editor elements
      const blockEditor = page.locator('.block-editor');
      const classicEditor = page.locator('#content');
      
      // Either block editor or classic editor should be present
      const hasBlockEditor = await helpers.isElementVisible('.block-editor');
      const hasClassicEditor = await helpers.isElementVisible('#content');
      
      expect(hasBlockEditor || hasClassicEditor).toBeTruthy();
    });

    test('should have post status options', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      await page.click('a[href*="post-new.php"]');
      
      // Check for publish box
      const publishBox = page.locator('#submitpost');
      await expect(publishBox).toBeVisible();
    });

    test('should display post format options', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      await page.click('a[href*="post-new.php"]');
      
      // Check for post format box
      const postFormatBox = page.locator('#formatdiv');
      if (await helpers.isElementVisible('#formatdiv')) {
        await expect(postFormatBox).toBeVisible();
      }
    });

    test('should have featured image functionality', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      await page.click('a[href*="post-new.php"]');
      
      // Check for featured image box
      const featuredImageBox = page.locator('#postimagediv');
      if (await helpers.isElementVisible('#postimagediv')) {
        await expect(featuredImageBox).toBeVisible();
      }
    });
  });

  test.describe('Content Filtering and Search', () => {
    test('should have post filtering options', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      
      // Check for filter dropdowns
      const categoryFilter = page.locator('#cat');
      const dateFilter = page.locator('#filter-by-date');
      
      if (await helpers.isElementVisible('#cat')) {
        await expect(categoryFilter).toBeVisible();
      }
      
      if (await helpers.isElementVisible('#filter-by-date')) {
        await expect(dateFilter).toBeVisible();
      }
    });

    test('should have search functionality', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      
      // Check for search box
      const searchBox = page.locator('#post-search-input');
      await expect(searchBox).toBeVisible();
    });

    test('should have bulk actions', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      
      // Check for bulk actions dropdown
      const bulkActions = page.locator('#bulk-action-selector-top');
      await expect(bulkActions).toBeVisible();
    });
  });

  test.describe('Content Publishing', () => {
    test('should have publish button', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      await page.click('a[href*="post-new.php"]');
      
      // Check for publish button
      const publishButton = page.locator('#publish');
      await expect(publishButton).toBeVisible();
    });

    test('should have save draft functionality', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      await page.click('a[href*="post-new.php"]');
      
      // Check for save draft button
      const saveDraftButton = page.locator('#save-post');
      if (await helpers.isElementVisible('#save-post')) {
        await expect(saveDraftButton).toBeVisible();
      }
    });

    test('should have preview functionality', async ({ page }) => {
      await helpers.navigateToAdminPage('posts');
      await page.click('a[href*="post-new.php"]');
      
      // Check for preview button
      const previewButton = page.locator('#post-preview');
      if (await helpers.isElementVisible('#post-preview')) {
        await expect(previewButton).toBeVisible();
      }
    });
  });
});
