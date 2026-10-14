import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly itemPrices: Locator;
  readonly subtotal: Locator;
  readonly completeHeader: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.error = page.getByTestId('error');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotal = page.getByTestId('subtotal-label');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async startCheckout() {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
  }

  async fillShipping(info: { firstName: string; lastName: string; postalCode: string }) {
    await this.firstName.fill(info.firstName);
    await this.lastName.fill(info.lastName);
    await this.postalCode.fill(info.postalCode);
    await this.continueButton.click();
  }

  async itemPriceTotal(): Promise<number> {
    const texts = await this.itemPrices.allTextContents();
    return texts.reduce((sum, t) => sum + Number(t.replace('$', '')), 0);
  }

  async subtotalValue(): Promise<number> {
    const text = (await this.subtotal.textContent()) ?? '';
    return Number(text.replace(/[^0-9.]/g, ''));
  }
}
