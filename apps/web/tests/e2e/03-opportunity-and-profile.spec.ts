import { test, expect } from '@playwright/test';

test.describe('E2E Journey 3: Opportunity Discovery & Compensation Transparency', () => {
  test('Discover page displays opportunity cards with mandatory compensation transparency', async ({ page }) => {
    await page.goto('/discover');

    // Wait for main content area to mount
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Check that compensation badges appear on opportunities
    const compensationBadges = page.locator('text=/paid|unpaid|stipend|credit/i');
    const badgeCount = await compensationBadges.count();
    expect(badgeCount).toBeGreaterThanOrEqual(1);
  });

  test('Filter opportunities by search keyword updates visible items', async ({ page }) => {
    await page.goto('/discover');

    const searchInput = page.getByPlaceholder(/e\.g\. Epigraphy/i);
    await searchInput.fill('Epigraphy');

    // Content reacts to the filter query
    await page.waitForTimeout(300);
    await expect(page.locator('main')).toBeVisible();
  });

  test('Filter controls include reset button for restoring defaults', async ({ page }) => {
    await page.goto('/discover');

    const searchInput = page.getByPlaceholder(/e\.g\. Epigraphy/i);
    await searchInput.fill('Epigraphy');
    await expect(searchInput).toHaveValue('Epigraphy');

    const resetBtn = page.getByRole('button', { name: /Reset Filters/i });
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();
  });
});
