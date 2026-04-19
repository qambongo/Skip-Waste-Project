interface SuccessStepProps {
  bookingId: string;
  onNewBooking: () => void;
}

export function SuccessStep({ bookingId, onNewBooking }: SuccessStepProps) {
  return (
    <div className="step-container success-container" data-testid="success-step">
      <div className="success-content">
        <h2 data-testid="success-heading">✓ Booking Confirmed!</h2>
        <p className="success-message">
          Your skip has been successfully booked. Check your email for confirmation details.
        </p>

        <div className="booking-reference" data-testid="booking-reference">
          <p>Your Booking Reference:</p>
          <code data-testid="booking-id">{bookingId}</code>
        </div>

        <div className="success-details">
          <p>
            You will receive a confirmation email within minutes with:
          </p>
          <ul>
            <li>Collection date and time window</li>
            <li>Driver contact details</li>
            <li>Invoice and payment confirmation</li>
          </ul>
        </div>

        <button
          onClick={onNewBooking}
          className="primary-button"
          data-testid="new-booking-button"
        >
          Make Another Booking
        </button>
      </div>
    </div>
  );
}
