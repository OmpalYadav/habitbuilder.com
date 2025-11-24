import { test, expect } from '@playwright/test';

test('register and login flow', async ({ page }) => {
    await page.goto('http://localhost:5173/signup');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.getByText("Today's Habits")).toBeVisible();
});
