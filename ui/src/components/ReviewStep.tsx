import type { Address, Skip } from "../services/bookingService";

interface ReviewStepProps {
  postcode: string;
  address: Address;
  heavyWaste: boolean;
  plasterboard: boolean;
  plasterboardOption?: string;
  skip: Skip;
  onNext: () => void;
  onBack: () => void;
}

export function ReviewStep({
  postcode,
  address,
  heavyWaste,
  plasterboard,
  plasterboardOption,
  skip,
  onNext,
  onBack,
}: ReviewStepProps) {
  const getWasteTypeLabel = () => {
    if (heavyWaste) {
      return "General Waste";
    }
    if (plasterboard) {
      return "Heavy Waste";
    }
    return "General Waste";
  };

  // Calculate delivery fee and total
  const deliveryFee = 25;
  const disposalFee = heavyWaste ? 50 : 20;
  const displayedSkipPrice = skip.price + 10;
  const total = displayedSkipPrice + deliveryFee + disposalFee;

  return (
    <div className="step-container" data-testid="review-step">
      <button className="back-button" onClick={onBack} data-testid="back-button">
        ← Back
      </button>
      <div className="step-header">
        <h2>Review Your Booking</h2>
      </div>

      <div className="review-section" data-testid="review-summary">
        <div className="review-item">
          <h3>Location</h3>
          <p data-testid="review-address">{address.address}</p>
          <p className="postcode-label" data-testid="review-postcode">{postcode}</p>
        </div>

        <div className="review-item">
          <h3>Waste Type</h3>
          <p data-testid="review-waste-type">{getWasteTypeLabel()}</p>
        </div>

        <div className="review-item">
          <h3>Skip Details</h3>
          <p data-testid="review-skip-size">{skip.size}</p>
          <p data-testid="review-skip-desc">{skip.description}</p>
        </div>

        <div className="review-item price-breakdown">
          <h3>Price Breakdown</h3>
          <div className="price-row">
            <span>Skip Rental:</span>
            <span data-testid="price-skip">£{displayedSkipPrice}</span>
          </div>
          {/* <div className="price-row">
            <span>Delivery:</span>
            <span data-testid="price-delivery">£{deliveryFee}</span>
          </div> */}
          <div className="price-row">
            <span>Disposal:</span>
            <span data-testid="price-disposal">£{disposalFee}</span>
          </div>
          <div className="price-row total">
            <span>Total:</span>
            <span data-testid="price-total">£{total}</span>
          </div>
        </div>
      </div>

      <div className="review-actions">
        <button onClick={onNext} className="primary-button" data-testid="review-confirm-button">
          Continue to Booking
        </button>
      </div>
    </div>
  );
}
