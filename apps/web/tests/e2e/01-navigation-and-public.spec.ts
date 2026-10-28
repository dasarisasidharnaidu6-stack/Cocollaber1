import { test, expect } from '@playwright/test';

test.describe('E2E Journey 1: Public Pages & Editorial Navigation', () => {
  test('Home page renders editorial branding, product loop, and hero question', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/CoCollaber/i);

    // Hero headline and product tagline
    const heroQuestion = page.locator('h1');
    await expect(heroQuestion).toContainText('What opportunity are you looking for');

    // Central model badge in main content
    const badge = page.getByRole('main').getByText(/People.*Opportunities.*People/i);
    await expect(badge).toBeVisible();

    // Call to actions in main hero
    const discoverBtn = page.getByRole('main').getByRole('link', { name: /Discover Opportunities/i });
    await expect(discoverBtn).toBeVisible();

    const expressBtn = page.getByRole('main').getByRole('link', { name: /Express an Opportunity/i });
    await expect(expressBtn).toBeVisible();
  });

  test('Visitor can navigate to Discover page and view filter controls', async ({ page }) => {
    await page.goto('/discover');

    // Heading verification
    const heading = page.getByRole('heading', { name: /Discover Opportunities/i });
    await expect(heading).toBeVisible();

    // Search and filter inputs
    const searchInput = page.getByPlaceholder(/e\.g\. Epigraphy/i);
    await expect(searchInput).toBeVisible();

    // Reset button
    const resetBtn = page.getByRole('button', { name: /Reset Filters/i });
    await expect(resetBtn).toBeVisible();
  });

  test('Visitor can navigate to Login page and inspect credentials form', async ({ page }) => {
    await page.goto('/login');

    const heading = page.getByRole('heading', { name: /Welcome Back/i });
    await expect(heading).toBeVisible();

    const emailInput = page.getByLabel(/Email Address/i);
    await expect(emailInput).toBeVisible();

    const passwordInput = page.getByLabel(/Password/i);
    await expect(passwordInput).toBeVisible();

    const submitBtn = page.getByRole('main').getByRole('button', { name: /Sign In/i });
    await expect(submitBtn).toBeVisible();
  });

  test('Visitor can navigate to Register page and inspect onboarding fields', async ({ page }) => {
    await page.goto('/register');

    const heading = page.getByRole('heading', { name: /Join CoCollaber/i });
    await expect(heading).toBeVisible();

    const nameInput = page.getByLabel(/Your Name or Alias/i);
    await expect(nameInput).toBeVisible();

    const emailInput = page.getByLabel(/Email Address/i);
    await expect(emailInput).toBeVisible();

    const passwordInput = page.getByLabel(/Password/i);
    await expect(passwordInput).toBeVisible();

    const createBtn = page.getByRole('button', { name: /Create Account/i });
    await expect(createBtn).toBeVisible();
  });
});
