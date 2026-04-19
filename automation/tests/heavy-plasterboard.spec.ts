import { test, expect } from '@playwright/test';
import { BookingFlow } from '../pages/BookingFlow.js';

test.describe('Heavy & Plasterboard Waste Booking Flow', () => {
  test('should complete booking with heavy waste and disable certain skips', async ({ page }) => {
    const flow = new BookingFlow(page);
    await flow.goto();

    await flow.enterPostcode('SW1A 1AA');
    await flow.selectFirstAddress();
    await flow.selectWasteType('heavy');
    await expect(flow.skipList).toBeVisible({ timeout: 5000 });

    await expect(flow.page.locator('[data-testid="disabled-skip-3"]')).toBeVisible();
    await expect(flow.page.locator('[data-testid="disabled-skip-4"]')).toBeVisible();

    await flow.selectSkip('skip-5');
    await expect(flow.reviewWasteType).toContainText('Heavy Waste');
    await expect(flow.page.locator('[data-testid="price-disposal"]')).toContainText('£50');
    await flow.confirmAndExpectSuccess();
  });

  test('should handle plasterboard with branching options', async ({ page }) => {
    const flow = new BookingFlow(page);
    await flow.goto();
    await flow.enterPostcode('SW1A 1AA');
    await flow.selectFirstAddress();
    
    await flow.page.locator('[data-testid="waste-type-plasterboard"]').click();
    await expect(flow.page.locator('[data-testid="plasterboard-options"]')).toBeVisible();
    
    await expect(flow.page.locator('[data-testid="plasterboard-contaminated"]')).toBeVisible();
    await expect(flow.page.locator('[data-testid="plasterboard-clean"]')).toBeVisible();
    await expect(flow.page.locator('[data-testid="plasterboard-mixed"]')).toBeVisible();
    
    await flow.page.locator('[data-testid="plasterboard-contaminated"]').click();
    await expect(flow.wasteTypeConfirmButton).not.toBeDisabled();
    await flow.wasteTypeConfirmButton.click();
    
    await expect(flow.skipList).toBeVisible({ timeout: 5000 });
  });

  test('should require plasterboard option selection', async ({ page }) => {
    const flow = new BookingFlow(page);
    await flow.goto();
    await flow.enterPostcode('SW1A 1AA');
    await flow.selectFirstAddress();
    
    await flow.page.locator('[data-testid="waste-type-plasterboard"]').click();
    await expect(flow.wasteTypeConfirmButton).toBeDisabled();
    
    await flow.page.locator('[data-testid="plasterboard-clean"]').click();
    await expect(flow.wasteTypeConfirmButton).not.toBeDisabled();
  });

  test('should display different price for plasterboard', async ({ page }) => {
    const flow = new BookingFlow(page);
    await flow.goto();
    await flow.enterPostcode('SW1A 1AA');
    await flow.selectFirstAddress();
    
    await flow.page.locator('[data-testid="waste-type-plasterboard"]').click();
    await flow.page.locator('[data-testid="plasterboard-mixed"]').click();
    await flow.wasteTypeConfirmButton.click();
    
    await flow.selectSkip('skip-1');
    await expect(flow.reviewWasteType).toContainText('Plasterboard');
    await expect(flow.reviewWasteType).toContainText('mixed');
  });

  test('should prevent double submission on booking confirmation', async ({ page }) => {
    const flow = new BookingFlow(page);
    await flow.goto();
    await flow.enterPostcode('SW1A 1AA');
    await flow.selectFirstAddress();
    await flow.selectWasteType('general');
    await flow.selectSkip('skip-1');
    await flow.reviewConfirmButton.click();
    await expect(flow.confirmStep).toBeVisible();
    
    const confirmButton = flow.confirmBookingButton;
    await confirmButton.click();
    await confirmButton.click();
    
    await expect(flow.successStep).toBeVisible({ timeout: 5000 });
  });

  test('should allow starting new booking from success page', async ({ page }) => {
    const flow = new BookingFlow(page);
    await flow.goto();
    await flow.enterPostcode('SW1A 1AA');
    await flow.selectFirstAddress();
    await flow.selectWasteType('general');
    await flow.selectSkip('skip-2');
    await flow.reviewConfirmButton.click();
    await flow.confirmBookingButton.click();
    await expect(flow.successStep).toBeVisible({ timeout: 5000 });
    
    await flow.page.locator('[data-testid="new-booking-button"]').click();
    await expect(flow.postcodeStep).toBeVisible();
    await expect(flow.postcodeInput).toHaveValue('');
  });
});
