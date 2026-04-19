import { useEffect, useState } from "react";
import type { Skip } from "../services/bookingService";
import { BookingService } from "../services/bookingService";

interface SkipSelectionStepProps {
  postcode: string;
  heavyWaste: boolean;
  onNext: (skip: Skip) => void;
  onBack: () => void;
  initialSkip?: Skip;
}

export function SkipSelectionStep({
  postcode,
  heavyWaste,
  onNext,
  onBack,
  initialSkip,
}: SkipSelectionStepProps) {
  const [skips, setSkips] = useState<Skip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(initialSkip || null);

  useEffect(() => {
    const loadSkips = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await BookingService.getSkips(postcode, heavyWaste);

        if (result.success && result.skips) {
          setSkips(result.skips);
        } else {
          setError(result.error || "Failed to load skips");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadSkips();
  }, [postcode, heavyWaste]);

  const handleSelectSkip = (skip: Skip) => {
    setSelectedSkip(skip);
  };

  const handleNext = () => {
    if (selectedSkip) {
      onNext(selectedSkip);
    }
  };

  const getNextButtonTooltip = () => {
    if (!selectedSkip && !loading && !error && skips.length > 0) {
      return "Please select a skip";
    }
    return "";
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await BookingService.getSkips(postcode, heavyWaste);

      if (result.success && result.skips) {
        setSkips(result.skips);
      } else {
        setError(result.error || "Failed to load skips");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step-container" data-testid="skip-selection-step">
      <button className="back-button" onClick={onBack} data-testid="back-button">
        ← Back
      </button>
      <div className="step-header">
        <h2>Select Skip Size</h2>
      </div>

      {loading && (
        <div className="loading-state" data-testid="skip-loading">
          <p>Loading available skips...</p>
        </div>
      )}

      {error && (
        <div className="error-state" data-testid="skip-error">
          <p>{error}</p>
          <button onClick={handleRetry} data-testid="skip-retry-button">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && skips.length === 0 && (
        <div className="empty-state" data-testid="skip-empty">
          <p>No skips available for your location.</p>
        </div>
      )}

      {!loading && !error && skips.length > 0 && (
        <div className="skip-grid" data-testid="skip-list">
          {skips.map((skip) => (
            <div
              key={skip.id}
              className={`skip-card ${skip.disabled ? "disabled" : ""} ${
                selectedSkip?.id === skip.id ? "selected" : ""
              }`}
              data-testid={`skip-${skip.id}`}
              onClick={() => handleSelectSkip(skip)}
            >
              <input
                type="radio"
                name="skip"
                value={skip.id}
                checked={selectedSkip?.id === skip.id}
                onChange={() => handleSelectSkip(skip)}
                data-testid={`skip-radio-${skip.id}`}


              />
              <div className="skip-info">
                <h3>{skip.size}</h3>
                <p>{skip.description}</p>
                {skip.disabled && (
                  <span className="disabled-badge" data-testid={`disabled-${skip.id}`}>
                    Not available for heavy waste
                  </span>
                )}
              </div>
              <div className="skip-price">£{skip.price}</div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!selectedSkip || loading}
        className="primary-button"
        data-testid="skip-confirm-button"
        title={getNextButtonTooltip()}
      >
        Next
      </button>
    </div>
  );
}
