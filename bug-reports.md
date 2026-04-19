# SkipWaste Booking Flow - Discovered Bugs

## BUG #1: Data/Validation Bug - Price Mismatch Between Selection and Review

**Title:** Skip rental price shown in Review step does not match selected skip price  
**Severity:** MEDIUM  
**Priority:** HIGH  
**Status:** OPEN  
**Date Found:** 2024-10-19  

### Description
The skip rental price displayed in the Price Breakdown section of the Review step is consistently £10 higher than the price shown during selection in the Skip Selection step.

### Steps to Reproduce
1. Enter valid postcode (SW1A 1AA) and select address
2. Select General Waste
3. In Skip Selection, note price of any skip (e.g., 6 Cubic Yards £200)
4. Select the skip and proceed to Review
5. Observe Price Breakdown → Skip Rental shows £210 (incorrect)

### Expected Behavior
- Skip Rental price in Review should exactly match the price shown during selection
- Total calculated as correct skip price + delivery + disposal

### Actual Behavior
- Skip Rental price is always selection price + £10
- Total is inflated accordingly
- Actual booking submission uses correct skip data

### Impact
- Users see inconsistent pricing, erodes trust
- Potential for cart abandonment at checkout
- Misleading totals during review process

### Root Cause
Hard-coded price inflation in ReviewStep component price calculation logic.

### Files Affected
- `ui/src/components/ReviewStep.tsx` - `displayedSkipPrice = skip.price + 10`

### Suggested Fix
Remove price offset: `const displayedSkipPrice = skip.price;`

---

## BUG #2: State/Logic Bug - Disabled Skips Remain Selectable Despite Visual Disable

**Title:** Users can select 'disabled' skips for heavy waste (radio interaction works)  
**Severity:** MEDIUM  
**Priority:** HIGH  
**Status:** OPEN  
**Date Found:** 2024-10-19  

### Description
For heavy waste selections, certain skips show disabled styling and "Not available for heavy waste" badge, but radio buttons remain interactive and selectable. Card clicks also select them.

### Steps to Reproduce
1. Postcode SW1A 1AA → address
2. Select "Heavy Waste"
3. In Skip Selection, find disabled skips (8/10 Cubic Yards with badge)
4. Click radio button or anywhere on card
5. Skip becomes selected → Next button enables → proceeds

### Expected Behavior
- Disabled skips completely unselectable (no radio interaction, no card click)
- Next button remains disabled until valid skip selected

### Actual Behavior
- Visual disabled styling/badge present
- Radio button selectable (no `disabled` prop enforced)
- Card `onClick` fires unconditionally
- User can complete flow with invalid skip

### Impact
- Violates business rules (heavy waste skip restrictions)
- Backend may reject or charge wrong pricing
- Poor UX - visual feedback contradicts interaction


---

## BUG #3: UI/UX Bug - Incorrect Waste Type Label Displayed in Review

**Title:** Heavy Waste bookings show "General Waste" label in Review summary  
**Severity:** LOW  
**Priority:** MEDIUM  
**Status:** OPEN  
**Date Found:** 2024-10-19  

### Description
In Review step, heavy waste selections display "General Waste" label instead of "Heavy Waste".

### Steps to Reproduce
1. Postcode/address → Waste Type: select "Heavy Waste" → Skip → Review
2. Observe "Waste Type" section shows "General Waste"

Plasterboard correctly shows "Heavy Waste".

### Expected Behavior
- Heavy Waste: "Heavy Waste"
- Plasterboard: "Plasterboard" or "Heavy Waste (Plasterboard)"
- General: "General Waste"

### Actual Behavior
- Heavy Waste incorrectly labeled "General Waste"
- Underlying state/skip selection correct

### Impact
- Confusing review summary misrepresents selection
- Users may doubt their choice and abandon
- Poor attention to detail in UI text rendering

---

## BUG SUMMARY TABLE

| # | Category | Repro Steps | Impact | Priority |
|---|----------|-------------|--------|----------|
| 1 | Data/Validation | Always | Medium (trust/pricing) | High |
| 2 | State/Logic | Heavy waste | Medium (business rules) | High |
| 3 | UI/UX | Heavy waste | Low (label only) | Medium |

## Verification Commands
```
# Manual test
cd ui && npm run dev

# Automation (unchanged selectors)
cd ui/automation && npx playwright test
```

