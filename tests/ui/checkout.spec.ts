import { test, expect } from '../../src/fixtures';
import { shopper } from '../../src/data/users';

test.describe('checkout', () => {
  test('shopper can buy two items end to end', async ({ shop, checkout, page }) => {
    await shop.addToCart('sauce-labs-backpack');
    await shop.addToCart('sauce-labs-bolt-t-shirt');
    await shop.openCart();
    await expect(checkout.cartItems).toHaveCount(2);

    await checkout.startCheckout();
    await checkout.fillShipping(shopper);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await checkout.finishButton.click();
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
  });

  test('order subtotal equals the sum of item prices', async ({ shop, checkout }) => {
    await shop.addToCart('sauce-labs-backpack');
    await shop.addToCart('sauce-labs-fleece-jacket');
    await shop.openCart();
    await checkout.startCheckout();
    await checkout.fillShipping(shopper);

    const expected = await checkout.itemPriceTotal();
    expect(await checkout.subtotalValue()).toBeCloseTo(expected, 2);
  });

  test('checkout requires a postal code', async ({ shop, checkout, page }) => {
    await shop.addToCart('sauce-labs-backpack');
    await shop.openCart();
    await checkout.startCheckout();
    await checkout.fillShipping({ ...shopper, postalCode: '' });

    await expect(checkout.error).toContainText('Postal Code is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
