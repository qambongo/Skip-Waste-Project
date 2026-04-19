import { test, expect } from '@playwright/test';
import { BookingFlow } from '../pages/BookingFlow.js';

test.describe('General Waste Booking Flow', () => {
  test('should complete a full booking with general waste', async ({ page }) => {
    const flow = new BookingFlow(page);
    await flow.goto();

    await flow.enterPostcode('SW1A 1AA');
    await flow.selectFirstAddress();
    await flow.selectWasteType('general');
    await flow.selectSkip('skip-1');
    await flow.verifyReview('SW1A 1AA', 'General Waste', '£195');
    await flow.confirmAndExpectSuccess();
  });

  test('should handle postcode lookup error and retry', async ({ page }) => {
    const flow = new BookingFlow(page);
    await flow.goto();
    await flow.enterPostcode('BS1 4DJ');
    await flow.handlePostcodeError();
  });

  test('should handle empty search results with manual entry', async ({ page }) => {
    const flow = new BookingFlow(page);
    await flow.goto();
    await flow.enterPostcode('EC1A 1BB');
    await flow.manualAddressEntry('123 Custom Street, London EC1A 1BB');
  });

  test('should disable certain skips for general waste', async ({ page }) => {
    const flow = new BookingFlow(page);
    await flow.goto();
    await flow.enterPostcode('SW1A 1AA');
    await flow.selectFirstAddress();
    await flow.selectWasteType('general');
    await flow.verifyNoDisabledSkips();
  });

  test('should show loading state during postcode lookup with delay', async ({ page }) => {
    const flow = new BookingFlow(page);
    await flow.goto();
    await flow.postcodeInput.fill('M1 1AE'); 
    await flow.lookupButton.click();
    await expect(flow.lookupButton).toContainText('Searching');
    await expect(flow.addressList).toBeVisible({ timeout: 5000 });
  });
});
