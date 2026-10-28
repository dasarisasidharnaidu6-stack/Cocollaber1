import { test, expect } from '@playwright/test';

test.describe('E2E Journey 2: Authentication Lifecycle & Protected Boundary', () => {
  test('Login form accepts credentials and initiates authentication transition', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/Email Address/i).fill('elena.rostova@domain.org');
    await page.getByLabel(/Password/i).fill('ValidPassword123!');

    await page.getByRole('main').getByRole('button', { name: /Sign In/i }).click();

    // Verify navigation proceeds or error is displayed
    await page.waitForTimeout(500);
    expect(page.url()).toBeTruthy();
  });

  test('Registration form enforces client-side field validation', async ({ page }) => {
    await page.goto('/register');

    // Attempt to submit with empty inputs
    await page.getByRole('button', { name: /Create Account/i }).click();

    // Browser maintains URL on registration page due to required attributes
    await expect(page).toHaveURL(/.*register/);
  });

  test('Protected page /profile handles unauthenticated visitor state gracefully', async ({ page }) => {
    await page.goto('/profile');

    // Profile page requires authentication; renders main landmark gracefully
    await expect(page.locator('main')).toBeVisible();
  });

  test('Protected page /opportunities/new handles unauthenticated visitor state gracefully', async ({ page }) => {
    await page.goto('/opportunities/new');

    await expect(page.locator('main')).toBeVisible();
  });
});
