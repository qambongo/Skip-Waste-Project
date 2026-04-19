# Manual Test Cases - SkipWaste Booking Flow

## Test Case Summary
- **Total Test Cases:** 40
- **Negative Tests:** 10
- **Edge Cases:** 7
- **API Failure Scenarios:** 5
- **State Transition Tests:** 4
- **Happy Path Tests:** 8
- **Branching Logic Tests:** 6

---

## HAPPY PATH TEST CASES

### TC-001: Complete General Waste Booking
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-001 | User completes full booking with general waste | 1. Enter postcode SW1A 1AA<br>2. Select first address<br>3. Choose General Waste<br>4. Select 4 Cubic Yards skip<br>5. Review all details<br>6. Confirm booking | Booking ID generated and displayed on success page |

### TC-002: Complete Heavy Waste Booking
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-002 | User books with heavy waste (some skips disabled) | 1. Enter postcode SW1A 1AA<br>2. Select address<br>3. Choose Heavy Waste<br>4. Select 14 Cubic Yards skip (avoid disabled ones)<br>5. Review - disposal fee £50<br>6. Confirm | Booking confirmed with heavy waste pricing |

### TC-003: Complete Plasterboard Booking
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-003 | User books plasterboard with branching option | 1. Enter postcode SW1A 1AA<br>2. Select address<br>3. Choose Plasterboard<br>4. Select "Clean/Reusable" option<br>5. Select appropriate skip<br>6. Review and confirm | Booking shows plasterboard type with selected option |

### TC-004: Manual Address Entry
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-004 | User enters address manually when none found | 1. Enter postcode EC1A 1BB (returns empty)<br>2. Click manual entry field<br>3. Type "123 Custom Lane"<br>4. Complete booking | Booking accepts manual address |

### TC-005: Navigation Back to Previous Step
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-005 | User goes back from review to change skip | 1. Complete steps 1-3<br>2. On review page, click Back<br>3. Select different skip<br>4. Proceed to review<br>5. Confirm | Review updates with new skip selection |

### TC-006: Different Skip Sizes Pricing
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-006 | Different skip sizes show correct prices | 1. Complete postcode and waste type<br>2. Select 4 Cubic Yards (£150)<br>3. Note price in review (£195 total)<br>4. Go back and select 20 Cubic Yards (£550)<br>5. Note new total (£625) | Price breakdown updates correctly for each skip |

### TC-007: Multiple Plasterboard Options
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-007 | All plasterboard options work correctly | 1. Select Plasterboard<br>2. Try "Contaminated/Damaged"<br>3. Go back and try "Mixed Waste" option<br>4. Go back and try "Clean/Reusable"<br>Each should allow booking | All three plasterboard options are selectable |

### TC-008: Progress Indicator Updates
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-008 | Progress bar shows current step | 1. Start booking<br>2. After step 1, step 1 marked active<br>3. After step 2, steps 1-2 marked active<br>4. Continue through all steps | Progress indicator highlights current and completed steps |

---

## NEGATIVE TEST CASES

### TC-009: Invalid Postcode Format
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-009 | User enters invalid postcode format | 1. Enter "INVALID"<br>2. Try to click Search button | Search button remains disabled, validation error shown |

### TC-010: Empty Postcode Submission
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-010 | User tries to search with empty postcode | 1. Leave postcode field empty<br>2. Search button should be disabled | Button disabled, no API call made |

### TC-011: No Address Selection
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-011 | User tries to proceed without selecting address | 1. Search postcode<br>2. Don't select any address<br>3. Try to click Next | Next button remains disabled |

### TC-012: No Waste Type Selected
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-012 | User skips waste type selection | 1. Complete postcode step<br>2. Don't select waste type<br>3. Try clicking Next | Next button disabled until selection made |

### TC-013: Plasterboard Without Option
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-013 | User selects plasterboard but no sub-option | 1. Select Plasterboard waste type<br>2. Try clicking Next without selecting option | Next button remains disabled, prompts for option |

### TC-014: No Skip Selected
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-014 | User skips the skip selection step | 1. Complete first 2 steps<br>2. Don't select any skip<br>3. Try clicking Next | Next button disabled |

### TC-015: Clicking Disabled Skip
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-015 | User tries to select a disabled skip for heavy waste | 1. Choose Heavy Waste<br>2. Try clicking disabled skip (8 Cubic Yards)<br>3. Try to proceed | Skip not selectable, radio button doesn't change |

### TC-016: Manual Address Too Short
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-016 | User enters very short manual address | 1. Trigger manual entry (postcode EC1A 1BB)<br>2. Type "123"<br>3. Try clicking Continue | Continue button disabled or error shown |

### TC-017: Empty Manual Address
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-017 | User tries to submit empty manual address | 1. Trigger manual entry<br>2. Leave field empty<br>3. Try clicking Continue | Button disabled |

### TC-018: Confirm Booking Attempts Twice
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-018 | User rapidly clicks confirm booking twice | 1. Reach confirmation step<br>2. Click confirm button twice rapidly | Only one booking created, duplicate submission prevented |

---

## EDGE CASE TEST CASES

### TC-019: Postcode with Retry - First Failure
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-019 | Postcode BS1 4DJ fails first then succeeds on retry | 1. Enter BS1 4DJ<br>2. See error message<br>3. Click Retry button | Error clears, addresses appear on second attempt |

### TC-020: Long Loading State (M1 1AE)
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-020 | User waits through long postcode lookup | 1. Enter M1 1AE (2 second delay)<br>2. Observe "Searching..." state<br>3. Wait for completion | Results appear after delay without timeout |

