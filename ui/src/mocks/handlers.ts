import { http, HttpResponse } from "msw";
import {
  lookupPostcode,
  selectWasteType,
  getSkips,
  confirmBooking,
  resetApiState,
  type WasteTypePayload,
} from "../../../api/handlers";

const API_BASE_URL = "http://localhost:3000/api";

export const handlers = [
  // Postcode Lookup Endpoint
  http.post(`${API_BASE_URL}/postcode/lookup`, async ({ request }) => {
    try {
      const { postcode } = (await request.json()) as { postcode: string };
      const result = await lookupPostcode(postcode);
      return HttpResponse.json(result);
    } catch (_error) {
      return HttpResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }
  }),

  // Waste Type Validation Endpoint
  http.post(`${API_BASE_URL}/waste-type/validate`, async ({ request }) => {
    try {
      const payload = (await request.json()) as WasteTypePayload;
      const result = await selectWasteType(payload);
      return HttpResponse.json(result);
    } catch (_error) {
      return HttpResponse.json(
        { ok: false, error: "Invalid request" },
        { status: 400 }
      );
    }
  }),

  // Get Skips Endpoint
  http.post(`${API_BASE_URL}/skips/get`, async ({ request }) => {
    try {
      const { postcode, heavyWaste } = (await request.json()) as {
        postcode: string;
        heavyWaste: boolean;
      };
      const result = await getSkips(postcode, heavyWaste);
      return HttpResponse.json(result);
    } catch (_error) {
      return HttpResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }
  }),

  // Confirm Booking Endpoint
  http.post(`${API_BASE_URL}/booking/confirm`, async () => {
    try {
      const result = await confirmBooking();
      return HttpResponse.json(result);
    } catch (_error) {
      return HttpResponse.json(
        { success: false, error: "Failed to confirm booking" },
        { status: 500 }
      );
    }
  }),

  // Reset API State (for testing)
  http.post(`${API_BASE_URL}/test/reset`, () => {
    resetApiState();
    return HttpResponse.json({ success: true });
  }),
];
