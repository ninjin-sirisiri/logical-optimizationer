import { test, expect } from '@playwright/test';

test.describe('Logical Optimization Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should optimize a simple logical expression', async ({ page }) => {
    const input = page.getByPlaceholder('e.g. A & B | ~C');
    await input.fill('A & B');

    // Click Optimize
    await page.getByRole('button', { name: 'Optimize' }).click();

    // Verify result section appears
    await expect(page.getByText('Optimized Expression')).toBeVisible();

    // ExpressionDisplay renders Y = ..., check for Y
    await expect(page.getByText('Y', { exact: true })).toBeVisible();
  });

  test('should switch to Truth Table mode and optimize', async ({ page }) => {
    // 1. Switch to Table mode
    await page.getByRole('button', { name: 'Truth Table' }).click();

    // 2. Verify table exists
    await expect(page.getByRole('table')).toBeVisible();

    // 3. Optimize (default table has inputs)
    await page.getByRole('button', { name: 'Optimize' }).click();
    await expect(page.getByText('Optimized Expression')).toBeVisible();
  });

  test('should trigger variable limit guard', async ({ page }) => {
    // Enter expression with 7 variables
    const input = page.getByPlaceholder('e.g. A & B | ~C');
    // A, B, C, D, E, F, G (7 vars)
    await input.fill('A & B & C & D & E & F & G');

    await page.getByRole('button', { name: 'Optimize' }).click();

    // Verify Toast error
    // Sonner toasts render in the DOM, usually within a list.
    // We look for the text "Too many variables".
    await expect(page.getByText('Too many variables')).toBeVisible();
  });
});
