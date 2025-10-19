export const SubstanceKeys = {
  Creatine: "creatine",
  Chloride: "chloride",
  FastingGlucose: "fasting_glucose",
  Potassium: "potassium",
  Sodium: "sodium",
  TotalCalcium: "total_calcium",
  TotalProtein: "total_protein",
} as const;

// Derive a union of the enum values
export type SubstanceName = (typeof SubstanceKeys)[keyof typeof SubstanceKeys];

// Create dynamic fields
export type SubstanceValues = {
  [K in SubstanceName]: number;
};

export type SubstanceUnits = {
  [K in SubstanceName as `${K}_unit`]: string;
};

// Combine everything
export type ApiResponse = {
  client_id: string;
  date_testing: string;
  date_birthdate: string;
  gender: number;
  ethnicity: number;
} & SubstanceValues &
  SubstanceUnits;
