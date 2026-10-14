import { test, expect } from '../../src/fixtures';
import { PASSWORD, users } from '../../src/data/users';

test.describe('auth', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in', async ({ loginPage, inventory }) => {
    await loginPage.login(users.standard, PASSWORD);
    await inventory.expectLoaded();
  });

  test('wrong password shows an error and stays on login', async ({ loginPage, page }) => {
    await loginPage.login(users.standard, 'not-the-password');
    await expect(loginPage.error).toContainText('do not match');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('locked-out user is told they are locked out', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut, PASSWORD);
    await expect(loginPage.error).toContainText('locked out');
  });

  test('inventory page cannot be opened without logging in', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(loginPage.error).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
