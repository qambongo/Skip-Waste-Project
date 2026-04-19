/**
 * Mock API Layer
 * Simulates backend behavior for the booking flow
 * Handles success, failures, retries, and latency
 */

// Types
export interface Address {
  id: string;
  address: string;
}

export interface PostcodeResponse {
  success: boolean;
  addresses?: Address[];
  error?: string;
}

export interface WasteTypePayload {
  heavyWaste: boolean;
  plasterboard: boolean;
  plasterboardOption?: string;
}

export interface WasteTypeResponse {
  ok: boolean;
  error?: string;
}

export interface Skip {
  id: string;
  size: string;
  price: number;
  description: string;
  disabled: boolean;
}

export interface SkipsResponse {
  success: boolean;
  skips?: Skip[];
  error?: string;
}

export interface BookingConfirmation {
  success: boolean;
  bookingId?: string;
  error?: string;
}

// State tracking for retry simulation
const apiCallAttempts: { [key: string]: number } = {};
let lastBookingConfirmationTime: number = 0;

// Helper: Simulate API delay
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Reset tracking (for testing)
export const resetApiState = (): void => {
  Object.keys(apiCallAttempts).forEach((key) => {
    apiCallAttempts[key] = 0;
  });
  lastBookingConfirmationTime = 0;
};

/**
 * POSTCODE LOOKUP
 * Requirements:
 * - SW1A 1AA → return 12+ addresses
 * - EC1A 1BB → return empty list
 * - M1 1AE → add delay (loading state)
 * - BS1 4DJ → first call fails, retry succeeds
 */
export const lookupPostcode = async (
  postcode: string
): Promise<PostcodeResponse> => {
  const normalizedPostcode = postcode.toUpperCase().trim();

  // M1 1AE: Add simulated loading delay
  if (normalizedPostcode === "M1 1AE") {
    await delay(2000);
    return {
      success: true,
      addresses: [
        { id: "m1-1", address: "123 Market Street, Manchester M1 1AE" },
        { id: "m1-2", address: "45 Deansgate, Manchester M1 1AE" },
        { id: "m1-3", address: "67 King Street, Manchester M1 1AE" },
      ],
    };
  }

  // BS1 4DJ: First call fails, second succeeds (retry scenario)
  if (normalizedPostcode === "BS1 4DJ") {
    const attemptKey = `postcode-${normalizedPostcode}`;
    apiCallAttempts[attemptKey] = (apiCallAttempts[attemptKey] || 0) + 1;

    if (apiCallAttempts[attemptKey] === 1) {
      // First attempt: fail
      return {
        success: false,
        error: "Service temporarily unavailable. Please try again.",
      };
    }
    // Retry succeeds
    return {
      success: true,
      addresses: [
        { id: "bs1-1", address: "100 Broad Street, Bristol BS1 4DJ" },
        { id: "bs1-2", address: "200 Park Street, Bristol BS1 4DJ" },
      ],
    };
  }

  // EC1A 1BB: Empty result
  if (normalizedPostcode === "EC1A 1BB") {
    return {
      success: true,
      addresses: [],
    };
  }

  // SW1A 1AA: Return 12+ addresses (happy path)
  if (normalizedPostcode === "SW1A 1AA") {
    return {
      success: true,
      addresses: [
        { id: "sw1-1", address: "10 Downing Street, Westminster SW1A 1AA" },
        { id: "sw1-2", address: "Houses of Parliament, SW1A 1AA" },
        { id: "sw1-3", address: "30 Pall Mall, Westminster SW1A 1AA" },
        { id: "sw1-4", address: "50 Parliament Street, SW1A 1AA" },
        { id: "sw1-5", address: "100 Victoria Street, SW1A 1AA" },
        { id: "sw1-6", address: "150 Tothill Street, SW1A 1AA" },
        { id: "sw1-7", address: "200 Great George Street, SW1A 1AA" },
        { id: "sw1-8", address: "250 Marsham Street, SW1A 1AA" },
        { id: "sw1-9", address: "300 Dean Stanley Street, SW1A 1AA" },
        { id: "sw1-10", address: "350 Millbank, SW1A 1AA" },
        { id: "sw1-11", address: "400 Horseferry Road, SW1A 1AA" },
        { id: "sw1-12", address: "450 Smith Square, SW1A 1AA" },
      ],
    };
  }

  // Any other postcode: Generic error
  return {
    success: false,
    error: "Postcode not found. Please check and try again.",
  };
};

/**
 * SELECT WASTE TYPE
 * Accept heavyWaste, plasterboard, plasterboardOption
 * Return { ok: true } or error
 */
export const selectWasteType = async (
  payload: WasteTypePayload
): Promise<WasteTypeResponse> => {
  // Simulate minimal API delay
  await delay(300);

  // Validation
  if (payload.plasterboard && !payload.plasterboardOption) {
    return {
      ok: false,
      error: "Plasterboard option is required when plasterboard is selected",
    };
  }

  return { ok: true };
};

/**
 * GET SKIPS
 * Returns at least 8 skip options
 * If heavyWaste = true: disable at least 2 skips
 */
export const getSkips = async (
  _postcode: string,
  heavyWaste: boolean
): Promise<SkipsResponse> => {
  // Simulate API delay
  await delay(500);

  const baseSkips: Skip[] = [
    {
      id: "skip-1",
      size: "4 Cubic Yards",
      price: 150,
      description: "Small skip, ideal for single rooms",
      disabled: false,
    },
    {
      id: "skip-2",
      size: "6 Cubic Yards",
      price: 200,
      description: "Medium skip, good for kitchens/bathrooms",
      disabled: false,
    },
    {
      id: "skip-3",
      size: "8 Cubic Yards",
      price: 250,
      description: "Large skip, suitable for house clearance",
      disabled: heavyWaste, // Disable for heavy waste
    },
    {
      id: "skip-4",
      size: "10 Cubic Yards",
      price: 300,
      description: "Extra large skip for major projects",
      disabled: heavyWaste, // Disable for heavy waste
    },
    {
      id: "skip-5",
      size: "12 Cubic Yards",
      price: 350,
      description: "Builder skip with reinforced base",
      disabled: false,
    },
    {
      id: "skip-6",
      size: "14 Cubic Yards",
      price: 400,
      description: "Commercial skip for heavy materials",
      disabled: false,
    },
    {
      id: "skip-7",
      size: "16 Cubic Yards",
      price: 450,
      description: "Industrial skip with side tipper",
      disabled: false,
    },
    {
      id: "skip-8",
      size: "20 Cubic Yards",
      price: 550,
      description: "Mega skip for demolition work",
      disabled: false,
    },
    {
      id: "skip-9",
      size: "Maxi Skip",
      price: 650,
      description: "Maximum capacity waste container",
      disabled: false,
    },
  ];

  return {
    success: true,
    skips: baseSkips,
  };
};

/**
 * CONFIRM BOOKING
 * - Return success with bookingId
 * - Simulate delay
 * - Prevent duplicate submission (within 2 second window)
 */
export const confirmBooking = async (): Promise<BookingConfirmation> => {
  const now = Date.now();

  // Prevent duplicate submission within 2 seconds
  if (now - lastBookingConfirmationTime < 2000 && lastBookingConfirmationTime > 0) {
    return {
      success: false,
      error: "Booking already submitted. Please wait.",
    };
  }

  lastBookingConfirmationTime = now;

  // Simulate confirmation delay
  await delay(1500);

  // Generate booking ID
  const bookingId = `SKIP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return {
    success: true,
    bookingId,
  };
};
