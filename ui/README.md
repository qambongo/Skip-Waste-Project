# SkipWaste Booking Flow - QA Testing Application

## Overview

A fully functional, QA-focused skip waste booking application built with React + TypeScript. Demonstrates comprehensive testing practices including:
- E2E automation with Playwright
- 40+ manual test cases
- Realistic bug reporting
- Mock API layer with failure simulations
- Complete UI state handling (loading, error, empty, disabled, success)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
cd /Users/bigprotein/Desktop/SkipWaste/ui
npm install
```

### Running the Application
```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Running Tests

#### E2E Tests with Playwright
```bash
# Install Playwright (if not already done)
npm install --save-dev @playwright/test

# Run all tests
npx playwright test

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test automation/tests/general-waste.spec.ts

# Run tests with debug
npx playwright test --debug

# View test report
npx playwright show-report
```

#### Manual Tests
See `manual-tests.md` for 40+ manual test cases covering:
- Happy path scenarios
- Negative test cases
- Edge cases
- API failure simulations
- State transitions

---

## 📁 Project Structure

```
/ui
├── src/
│   ├── mocks/
│   │   └── api.ts                 # Mock API layer (core of system)
│   ├── services/
│   │   └── bookingService.ts      # Service wrapper for mock API
│   ├── components/
│   │   ├── PostcodeStep.tsx       # Address lookup step
│   │   ├── WasteTypeStep.tsx      # Waste type selection with branching
│   │   ├── SkipSelectionStep.tsx  # Skip size selection
│   │   ├── ReviewStep.tsx         # Review and pricing
│   │   ├── ConfirmStep.tsx        # Booking confirmation
│   │   └── SuccessStep.tsx        # Success page
│   ├── pages/
│   │   └── BookingFlow.tsx        # Main orchestrator component
│   ├── App.tsx                    # Root component
│   ├── App.css                    # Complete styling
│   └── main.tsx
├── automation/
│   ├── tests/
│   │   ├── general-waste.spec.ts          # General waste E2E tests
│   │   └── heavy-plasterboard.spec.ts    # Heavy & plasterboard tests
│   ├── playwright-report/         # Test reports (generated)
│   └── test-results.json          # Test results (generated)
├── manual-tests.md                # 40+ manual test cases
├── bug-reports.md                 # 3+ realistic bug reports
├── playwright.config.ts           # Playwright configuration
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔌 Mock API Layer

The mock API is implemented in `/src/mocks/api.ts` and simulates all backend functionality:

### Postcode Lookup: `lookupPostcode(postcode: string)`

Supports specific test postcodes:

| Postcode | Behavior | Use Case |
|----------|----------|----------|
| `SW1A 1AA` | Returns 12+ addresses | Happy path with many options |
| `EC1A 1BB` | Returns empty list | Testing empty state + manual entry |
| `M1 1AE` | 2-second delay | Testing loading state |
| `BS1 4DJ` | Fails first, succeeds on retry | Testing retry logic and error recovery |
| Other | Returns generic error | Error handling |

### Waste Type: `selectWasteType(payload)`

Validates and stores waste type selection:
- `heavyWaste: boolean` - Heavy waste flag
- `plasterboard: boolean` - Plasterboard waste flag
- `plasterboardOption?: string` - Specific plasterboard type (if applicable)

**Plasterboard Options:**
- `contaminated` - Contaminated/Damaged
- `clean` - Clean/Reusable
- `mixed` - Mixed Waste with Plasterboard

### Skip Options: `getSkips(postcode, heavyWaste)`

Returns 9 skip options with pricing:

**When `heavyWaste = false`:** All skips available

**When `heavyWaste = true`:** 
- Disables: 8 Cubic Yards (skip-3) and 10 Cubic Yards (skip-4)
- Available: All other sizes

Pricing: £150 - £650 per skip

### Booking Confirmation: `confirmBooking()`

- Returns unique booking ID: `SKIP-[timestamp]-[random]`
- 1.5-second simulated delay
- Prevents duplicate submission within 2-second window
- Generates realistic confirmation IDs

---

## 🎨 UI Components

### PostcodeStep
- UK postcode format validation
- Address selection or manual entry
- Error handling with retry
- Loading state during lookup

**Data Test IDs:**
- `postcode-step`, `postcode-input`, `lookup-button`
- `address-list`, `address-{id}`, `address-confirm-button`
- `manual-entry`, `manual-address-input`, `manual-address-confirm`
- `postcode-error`, `retry-button`

### WasteTypeStep
- Three waste type options (General, Heavy, Plasterboard)
- **Branching Logic:** Plasterboard triggers 3 sub-options
- Conditional rendering based on selection
- Next button disabled until all required selections made

**Data Test IDs:**
- `waste-type-step`, `waste-type-general`, `waste-type-heavy`, `waste-type-plasterboard`
- `waste-type-confirm-button`
- `plasterboard-options`, `plasterboard-contaminated`, `plasterboard-clean`, `plasterboard-mixed`

### SkipSelectionStep
- Grid of 9 skip options with pricing
- **Visual distinction:** Disabled skips grayed out with "Not available" badge
- Automatic loading and retry
- Error handling

**Data Test IDs:**
- `skip-selection-step`, `skip-list`, `skip-loading`, `skip-error`, `skip-empty`
- `skip-{id}`, `skip-radio-{id}`, `disabled-{id}`
- `skip-confirm-button`, `skip-retry-button`

### ReviewStep
- Complete booking summary
- Price breakdown with calculations
- Address, waste type, skip details
- Back button to modify selections

**Data Test IDs:**
- `review-step`, `review-summary`
- `review-postcode`, `review-address`, `review-waste-type`, `review-skip-size`, `review-skip-desc`
- `price-skip`, `price-delivery`, `price-disposal`, `price-total`
- `review-confirm-button`, `review-back-button`

### ConfirmStep
- Final confirmation before booking
- Loading state during submission
- Error handling with retry

**Data Test IDs:**
- `confirm-step`, `confirm-prompt`
- `confirm-booking-button`, `confirm-error`, `confirm-retry-button`

### SuccessStep
- Booking confirmation with ID
- Next steps information
- Option to make new booking

**Data Test IDs:**
- `success-step`, `success-heading`, `success-message`
- `booking-reference`, `booking-id`
- `new-booking-button`

---

## 🧪 Testing Strategy

### E2E Testing (Playwright)

**Files:**
- `automation/tests/general-waste.spec.ts` - 6 tests
- `automation/tests/heavy-plasterboard.spec.ts` - 7 tests

**Test Coverage:**
- ✅ Complete happy path booking
- ✅ Error and retry scenarios
- ✅ Empty state handling
- ✅ Disabled skip selection
- ✅ Loading states
- ✅ Branching logic
- ✅ State transitions
- ✅ Double submission prevention
- ✅ New booking reset

**Key Features:**
- All steps use `data-testid` attributes
- No flaky waits (uses explicit waits for visibility)
- Assertions at every step
- Tests can run in parallel
- Cross-browser testing (Chrome, Firefox, Safari)

### Manual Testing

**Document:** `manual-tests.md`

**40 Test Cases:**
- 8 Happy path tests
- 10 Negative tests (validation, empty fields)
- 7 Edge cases (delays, empty results, pricing)
- 5 API failure scenarios
- 4 State transition tests
- 6 Additional functionality tests

**Coverage Areas:**
- All waste types and plasterboard options
- All skip sizes and pricing
- Manual address entry
- Navigation and state preservation
- Responsive design (mobile)

### Bug Reporting

**Document:** `bug-reports.md`

**3+ Realistic Bugs:**

1. **Plasterboard Branching State Not Preserved** (HIGH)
   - Selecting plasterboard option, then going back loses selection
   - Impact: UX confusion, booking abandonment

2. **Disabled Skips Selectable via Card** (MEDIUM)
   - Heavy waste disables certain skips, but they're still clickable
   - Impact: Functional constraint violation

3. **Booking ID Format Vulnerability** (CRITICAL)
   - Booking ID generation not validated
   - Impact: Potential security/XSS risk

---

## 📊 Test Data

### Postcode Test Scenarios

1. **SW1A 1AA** - Happy path
   - Returns 12 addresses (Houses of Parliament area)
   - Perfect for testing address selection

2. **EC1A 1BB** - Empty result
   - Returns 0 addresses
   - Tests empty state and manual entry

3. **M1 1AE** - Simulated delay
   - 2-second delay
   - Tests loading state and patience

4. **BS1 4DJ** - Retry scenario
   - First call fails with "Service temporarily unavailable"
   - Second call succeeds
   - Tests error handling and retry logic

### Waste Types

- **General Waste** - No special behavior, all skips available
- **Heavy Waste** - Disables 2 skips (8 & 10 Cubic Yards), £50 disposal fee
- **Plasterboard** - Requires sub-option selection, 3 choices available

### Skip Pricing

| Size | Price | Disabled for Heavy |
|------|-------|-------------------|
| 4 CY | £150 | No |
| 6 CY | £200 | No |
| 8 CY | £250 | ✓ Yes |
| 10 CY | £300 | ✓ Yes |
| 12 CY | £350 | No |
| 14 CY | £400 | No |
| 16 CY | £450 | No |
| 20 CY | £550 | No |
| Maxi | £650 | No |

**Price Calculation:**
- Total = Skip Price + Delivery Fee (£25) + Disposal Fee
- General waste disposal: £20
- Heavy waste disposal: £50

---

## 🔍 Required UI States Implemented

✅ **Loading States**
- Postcode lookup: "Searching..." button state
- Skip loading: Spinner animation
- Booking confirmation: "Confirming..." button state

✅ **Error States**
- Postcode lookup error (BS1 4DJ retry)
- Skip loading error with retry
- Booking confirmation error with retry
- All show error message + retry button

✅ **Empty States**
- No addresses found (EC1A 1BB)
- Shows message and manual entry form

✅ **Disabled States**
- Skip selection disabled for heavy waste
- Visual indicators: grayed out, "Not available" badge
- Buttons disabled until required selection made

✅ **Success State**
- Booking confirmation page
- Booking ID displayed
- Next steps information
- "New Booking" button

---

## 🛠️ Development

### Build
```bash
npm run build
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

