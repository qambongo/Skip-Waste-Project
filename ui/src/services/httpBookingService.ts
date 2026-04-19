const API_BASE_URL = "http://localhost:3000/api";

export interface Address {
  id: string;
  address: string;
}

export interface Skip {
  id: string;
  size: string;
  price: number;
  description: string;
  disabled: boolean;
}

export interface PostcodeResponse {
  success: boolean;
  addresses?: Address[];
  error?: string;
}

export interface WasteTypeResponse {
  ok: boolean;
  error?: string;
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

export class HttpBookingService {
  static async lookupPostcode(postcode: string): Promise<PostcodeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/postcode/lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode }),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }
  }

  static async selectWasteType(payload: {
    heavyWaste: boolean;
    plasterboard: boolean;
    plasterboardOption?: string;
  }): Promise<WasteTypeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/waste-type/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      return { ok: false, error: "Network error. Please check your connection." };
    }
  }

  static async getSkips(
    postcode: string,
    heavyWaste: boolean
  ): Promise<SkipsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/skips/get`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode, heavyWaste }),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }
  }

  static async confirmBooking(): Promise<BookingConfirmation> {
    try {
      const response = await fetch(`${API_BASE_URL}/booking/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }
  }

  static async resetState(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/test/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Failed to reset API state:", error);
    }
  }
}
