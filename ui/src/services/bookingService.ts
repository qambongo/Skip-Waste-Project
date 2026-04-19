/**
 * Booking Service Layer
 * Wraps HTTP API calls via MSW (Mock Service Worker)
 * Provides clean interface for UI components
 */

import { HttpBookingService } from "./httpBookingService";

// Re-export types from httpBookingService for use in components
export type {
  Address,
  Skip,
  PostcodeResponse,
  WasteTypeResponse,
  SkipsResponse,
  BookingConfirmation,
} from "./httpBookingService";

export type { WasteTypePayload } from "../../../api/handlers";

export class BookingService {
  /**
   * Look up addresses for a given postcode
   */
  static async lookupPostcode(postcode: string) {
    return HttpBookingService.lookupPostcode(postcode);
  }

  /**
   * Select waste type options
   */
  static async selectWasteType(payload: Parameters<typeof HttpBookingService.selectWasteType>[0]) {
    return HttpBookingService.selectWasteType(payload);
  }

  /**
   * Get available skip options for the postcode and waste type
   */
  static async getSkips(
    postcode: string,
    heavyWaste: boolean
  ) {
    return HttpBookingService.getSkips(postcode, heavyWaste);
  }

  /**
   * Confirm the booking
   */
  static async confirmBooking() {
    return HttpBookingService.confirmBooking();
  }

  /**
   * Reset API state (useful for testing)
   */
  static async resetState(): Promise<void> {
    return HttpBookingService.resetState();
  }
}
