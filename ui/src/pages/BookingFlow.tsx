import { useState } from "react";
import { PostcodeStep } from "../components/PostcodeStep";
import { WasteTypeStep } from "../components/WasteTypeStep";
import { SkipSelectionStep } from "../components/SkipSelectionStep";
import { ReviewStep } from "../components/ReviewStep";
import { ConfirmStep } from "../components/ConfirmStep";
import { SuccessStep } from "../components/SuccessStep";
import type { Address, Skip } from "../services/bookingService";
import { BookingService } from "../services/bookingService";

type BookingStep =
  | "postcode"
  | "wasteType"
  | "skipSelection"
  | "review"
  | "confirm"
  | "success";

interface BookingState {
  postcode: string;
  address: Address | null;
  heavyWaste: boolean;
  plasterboard: boolean;

  skip: Skip | null;
  bookingId: string | null;
}

const initialState: BookingState = {
  postcode: "",
  address: null,
  heavyWaste: false,
  plasterboard: false,
  skip: null,
  bookingId: null,
};

export function BookingFlow() {
  const [currentStep, setCurrentStep] = useState<BookingStep>("postcode");
  const [bookingState, setBookingState] = useState<BookingState>(initialState);

  const handlePostcodeNext = (postcode: string, address: Address) => {
    setBookingState((prev) => ({
      ...prev,
      postcode,
      address,
    }));
    setCurrentStep("wasteType");
  };

  const handleWasteTypeNext = (
    heavyWaste: boolean,
    plasterboard: boolean
  ) => {
    setBookingState((prev) => ({
      ...prev,
      heavyWaste,
      plasterboard,

    }));
    setCurrentStep("skipSelection");
  };

  const handleSkipSelectionNext = (skip: Skip) => {
    setBookingState((prev) => ({
      ...prev,
      skip,
    }));
    setCurrentStep("review");
  };

  const handleReviewNext = () => {
    setCurrentStep("confirm");
  };

  const handleReviewBack = () => {
    setCurrentStep("skipSelection");
  };

  const handleWasteTypeBack = () => {
    setCurrentStep("postcode");
  };

  const handleSkipSelectionBack = () => {
    setCurrentStep("wasteType");
  };

  const handleConfirmBack = () => {
    setCurrentStep("review");
  };

  const handleBookingComplete = (bookingId: string) => {
    setBookingState((prev) => ({
      ...prev,
      bookingId,
    }));
    setCurrentStep("success");
  };

  const handleNewBooking = () => {
    BookingService.resetState();
    setBookingState(initialState);
    setCurrentStep("postcode");
  };

  return (
    <div className="booking-flow-container" data-testid="booking-flow">
      <div className="booking-header">
        <h1>Skip Waste Booking</h1>
        <div className="progress-indicator" data-testid="progress-indicator">
          {currentStep !== "success" && (
            <div className="progress-steps">
              <div
                className={`step ${currentStep === "postcode" ? "active" : ""} ${
                  ["wasteType", "skipSelection", "review", "confirm"].includes(currentStep) ? "completed" : ""
                }`}
              >
                Address
              </div>
              <div
                className={`step ${currentStep === "wasteType" ? "active" : ""} ${
                  ["skipSelection", "review", "confirm"].includes(currentStep) ? "completed" : ""
                }`}
              >
                Waste
              </div>
              <div
                className={`step ${currentStep === "skipSelection" ? "active" : ""} ${
                  ["review", "confirm"].includes(currentStep) ? "completed" : ""
                }`}
              >
                Size
              </div>
              <div
                className={`step ${currentStep === "review" ? "active" : ""} ${
                  currentStep === "confirm" ? "completed" : ""
                }`}
              >
                Review
              </div>
              <div
                className={`step ${currentStep === "confirm" ? "active" : ""}`}
              >
                Confirm
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="booking-content">
        {currentStep === "postcode" && (
          <PostcodeStep 
            onNext={handlePostcodeNext}
            initialPostcode={bookingState.postcode}
            initialAddress={bookingState.address || undefined}
          />
        )}

        {currentStep === "wasteType" && (
          <WasteTypeStep 
            onNext={handleWasteTypeNext} 
            onBack={handleWasteTypeBack}
            initialWasteType={bookingState.heavyWaste ? "heavy" : bookingState.plasterboard ? "plasterboard" : "general"}

          />
        )}

        {currentStep === "skipSelection" && bookingState.address && (
          <SkipSelectionStep
            postcode={bookingState.postcode}
            heavyWaste={bookingState.heavyWaste}
            onNext={handleSkipSelectionNext}
            onBack={handleSkipSelectionBack}
            initialSkip={bookingState.skip || undefined}
          />
        )}

        {currentStep === "review" && bookingState.address && bookingState.skip && (
          <ReviewStep
            postcode={bookingState.postcode}
            address={bookingState.address}
            heavyWaste={bookingState.heavyWaste}
            plasterboard={bookingState.plasterboard}

            skip={bookingState.skip}
            onNext={handleReviewNext}
            onBack={handleReviewBack}
          />
        )}

        {currentStep === "confirm" && (
          <ConfirmStep onBookingComplete={handleBookingComplete} onBack={handleConfirmBack} />
        )}

        {currentStep === "success" && bookingState.bookingId && (
          <SuccessStep
            bookingId={bookingState.bookingId}
            onNewBooking={handleNewBooking}
          />
        )}
      </div>
    </div>
  );
}
