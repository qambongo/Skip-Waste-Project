import { test, expect } from '@playwright/test';

test.describe('Heavy & Plasterboard Waste Booking Flow', () => {
  test('should complete booking with heavy waste and disable certain skips', async ({
    page,
  }) => {
    await page.goto('/');

    // Step 1: Postcode Lookup
    const postcodeInput = page.locator('[data-testid="postcode-input"]');
    await postcodeInput.fill('SW1A 1AA');
    await page.locator('[data-testid="lookup-button"]').click();

    await expect(page.locator('[data-testid="address-list"]')).toBeVisible({ timeout: 5000 });
    const firstAddress = page.locator('[data-testid="address-sw1-1"]').first();
    await firstAddress.click();
    await page.locator('[data-testid="address-confirm-button"]').click();

    // Step 2: Select Heavy Waste
    await expect(page.locator('[data-testid="waste-type-step"]')).toBeVisible();
    await page.locator('[data-testid="waste-type-heavy"]').click();
    await page.locator('[data-testid="waste-type-confirm-button"]').click();

    // Step 3: Verify skips are disabled for heavy waste
    await expect(page.locator('[data-testid="skip-list"]')).toBeVisible({ timeout: 5000 });

    // Skip 1 and 2 should NOT be disabled (disabled starts from skip-3)
    // Skip 3 and 4 should be disabled
    const disabledSkip3 = page.locator('[data-testid="skip-skip-3"]').first();
    const disabledSkip4 = page.locator('[data-testid="skip-skip-4"]').first();

    await expect(page.locator('[data-testid="disabled-skip-3"]')).toBeVisible();
    await expect(page.locator('[data-testid="disabled-skip-4"]')).toBeVisible();

    // Select an enabled skip (skip-5)
    const enabledSkip = page.locator('[data-testid="skip-skip-5"]').first();
    await enabledSkip.click();
    await page.locator('[data-testid="skip-confirm-button"]').click();

    // Step 4: Review - verify heavy waste disposal fee
    await expect(page.locator('[data-testid="review-step"]')).toBeVisible();
    await expect(page.locator('[data-testid="review-waste-type"]')).toContainText('Heavy Waste');
    // Heavy waste has £50 disposal fee (vs £20 for general)
    await expect(page.locator('[data-testid="price-disposal"]')).toContainText('£50');

    await page.locator('[data-testid="review-confirm-button"]').click();

    // Step 5: Confirm booking
    await expect(page.locator('[data-testid="confirm-step"]')).toBeVisible();
    await page.locator('[data-testid="confirm-booking-button"]').click();

    // Success
    await expect(page.locator('[data-testid="success-step"]')).toBeVisible({ timeout: 5000 });
  });

  test('should handle plasterboard with branching options', async ({ page }) => {
    await page.goto('/');

    // Complete postcode lookup
    const postcodeInput = page.locator('[data-testid="postcode-input"]');
    await postcodeInput.fill('SW1A 1AA');
    await page.locator('[data-testid="lookup-button"]').click();

    await expect(page.locator('[data-testid="address-list"]')).toBeVisible();
    await page.locator('[data-testid="address-sw1-1"]').first().click();
    await page.locator('[data-testid="address-confirm-button"]').click();

    // Step 2: Select Plasterboard
    await expect(page.locator('[data-testid="waste-type-step"]')).toBeVisible();
    await page.locator('[data-testid="waste-type-plasterboard"]').click();

    // Branching section should appear
    await expect(page.locator('[data-testid="plasterboard-options"]')).toBeVisible();

    // Verify all three options exist
    await expect(page.locator('[data-testid="plasterboard-contaminated"]')).toBeVisible();
    await expect(page.locator('[data-testid="plasterboard-clean"]')).toBeVisible();
    await expect(page.locator('[data-testid="plasterboard-mixed"]')).toBeVisible();

    // Select an option
    await page.locator('[data-testid="plasterboard-contaminated"]').click();

    // Button should now be enabled
    const wasteTypeConfirmButton = page.locator('[data-testid="waste-type-confirm-button"]');
    await expect(wasteTypeConfirmButton).not.toBeDisabled();
    await wasteTypeConfirmButton.click();

    // Should proceed to skip selection
    await expect(page.locator('[data-testid="skip-selection-step"]')).toBeVisible({ timeout: 5000 });
  });

  test('should require plasterboard option selection', async ({ page }) => {
    await page.goto('/');

    // Complete postcode lookup quickly
    const postcodeInput = page.locator('[data-testid="postcode-input"]');
    await postcodeInput.fill('SW1A 1AA');
    await page.locator('[data-testid="lookup-button"]').click();

    await expect(page.locator('[data-testid="address-list"]')).toBeVisible();
    await page.locator('[data-testid="address-sw1-1"]').first().click();
    await page.locator('[data-testid="address-confirm-button"]').click();

    // Select plasterboard but don't select option
    await expect(page.locator('[data-testid="waste-type-step"]')).toBeVisible();
    await page.locator('[data-testid="waste-type-plasterboard"]').click();

    // Confirm button should be disabled
    const confirmButton = page.locator('[data-testid="waste-type-confirm-button"]');
    await expect(confirmButton).toBeDisabled();

    // Select option
    await page.locator('[data-testid="plasterboard-clean"]').click();

    // Now button should be enabled
    await expect(confirmButton).not.toBeDisabled();
  });

  test('should display different price for plasterboard', async ({ page }) => {
    await page.goto('/');

    // Complete flow with plasterboard
    const postcodeInput = page.locator('[data-testid="postcode-input"]');
    await postcodeInput.fill('SW1A 1AA');
    await page.locator('[data-testid="lookup-button"]').click();

    await expect(page.locator('[data-testid="address-list"]')).toBeVisible();
    await page.locator('[data-testid="address-sw1-1"]').first().click();
    await page.locator('[data-testid="address-confirm-button"]').click();

    await page.locator('[data-testid="waste-type-plasterboard"]').click();
    await page.locator('[data-testid="plasterboard-mixed"]').click();
    await page.locator('[data-testid="waste-type-confirm-button"]').click();

    await expect(page.locator('[data-testid="skip-selection-step"]')).toBeVisible({ timeout: 5000 });
    await page.locator('[data-testid="skip-skip-1"]').first().click();
    await page.locator('[data-testid="skip-confirm-button"]').click();

    // In review, should show plasterboard type
    await expect(page.locator('[data-testid="review-waste-type"]')).toContainText('Plasterboard');
    await expect(page.locator('[data-testid="review-waste-type"]')).toContainText('mixed');
  });

  test('should prevent double submission on booking confirmation', async ({ page }) => {
    await page.goto('/');

    // Quick path to confirmation
    const postcodeInput = page.locator('[data-testid="postcode-input"]');
    await postcodeInput.fill('SW1A 1AA');
    await page.locator('[data-testid="lookup-button"]').click();

    await expect(page.locator('[data-testid="address-list"]')).toBeVisible();
    await page.locator('[data-testid="address-sw1-1"]').first().click();
    await page.locator('[data-testid="address-confirm-button"]').click();

    await page.locator('[data-testid="waste-type-general"]').click();
    await page.locator('[data-testid="waste-type-confirm-button"]').click();

    await expect(page.locator('[data-testid="skip-selection-step"]')).toBeVisible({ timeout: 5000 });
    await page.locator('[data-testid="skip-skip-1"]').first().click();
    await page.locator('[data-testid="skip-confirm-button"]').click();

    await expect(page.locator('[data-testid="review-step"]')).toBeVisible();
    await page.locator('[data-testid="review-confirm-button"]').click();

    await expect(page.locator('[data-testid="confirm-step"]')).toBeVisible();

    const confirmButton = page.locator('[data-testid="confirm-booking-button"]');

    // Click twice rapidly
    await confirmButton.click();
    await confirmButton.click();

    // Should eventually show success (not error about duplicate submission)
    await expect(page.locator('[data-testid="success-step"]')).toBeVisible({ timeout: 5000 });
  });

  test('should allow starting new booking from success page', async ({ page }) => {
    await page.goto('/');

    // Complete a full booking
    const postcodeInput = page.locator('[data-testid="postcode-input"]');
    await postcodeInput.fill('SW1A 1AA');
    await page.locator('[data-testid="lookup-button"]').click();

    await expect(page.locator('[data-testid="address-list"]')).toBeVisible();
    await page.locator('[data-testid="address-sw1-1"]').first().click();
    await page.locator('[data-testid="address-confirm-button"]').click();

    await page.locator('[data-testid="waste-type-general"]').click();
    await page.locator('[data-testid="waste-type-confirm-button"]').click();

    await expect(page.locator('[data-testid="skip-selection-step"]')).toBeVisible({ timeout: 5000 });
    await page.locator('[data-testid="skip-skip-2"]').first().click();
    await page.locator('[data-testid="skip-confirm-button"]').click();

    await page.locator('[data-testid="review-confirm-button"]').click();
    await page.locator('[data-testid="confirm-booking-button"]').click();

    await expect(page.locator('[data-testid="success-step"]')).toBeVisible({ timeout: 5000 });

    // Click new booking button
    await page.locator('[data-testid="new-booking-button"]').click();

    // Should be back at postcode step
    await expect(page.locator('[data-testid="postcode-step"]')).toBeVisible();
    await expect(page.locator('[data-testid="postcode-input"]')).toHaveValue('');
  });
});
