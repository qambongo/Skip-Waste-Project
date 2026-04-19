import { useState } from "react";
import type { Address } from "../services/bookingService";
import { BookingService } from "../services/bookingService";

interface PostcodeStepProps {
  onNext: (postcode: string, address: Address) => void;
  initialPostcode?: string;
  initialAddress?: Address;
}

export function PostcodeStep({ onNext, initialPostcode = "", initialAddress }: PostcodeStepProps) {
  const [postcode, setPostcode] = useState(initialPostcode);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(initialAddress || null);
  const [manualAddress, setManualAddress] = useState("");
  const [isPostcodeTouched, setIsPostcodeTouched] = useState(false);
  const [showMoreAddresses, setShowMoreAddresses] = useState(false);

  const handleLookup = async () => {
    setError(null);
    setAddresses([]);
    setSelectedAddress(null);
    setShowMoreAddresses(false);
    setLoading(true);

    try {
      const result = await BookingService.lookupPostcode(postcode);

      if (result.success && result.addresses) {
        if (result.addresses.length === 0) {
          setError("No addresses found for this postcode");
        } else {
          setAddresses(result.addresses);
        }
      } else {
        setError(result.error || "Failed to look up postcode");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  const handleConfirm = () => {
    if (selectedAddress) {
      onNext(postcode, selectedAddress);
    }
  };

  const handleManualConfirm = () => {
    if (manualAddress.trim()) {
      onNext(postcode, {
        id: "manual",
        address: manualAddress,
      });
    }
  };

  // Validate postcode - allow with or without space
  // UK postcodes are 6-8 characters: area+district (2-4 chars) + sector+unit (3 chars)
  // Format variations: A9 9AA, A9A 9AA, A99 9AA, AA9 9AA, AA9A 9AA, AA99 9AA
  const normalizedPostcode = postcode.replace(/\s/g, "").toUpperCase();
  const isValidPostcode = /^[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2}$/.test(normalizedPostcode) && normalizedPostcode.length >= 6 && normalizedPostcode.length <= 8;
  
  const getPostcodeErrorMessage = () => {
    if (!postcode) return "Please enter a postcode";
    if (postcode.length < 6) return "Postcode is too short (minimum 6 characters)";
    if (postcode.length > 8) return "Postcode is too long (maximum 8 characters)";
    return "Invalid postcode format. Use format like SW1A1AA or SW1A 1AA";
  };

  // Show error only if postcode is invalid AND user has interacted with field
  const shouldShowPostcodeError = postcode && !isValidPostcode && isPostcodeTouched;

  // Display limited number of addresses (show 5 by default, more if requested)
  const visibleAddresses = showMoreAddresses ? addresses : addresses.slice(0, 5);
  const hasMoreAddresses = addresses.length > 5;

  return (
    <div className="step-container" data-testid="postcode-step">
      <h2>Find Your Address</h2>

      <div className="form-group">
        <label htmlFor="postcode">UK Postcode</label>
        <input
          id="postcode"
          data-testid="postcode-input"
          type="text"
          placeholder="e.g., SW1A 1AA"
          value={postcode}
          onChange={(e) => {
            const input = e.target.value.toUpperCase().replace(/\s/g, "");
            // Insert space before last 3 characters if length is 6-8
            if (input.length >= 6) {
              const formatted = input.slice(0, -3) + " " + input.slice(-3);
              setPostcode(formatted);
            } else {
              setPostcode(input);
            }
          }}
          onBlur={() => setIsPostcodeTouched(true)}
          disabled={loading}
          className={shouldShowPostcodeError ? "input-error" : ""}
          aria-invalid={shouldShowPostcodeError ? "true" : "false"}
          aria-describedby={shouldShowPostcodeError ? "postcode-error" : "postcode-hint"}
        />
        <small id="postcode-hint">Format: SW1A 1AA (space required)</small>
        {shouldShowPostcodeError && (
          <div className="validation-error show" data-testid="postcode-validation-error" id="postcode-error">
            {getPostcodeErrorMessage()}
          </div>
        )}
      </div>

      <button
        onClick={handleLookup}
        disabled={!isValidPostcode || loading}
        data-testid="lookup-button"
        title={!isValidPostcode ? getPostcodeErrorMessage() : ""}
        className="primary-button"
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {error && (
        <div className="error-state" data-testid="postcode-error">
          <p>{error}</p>
          <button onClick={handleLookup} data-testid="retry-button">
            Retry
          </button>
        </div>
      )}

      {addresses.length > 0 && (
        <div className="address-list" data-testid="address-list">
          <h3>Select your address:</h3>
          {visibleAddresses.map((addr) => (
            <label key={addr.id} className="radio-option">
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddress?.id === addr.id}
                onChange={() => handleSelectAddress(addr)}
                data-testid={`address-${addr.id}`}
              />
              <span>{addr.address}</span>
            </label>
          ))}
          {hasMoreAddresses && !showMoreAddresses && (
            <button
              onClick={() => setShowMoreAddresses(true)}
              className="primary-button"
              style={{ marginTop: "12px", background: "#64748b" }}
              data-testid="show-more-button"
            >
              Show More Addresses ({addresses.length - 5} more)
            </button>
          )}
          {hasMoreAddresses && showMoreAddresses && (
            <button
              onClick={() => setShowMoreAddresses(false)}
              className="primary-button"
              style={{ marginTop: "12px", background: "#64748b" }}
              data-testid="show-less-button"
            >
              Show Less
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={!selectedAddress}
            className="primary-button"
            data-testid="address-confirm-button"
            style={{ marginTop: "12px" }}
          >
            Next
          </button>
        </div>
      )}

      <div className="manual-entry" data-testid="manual-entry">
        <h3>Or enter your address manually</h3>
        <p>If your address isn't in the list above, you can type it here</p>
        <input
          type="text"
          placeholder="Full address"
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          data-testid="manual-address-input"
        />
        <button
          onClick={handleManualConfirm}
          disabled={!manualAddress.trim()}
          className="primary-button"
          data-testid="manual-address-confirm"
        >
          Continue with Manual Address
        </button>
      </div>
    </div>
  );
}
