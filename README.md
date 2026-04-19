# SkipWaste Booking Application

A complete QA-focused skip waste booking flow application with mock APIs using MSW (Mock Service Worker).

## Project Structure

```
SkipWaste/
├── ui/                          # React frontend application
│   ├── src/
│   │   ├── components/          # React components (Step 1-5)
│   │   ├── pages/               # BookingFlow orchestrator
│   │   ├── services/            # API service layers
│   │   ├── mocks/               # MSW configuration
│   │   └── App.tsx              # Root component
│   ├── package.json
│   └── vite.config.ts
│
├── api/                         # Mock API handlers (MSW)
│   ├── handlers.ts              # Mock API logic
│   └── http-handlers.ts         # HTTP endpoint handlers
│
├── automation/                  # End-to-end tests
│   ├── tests/
│   │   ├── general-waste.spec.ts
│   │   └── heavy-plasterboard.spec.ts
│   └── playwright.config.ts
│
├── README.md                    # This file
├── manual-tests.md              # 40+ manual test scenarios
└── bug-reports.md               # 3+ realistic bug reports

```

## Key Features

### Frontend (ui/)
- **5-Step Booking Flow**: Address → Waste Type → Skip Selection → Review → Confirmation
- **Responsive Design**: Mobile-first CSS styling
- **State Persistence**: All selections maintained when navigating back
- **Real-time Validation**: Input validation with helpful error messages
- **Loading States**: Loading spinners and state indicators
- **Error Handling**: Retry mechanisms and error messages

### Mock API (api/)
- **MSW Integration**: Mock Service Worker for intercepting HTTP requests
- **Test Scenarios**:
  - SW1A 1AA: Returns 12+ addresses (happy path)
  - EC1A 1BB: Returns empty list
  - M1 1AE: Simulates 2-second delay
  - BS1 4DJ: First call fails, retry succeeds
- **Business Logic**:
  - Heavy waste restrictions on certain skips
  - Plasterboard categorization (contaminated/clean/mixed)
  - Pricing with delivery and disposal fees
  - Unique booking ID generation

### Automated Tests (automation/)
- **13 E2E Tests**: Playwright test suite
- **Cross-browser Support**: Chromium, Firefox, WebKit
- **Test Scenarios**:
  - General waste booking flow
  - Heavy plasterboard booking with restrictions
  - Error handling and retries
  - State management and navigation

## Getting Started

### Installation

```bash
# Install frontend dependencies
cd ui
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run E2E tests
npx playwright test
```

### API Endpoints (MSW)

All requests are intercepted and mocked by MSW. No real server needed.

```
POST /api/postcode/lookup
POST /api/waste-type/validate
POST /api/skips/get
POST /api/booking/confirm
POST /api/test/reset (testing only)
```

## Testing

### Manual Testing (40+ scenarios)
See `manual-tests.md` for comprehensive manual test cases covering:
- Happy paths
- Error scenarios
- Edge cases
- State management
- UI states (loading, error, empty, success)

### Automated Testing (E2E)
```bash
cd ui
npx playwright test

# Run specific test
npx playwright test general-waste.spec.ts

# Run in debug mode
npx playwright test --debug

# Open test report
npx playwright show-report
```

## Known Issues & Bug Reports

See `bug-reports.md` for detailed reports:

1. **Price Mismatch**: Skip rental price in Review step is £10 higher than selection price (MEDIUM/HIGH)
2. **Disabled Skips Selectable**: Heavy waste disabled skips remain interactive despite visual disable (MEDIUM/HIGH)
3. **Waste Label Error**: Heavy Waste shows as "General Waste" in Review summary (LOW/MEDIUM)

## Architecture

### Service Layer
- `bookingService.ts`: Main service for UI components
- `httpBookingService.ts`: HTTP client for API calls

### Mock API
- `handlers.ts`: Business logic and mock data
- `browser.ts`: MSW browser setup
- `handlers.ts` (mocks): HTTP endpoint definitions

### Components
- **PostcodeStep**: Address lookup with manual fallback
- **WasteTypeStep**: Waste type selection with branching
- **SkipSelectionStep**: Skip options with pricing
- **ReviewStep**: Booking summary
- **ConfirmStep**: Final confirmation
- **SuccessStep**: Booking confirmation display

## Technologies

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Pure CSS with animations
- **API Mocking**: MSW (Mock Service Worker)
- **Testing**: Playwright, E2E tests
- **Build**: Vite, TypeScript compiler

## Performance

- **Build Time**: ~130ms
- **Bundle Size**: ~64KB gzipped (JS), ~3KB gzipped (CSS)
- **Development**: Hot Module Replacement (HMR) enabled


## Contributing

When adding features:
1. Update mock API in `api/handlers.ts`
2. Add HTTP endpoint in `api/http-handlers.ts`
3. Add E2E tests in `automation/tests/`
4. Update manual test cases in `manual-tests.md`
5. Run full test suite before committing

## License

Proprietary - SkipWaste Project
