import { Page, Locator, expect } from '@playwright/test';

export class BookingFlow {
  readonly page: Page;
  readonly postcodeStep: Locator;
  readonly postcodeInput: Locator;
  readonly lookupButton: Locator;
  readonly addressList: Locator;
  readonly addressSw1: Locator;
  readonly addressConfirmButton: Locator;
  readonly wasteTypeStep: Locator;
  readonly wasteTypeConfirmButton: Locator;
  readonly skipList: Locator;
  readonly skipConfirmButton: Locator;
  readonly reviewStep: Locator;
  readonly reviewSummary: Locator;
  readonly reviewPostcode: Locator;
  readonly reviewWasteType: Locator;
  readonly priceTotal: Locator;
  readonly reviewConfirmButton: Locator;
  readonly confirmStep: Locator;
  readonly confirmBookingButton: Locator;
  readonly successStep: Locator;
  readonly successHeading: Locator;
  readonly bookingId: Locator;
  readonly postcodeError: Locator;
  readonly retryButton: Locator;
  readonly manualEntry: Locator;
  readonly manualAddressInput: Locator;
  readonly manualAddressConfirm: Locator;
  readonly disabledBadges: Locator;

  constructor(page: Page) {
    this.page = page;
    this.postcodeStep = page.locator('[data-testid="postcode-step"]');
    this.postcodeInput = page.locator('[data-testid="postcode-input"]');
    this.lookupButton = page.locator('[data-testid="lookup-button"]');
    this.addressList = page.locator('[data-testid="address-list"]');
    this.addressSw1 = page.locator('[data-testid="address-sw1-1"]').first();
    this.addressConfirmButton = page.locator('[data-testid="address-confirm-button"]');
    this.wasteTypeStep = page.locator('[data-testid="waste-type-step"]');
    this.wasteTypeConfirmButton = page.locator('[data-testid="waste-type-confirm-button"]');
    this.skipList = page.locator('[data-testid="skip-list"]');
    this.skipConfirmButton = page.locator('[data-testid="skip-confirm-button"]');
    this.reviewStep = page.locator('[data-testid="review-step"]');
    this.reviewSummary = page.locator('[data-testid="review-summary"]');
    this.reviewPostcode = page.locator('[data-testid="review-postcode"]');
    this.reviewWasteType = page.locator('[data-testid="review-waste-type"]');
    this.priceTotal = page.locator('[data-testid="price-total"]');
    this.reviewConfirmButton = page.locator('[data-testid="review-confirm-button"]');
    this.confirmStep = page.locator('[data-testid="confirm-step"]');
    this.confirmBookingButton = page.locator('[data-testid="confirm-booking-button"]');
    this.successStep = page.locator('[data-testid="success-step"]');
    this.successHeading = page.locator('[data-testid="success-heading"]');
    this.bookingId = page.locator('[data-testid="booking-id"]');
    this.postcodeError = page.locator('[data-testid="postcode-error"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    this.manualEntry = page.locator('[data-testid="manual-entry"]');
    this.manualAddressInput = page.locator('[data-testid="manual-address-input"]');
    this.manualAddressConfirm = page.locator('[data-testid="manual-address-confirm"]');
    this.disabledBadges = page.locator('[data-testid^="disabled-"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async enterPostcode(postcode: string) {
    await this.postcodeInput.fill(postcode);
    await this.lookupButton.click();
  }

  async selectFirstAddress() {
    await expect(this.addressList).toBeVisible({ timeout: 5000 });
    await this.addressSw1.click();
    await this.addressConfirmButton.click();
  }

  async selectWasteType(type: string) {
    await expect(this.wasteTypeStep).toBeVisible();
    await this.page.locator(`[data-testid="waste-type-${type}"]`).click();
    await this.wasteTypeConfirmButton.click();
  }

  async selectSkip(skipId: string) {
    await expect(this.skipList).toBeVisible({ timeout: 5000 });
    await this.page.locator(`[data-testid="skip-${skipId}"]`).first().click();
    await this.skipConfirmButton.click();
  }

  async verifyReview(postcode: string, wasteType: string, price: string) {
    await expect(this.reviewStep).toBeVisible();
    await expect(this.reviewSummary).toBeVisible();
    await expect(this.reviewPostcode).toContainText(postcode);
    await expect(this.reviewWasteType).toContainText(wasteType);
    await expect(this.priceTotal).toContainText(price);
  }

  async confirmAndExpectSuccess() {
    await this.reviewConfirmButton.click();
    await expect(this.confirmStep).toBeVisible();
    await this.confirmBookingButton.click();
    await expect(this.successStep).toBeVisible({ timeout: 5000 });
    await expect(this.successHeading).toContainText('Booking Confirmed');
    await expect(this.bookingId).toBeVisible();
    const id = await this.bookingId.textContent();
    expect(id).toMatch(/^SKIP-\\d+-[A-Z0-9]+$/);
    return id;
  }

  async verifyNoDisabledSkips() {
    await expect(this.disabledBadges).toHaveCount(0);
  }

  async handlePostcodeError() {
    await expect(this.postcodeError).toBeVisible();
    await this.retryButton.click();
    await expect(this.addressList).toBeVisible({ timeout: 5000 });
  }

  async manualAddressEntry(address: string) {
    await expect(this.manualEntry).toBeVisible();
    await this.manualAddressInput.fill(address);
    await this.manualAddressConfirm.click();
    await expect(this.wasteTypeStep).toBeVisible();
  }
}
