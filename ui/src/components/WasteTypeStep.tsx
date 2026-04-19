import { useState } from "react";

interface WasteTypeStepProps {
  onNext: (
    heavyWaste: boolean,
    plasterboard: boolean,
    plasterboardOption?: string
  ) => void;
  onBack: () => void;
  initialWasteType?: "general" | "heavy" | "plasterboard";
  initialPlasterboardOption?: string;
}

export function WasteTypeStep({ onNext, onBack, initialWasteType, initialPlasterboardOption = "" }: WasteTypeStepProps) {
  const [wasteType, setWasteType] = useState<
    "general" | "heavy" | "plasterboard" | null
  >(initialWasteType || null);
  const [plasterboardOption, setPlasterboardOption] = useState<string>(initialPlasterboardOption);

  const handleNext = () => {
    if (wasteType === null) return;

    const heavyWaste = wasteType === "heavy";
    const isPlasterboard = wasteType === "plasterboard";

    if (isPlasterboard && !plasterboardOption) {
      return;
    }

    onNext(heavyWaste, isPlasterboard, plasterboardOption || undefined);
  };

  const isNextDisabled = wasteType === null || (wasteType === "plasterboard" && !plasterboardOption);
  const getNextButtonTooltip = () => {
    if (wasteType === null) return "Please select a waste type";
    if (wasteType === "plasterboard" && !plasterboardOption) return "Please select a plasterboard type";
    return "";
  };

  return (
    <div className="step-container" data-testid="waste-type-step">
      <button className="back-button" onClick={onBack} data-testid="back-button">
        ← Back
      </button>
      <div className="step-header">
        <h2>Select Waste Type</h2>
      </div>

      <div className="waste-type-options">
        <label className="radio-option">
          <input
            type="radio"
            name="wasteType"
            value="general"
            checked={wasteType === "general"}
            onChange={() => setWasteType("general")}
            data-testid="waste-type-general"
          />
          <span className="option-title">General Waste</span>
          <span className="option-desc">
            Household items, furniture, garden waste
          </span>
        </label>

        <label className="radio-option">
          <input
            type="radio"
            name="wasteType"
            value="heavy"
            checked={wasteType === "heavy"}
            onChange={() => setWasteType("heavy")}
            data-testid="waste-type-heavy"
          />
          <span className="option-title">Heavy Waste</span>
          <span className="option-desc">Soil, concrete, heavy rubble</span>
        </label>

        <label className="radio-option">
          <input
            type="radio"
            name="wasteType"
            value="plasterboard"
            checked={wasteType === "plasterboard"}
            onChange={() => setWasteType("plasterboard")}
            data-testid="waste-type-plasterboard"
          />
          <span className="option-title">Plasterboard</span>
          <span className="option-desc">Drywall, gypsum board, plaster</span>
        </label>
      </div>

      {wasteType === "plasterboard" && (
        <div className="branching-section" data-testid="plasterboard-options">
          <h3>Select plasterboard type:</h3>
          <label className="radio-option">
            <input
              type="radio"
              name="plasterboardOption"
              value="contaminated"
              checked={plasterboardOption === "contaminated"}
              onChange={() => setPlasterboardOption("contaminated")}
              data-testid="plasterboard-contaminated"
            />
            <span>Contaminated/Damaged</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="plasterboardOption"
              value="clean"
              checked={plasterboardOption === "clean"}
              onChange={() => setPlasterboardOption("clean")}
              data-testid="plasterboard-clean"
            />
            <span>Clean/Reusable</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="plasterboardOption"
              value="mixed"
              checked={plasterboardOption === "mixed"}
              onChange={() => setPlasterboardOption("mixed")}
              data-testid="plasterboard-mixed"
            />
            <span>Mixed Waste with Plasterboard</span>
          </label>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className="primary-button"
        data-testid="waste-type-confirm-button"
        title={getNextButtonTooltip()}
      >
        Next
      </button>
    </div>
  );
}
