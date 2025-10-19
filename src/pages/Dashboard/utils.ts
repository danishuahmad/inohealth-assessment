import chloride from "../../assets/icons/chloride.svg";
import calcium from "../../assets/icons/calcium.svg";
import creatine from "../../assets/icons/creatine.svg";
import glucose from "../../assets/icons/glucose.svg";
import potassium from "../../assets/icons/potassium.svg";
import sodium from "../../assets/icons/sodium.svg";
import protein from "../../assets/icons/protein.svg";

export const COLOR_PALETTE = ({
  creatine: "#FFAB91", // Pale Coral
  chloride: "#B2EBF2", // Light Cyan
  fasting_glucose: "#FFCCBC", // Soft Orange
  potassium: "#E6EE9C", // Pale Yellow-Green
  sodium: "#CFD8DC", // Light Greyish Blue
  total_calcium: "#A8D8B9", // Soft Green
  total_protein: "#D1C4E9", // Soft Lavender
});

export const ICONS = ({
  creatine: creatine, // Pale Coral
  chloride: chloride, // Light Cyan
  fasting_glucose: glucose, // Soft Orange
  potassium: potassium, // Pale Yellow-Green
  sodium: sodium, // Light Greyish Blue
  total_calcium: calcium, // Soft Green
  total_protein: protein, // Soft Lavender
});

export const REFERENCE_FOR_RANGES = ({
  creatine: { min: 0.6, max: 1.3 },
  chloride: { min: 96, max: 106 },
  fasting_glucose: { min: 70, max: 100 },
  potassium: { min: 3.5, max: 5.0 },
  sodium: { min: 135, max: 145 },
  total_calcium: { min: 8.5, max: 10.2 },
  total_protein: { min: 6.0, max: 8.3 },
});

export const getSubstanceIds = <T>(_substancesEnum: T[]) => Object.values(_substancesEnum);

export const unitFormatter = (unit: string) => {
  if (!unit) return "";
  const formattedUnit = unit.toLowerCase().trim();

  switch (formattedUnit) {
    case "mgdl":
      return "mg/dL";
    case "mmoll":
      return "mmol/L";
    case "ul":
      return "µL";
    case "gdl":
      return "g/dL";
    default:
      return unit; // fallback in case of unknown unit
  }
};
