import { test, expect } from '../../src/fixtures';

test.describe('cart', () => {
  test('adding and removing items updates the cart badge', async ({ shop }) => {
    await shop.addToCart('sauce-labs-backpack');
    await shop.addToCart('sauce-labs-bike-light');
    await expect(shop.cartBadge).toHaveText('2');

    await shop.removeFromCart('sauce-labs-backpack');
    await expect(shop.cartBadge).toHaveText('1');

    await shop.removeFromCart('sauce-labs-bike-light');
    await expect(shop.cartBadge).toBeHidden();
  });

  test('cart keeps its items after a page reload', async ({ shop, page }) => {
    await shop.addToCart('sauce-labs-onesie');
    await page.reload();
    await expect(shop.cartBadge).toHaveText('1');
  });

  test('sorting by price low to high orders the products', async ({ shop }) => {
    await shop.sortBy('lohi');
    const prices = await shop.priceValues();
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorting by name Z to A orders the products', async ({ shop }) => {
    await shop.sortBy('za');
    const names = await shop.names.allTextContents();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });
});
