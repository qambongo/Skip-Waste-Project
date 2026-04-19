import { useState } from "react";
import { BookingService } from "../services/bookingService";

interface ConfirmStepProps {
  onBookingComplete: (bookingId: string) => void;
  onBack: () => void;
}

export function ConfirmStep({ onBookingComplete, onBack }: ConfirmStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await BookingService.confirmBooking();

      if (result.success && result.bookingId) {
        onBookingComplete(result.bookingId);
      } else {
        setError(result.error || "Failed to confirm booking");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step-container" data-testid="confirm-step">
      <button className="back-button" onClick={onBack} data-testid="back-button">
        ← Back
      </button>
      <div className="step-header">
        <h2>Confirm Your Booking</h2>
      </div>

      <div className="confirmation-prompt" data-testid="confirm-prompt">
        <p>
          Click below to confirm your skip booking. You will receive a booking
          confirmation with your reference number.
        </p>

        <button
          onClick={handleConfirmBooking}
          disabled={loading}
          className="primary-button cta-button"
          data-testid="confirm-booking-button"
        >
          {loading ? "Confirming..." : "Confirm Booking"}
        </button>

        {error && (
          <div className="error-state" data-testid="confirm-error">
            <p>{error}</p>
            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              data-testid="confirm-retry-button"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
