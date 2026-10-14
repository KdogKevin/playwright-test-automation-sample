import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PASSWORD, users } from './data/users';

type Pages = {
  loginPage: LoginPage;
  inventory: InventoryPage;
  checkout: CheckoutPage;
  /** An inventory page already logged in as the standard user. */
  shop: InventoryPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventory: async ({ page }, use) => use(new InventoryPage(page)),
  checkout: async ({ page }, use) => use(new CheckoutPage(page)),
  shop: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.standard, PASSWORD);
    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    await use(inventory);
  },
});

export { expect } from '@playwright/test';
