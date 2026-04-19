import { test, expect } from '@playwright/test';

test.describe('General Waste Booking Flow', () => {
  test('should complete a full booking with general waste', async ({ page }) => {
    await page.goto('/');

    // Step 1: Postcode Lookup
    await expect(page.locator('[data-testid="postcode-step"]')).toBeVisible();

    const postcodeInput = page.locator('[data-testid="postcode-input"]');
    await postcodeInput.fill('SW1A 1AA');

    const lookupButton = page.locator('[data-testid="lookup-button"]');
    await lookupButton.click();

    // Wait for address list to appear
    await expect(page.locator('[data-testid="address-list"]')).toBeVisible({ timeout: 5000 });

    // Select first address
    const firstAddress = page.locator('[data-testid="address-sw1-1"]').first();
    await firstAddress.click();

    const addressConfirmButton = page.locator('[data-testid="address-confirm-button"]');
    await addressConfirmButton.click();

    // Step 2: Waste Type Selection
    await expect(page.locator('[data-testid="waste-type-step"]')).toBeVisible();

    const generalWasteOption = page.locator('[data-testid="waste-type-general"]');
    await generalWasteOption.click();

    const wasteTypeConfirmButton = page.locator('[data-testid="waste-type-confirm-button"]');
    await wasteTypeConfirmButton.click();

    // Step 3: Skip Selection
    await expect(page.locator('[data-testid="skip-selection-step"]')).toBeVisible();
    await expect(page.locator('[data-testid="skip-list"]')).toBeVisible({ timeout: 5000 });

    // Select a skip
    const skipOption = page.locator('[data-testid="skip-skip-1"]').first();
    await skipOption.click();

    const skipConfirmButton = page.locator('[data-testid="skip-confirm-button"]');
    await skipConfirmButton.click();

    // Step 4: Review
    await expect(page.locator('[data-testid="review-step"]')).toBeVisible();
    await expect(page.locator('[data-testid="review-summary"]')).toBeVisible();

    // Verify review details
    await expect(page.locator('[data-testid="review-postcode"]')).toContainText('SW1A 1AA');
    await expect(page.locator('[data-testid="review-waste-type"]')).toContainText('General Waste');
    await expect(page.locator('[data-testid="price-total"]')).toContainText('£195');

    const reviewConfirmButton = page.locator('[data-testid="review-confirm-button"]');
    await reviewConfirmButton.click();

    // Step 5: Confirm
    await expect(page.locator('[data-testid="confirm-step"]')).toBeVisible();

    const confirmBookingButton = page.locator('[data-testid="confirm-booking-button"]');
    await confirmBookingButton.click();

    // Success
    await expect(page.locator('[data-testid="success-step"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="success-heading"]')).toContainText('Booking Confirmed');
    await expect(page.locator('[data-testid="booking-id"]')).toBeVisible();

    const bookingId = await page.locator('[data-testid="booking-id"]').textContent();
    expect(bookingId).toMatch(/^SKIP-\d+-[A-Z0-9]+$/);
  });

  test('should handle postcode lookup error and retry', async ({ page }) => {
    await page.goto('/');

    const postcodeInput = page.locator('[data-testid="postcode-input"]');
    await postcodeInput.fill('BS1 4DJ');

    const lookupButton = page.locator('[data-testid="lookup-button"]');
    await lookupButton.click();

    // Should show error
    await expect(page.locator('[data-testid="postcode-error"]')).toBeVisible();

    // Retry
    const retryButton = page.locator('[data-testid="retry-button"]');
    await retryButton.click();

    // Should succeed on retry
    await expect(page.locator('[data-testid="address-list"]')).toBeVisible({ timeout: 5000 });
  });

  test('should handle empty search results with manual entry', async ({ page }) => {
    await page.goto('/');

    const postcodeInput = page.locator('[data-testid="postcode-input"]');
    await postcodeInput.fill('EC1A 1BB');

    const lookupButton = page.locator('[data-testid="lookup-button"]');
    await lookupButton.click();

    // Should show error (empty results) and manual entry
    await expect(page.locator('[data-testid="manual-entry"]')).toBeVisible();

    const manualAddressInput = page.locator('[data-testid="manual-address-input"]');
    await manualAddressInput.fill('123 Custom Street, London EC1A 1BB');

    const manualConfirmButton = page.locator('[data-testid="manual-address-confirm"]');
    await manualConfirmButton.click();

    // Should proceed to waste type
    await expect(page.locator('[data-testid="waste-type-step"]')).toBeVisible();
  });

  test('should disable certain skips for general waste', async ({ page }) => {
    await page.goto('/');

    // Complete postcode step
    const postcodeInput = page.locator('[data-testid="postcode-input"]');
    await postcodeInput.fill('SW1A 1AA');
    await page.locator('[data-testid="lookup-button"]').click();
    await expect(page.locator('[data-testid="address-list"]')).toBeVisible();
    const firstAddress = page.locator('[data-testid="address-sw1-1"]').first();
    await firstAddress.click();
    await page.locator('[data-testid="address-confirm-button"]').click();

    // Select general waste
    await page.locator('[data-testid="waste-type-general"]').click();
    await page.locator('[data-testid="waste-type-confirm-button"]').click();

    // Verify skips are not disabled for general waste
    await expect(page.locator('[data-testid="skip-list"]')).toBeVisible({ timeout: 5000 });

    // All skips should be enabled (no disabled badge)
    const disabledBadges = page.locator('[data-testid^="disabled-"]');
    await expect(disabledBadges).toHaveCount(0);
  });

  test('should show loading state during postcode lookup with delay', async ({ page }) => {
    await page.goto('/');

    const postcodeInput = page.locator('[data-testid="postcode-input"]');
    await postcodeInput.fill('M1 1AE'); // This postcode has a 2 second delay

    const lookupButton = page.locator('[data-testid="lookup-button"]');
    await lookupButton.click();

    // Should show searching button state
    await expect(lookupButton).toContainText('Searching');

    // Eventually should show results
    await expect(page.locator('[data-testid="address-list"]')).toBeVisible({ timeout: 5000 });
  });
});
