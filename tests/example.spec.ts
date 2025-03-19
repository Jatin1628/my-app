import { test, expect } from '@playwright/test';

test('example test case', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const title = await page.title();
    expect(title).toBe('Expected Title');
});