### TC-021: Empty Address List
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-021 | Postcode returns no addresses (EC1A 1BB) | 1. Enter EC1A 1BB<br>2. See empty results message<br>3. Manual entry form appears | User can manually enter address |

### TC-022: 12+ Addresses Display
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-022 | Postcode SW1A 1AA returns 12 addresses | 1. Enter SW1A 1AA<br>2. Scroll through all addresses<br>3. Verify all 12 are visible | All 12 addresses displayed, scrollable if needed |

### TC-023: Disabled Skips Visual Distinction
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-023 | Disabled skips have visual indicators | 1. Select Heavy Waste<br>2. View skip selection<br>3. Look at 8 and 10 Cubic Yards | Disabled skips are grayed out, show "Not available" badge |

### TC-024: Price Breakdown Accuracy
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-024 | Price breakdown shows correct totals | 1. Select 6 Cubic Yards (£200)<br>2. Review shows: Skip £200, Delivery £25, Disposal £20, Total £245 | All calculations correct |

### TC-025: Booking ID Format
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-025 | Booking ID has correct format | 1. Complete full booking<br>2. View booking ID on success page | Format matches: SKIP-[timestamp]-[random string] |

---

## API FAILURE SCENARIO TEST CASES

### TC-026: Postcode Lookup API Failure
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-026 | API returns error on postcode lookup | 1. (Simulated) Mock API returns error<br>2. User sees error message<br>3. User clicks Retry<br>4. Request retried | Error message clear, Retry button functional |

### TC-027: Skip Loading Failure
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-027 | Skip loading API fails | 1. (Simulated) Mock fails on getSkips<br>2. User sees error in skip selection<br>3. Clicks Retry | Skips load on retry |

### TC-028: Booking Confirmation Timeout
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-028 | Confirmation takes long time to complete | 1. Reach confirmation step<br>2. Click confirm (1.5 sec delay)<br>3. See "Confirming..." state<br>4. Success appears | Success page appears after delay |

### TC-029: API Returns Invalid Data
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-029 | Mock API returns malformed response | 1. (Simulated) API returns corrupt data<br>2. UI handles gracefully | Error state shown, not crashed |

### TC-030: Network Timeout Simulation
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-030 | Slow network causes delay | 1. All API calls have realistic delays<br>2. Loading states show<br>3. User can still interact | All delays handled with loading states |

---

## STATE TRANSITION TEST CASES

### TC-031: Forward Through All Steps
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-031 | User flows through states: Postcode → Waste → Skip → Review → Confirm → Success | 1. Complete each step<br>2. Verify no skipping or looping | State transitions smooth, no stuck states |

### TC-032: Back From Review to Skip Selection
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-032 | User goes back from review and changes skip | 1. In review state<br>2. Click Back<br>3. Selected skip still shows checked<br>4. Select different skip<br>5. Go forward | Skip selection persists correctly through back/forward |

### TC-033: Skip Branching State Change
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-033 | Branching appears/disappears when waste type changes | 1. Select Plasterboard (branching appears)<br>2. Go back to waste type<br>3. Select General (branching disappears)<br>4. Go back to Plasterboard | Branching state correctly shows/hides |

### TC-034: Success Page Cannot Navigate Back
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-034 | Once on success page, cannot go back | 1. Complete booking to success page<br>2. Try browser back button or look for back button<br>3. Only "New Booking" available | No ability to modify booking from success page |

---

## ADDITIONAL STATE AND FUNCTIONALITY TESTS

### TC-035: Disabled Skip Cannot Be Selected
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-035 | Disabled skips for heavy waste are truly unclickable | 1. Select Heavy Waste<br>2. Try multiple clicks on disabled skip<br>3. Try keyboard navigation to it | Disabled skip never becomes selected |

### TC-036: Loading State Blocks Interaction
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-036 | During loading, form elements disabled | 1. Enter postcode<br>2. Click search<br>3. Try to edit input during search | Input disabled during loading |

### TC-037: Error State Recoverable
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-037 | User can recover from any error state | 1. Trigger error (BS1 4DJ postcode)<br>2. Click Retry<br>3. Verify recovery works | User fully recovers from any error |

### TC-038: All Required Fields Validated
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-038 | Form prevents submission without required fields | 1. At each step, try to skip required selection<br>2. Verify button disabled at each step | No partial bookings possible |

### TC-039: Successful Booking Clears State
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-039 | After booking, "New Booking" clears all state | 1. Complete booking<br>2. Click "New Booking"<br>3. Verify postcode field empty<br>4. Verify no selections remembered | Clean slate for new booking |

### TC-040: Responsive Design at All Steps
| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TC-040 | All steps work on mobile (375px width) | 1. Test each step at mobile width<br>2. All buttons clickable<br>3. No horizontal scrolling<br>4. Forms readable | UI responsive and usable on mobile |

---

## TEST COVERAGE MATRIX

| Category | Count | IDs |
|----------|-------|-----|
| Happy Path | 8 | TC-001 to TC-008 |
| Negative Tests | 10 | TC-009 to TC-018 |
| Edge Cases | 7 | TC-019 to TC-025 |
| API Failures | 5 | TC-026 to TC-030 |
| State Transitions | 4 | TC-031 to TC-034 |
| Additional Tests | 6 | TC-035 to TC-040 |
| **TOTAL** | **40** | |

---

## NOTES

- All postcode lookups are simulated in the mock API
- Retry logic is tested for BS1 4DJ (fails first, succeeds on retry)
- Delay simulation is tested with M1 1AE (2 second delay)
- Empty results tested with EC1A 1BB
- Disabled skips tested with Heavy Waste selection
- Plasterboard branching logic fully covered
- All state transitions validated
- Mobile responsiveness included in test scope
