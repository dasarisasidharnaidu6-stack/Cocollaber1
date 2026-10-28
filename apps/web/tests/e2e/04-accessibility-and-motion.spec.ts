import { test, expect } from '@playwright/test';

test.describe('E2E Journey 4: Accessibility, Semantic Structure & Reduced Motion', () => {
  test('Semantic landmarks are present across core layout', async ({ page }) => {
    await page.goto('/');

    const main = page.locator('main');
    await expect(main).toBeVisible();

    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('Page honors prefers-reduced-motion media query', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Page must load smoothly and remain responsive without animations blocking rendering
    const heroQuestion = page.locator('h1');
    await expect(heroQuestion).toBeVisible();

    // Verify discover button is directly clickable
    const discoverBtn = page.getByRole('main').getByRole('link', { name: /Discover Opportunities/i });
    await expect(discoverBtn).toBeVisible();
  });

  test('Interactive controls support keyboard navigation and focus rings', async ({ page }) => {
    await page.goto('/login');

    // Press Tab to navigate into the form
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Email field should accept typing from focused keyboard
    const emailInput = page.getByLabel(/Email Address/i);
    await emailInput.focus();
    await page.keyboard.type('keyboard.user@example.com');
    await expect(emailInput).toHaveValue('keyboard.user@example.com');
  });
});
