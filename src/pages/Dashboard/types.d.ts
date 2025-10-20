export enum Substances {
  Creatine = "creatine",
  Chloride = "chloride",
  FastingGlucose = "fasting_glucose",
  Potassium = "potassium",
  Sodium = "sodium",
  TotalCalcium = "total_calcium",
  TotalProtein = "total_protein",
}

// Derive a union of the enum values
type SubstanceName = `${Substances}`; // or: type SubstanceName = Substances[keyof typeof Substances]

// Create dynamic fields
type SubstanceValues = {
  [K in SubstanceName]: number;
};

type SubstanceUnits = {
  [K in SubstanceName as `${K}_unit`]: string;
};

// Combine everything
type ApiResponse = {
  client_id: string;
  date_testing: string;
  date_birthdate: string;
  gender: number;
  ethnicity: number;
} & SubstanceValues &
  SubstanceUnits;
