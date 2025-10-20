export type Report = {
    id: string;
    title: string;
    titleColor: string;
    value: number;
    unit: string;
    rangeMin: number;
    rangeMax: number;
    changePercentage: number; // Positive for increase, negative for decrease
    date: string;
    icon: string; // URL or path to the icon image
};
  
  