---

## 📝 Key Assumptions

1. **Mock API Only** - No real backend. All logic simulated in frontend.
2. **Test Postcodes** - Only specific postcodes return special behavior. Others return generic error.
3. **Immediate Latency** - M1 1AE has 2-second delay, others ~300-500ms.
4. **Retry Counting** - BS1 4DJ tracked per session only (resets on page reload).
5. **Booking IDs Unique** - Each confirmation generates unique ID.
6. **No Persistence** - Bookings not saved to storage. Page reload loses state.
7. **UK Only** - Postcode validation assumes UK format only.

---

## 📚 Documentation Files

- **manual-tests.md** - 40+ manual test cases with test matrix
- **bug-reports.md** - 3+ realistic bug reports with root causes
- **README.md** - This file

---

## 🎯 Testing Checklist

- [ ] Run `npm run dev` - app starts without errors
- [ ] E2E tests pass: `npx playwright test`
- [ ] All postcode scenarios work (SW1A 1AA, EC1A 1BB, M1 1AE, BS1 4DJ)
- [ ] All waste types selectable
- [ ] Plasterboard branching works
- [ ] Heavy waste disables correct skips
- [ ] Review shows correct totals
- [ ] Success page shows booking ID
- [ ] Manual tests cover all cases in manual-tests.md
- [ ] All bugs documented in bug-reports.md are reproducible
- [ ] Responsive at 320px, 768px, 1920px widths

---

## 🚨 Known Limitations

1. **No Backend** - Bookings not persisted to database
2. **Local Only** - No real API endpoints, all mock
3. **Session State** - Retry counting resets on page reload
4. **Single User** - No concurrent booking simulation
5. **No Analytics** - No tracking or logging implemented
6. **No Authentication** - All bookings public (no user login)

---

## 🤝 Contributing

When adding tests or features:
1. Use `data-testid` attributes for all interactive elements
2. Add corresponding E2E test
3. Update manual test cases if new functionality
4. Follow existing component structure
5. Maintain mock API for all backend simulation

---

## 📞 Support

For issues or questions:
1. Check manual-tests.md for expected behavior
2. Review bug-reports.md for known issues
3. Check E2E test examples in automation/tests/
4. Verify mock API responses in src/mocks/api.ts

---

**Last Updated:** April 19, 2026  
**Version:** 1.0.0  
**Status:** Complete - Ready for testing
