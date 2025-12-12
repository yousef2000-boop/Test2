// Matches the InputData class in your Python/FastAPI code exactly
export interface PredictionRequest {
  Year_Birth: number;
  Income: number;
  Kidhome: number;
  Teenhome: number;
  Recency: number;
  MntWines: number;
  MntFruits: number;
  MntMeatProducts: number;
  MntFishProducts: number;
  MntSweetProducts: number;
  MntGoldProds: number;
  NumDealsPurchases: number;
  NumWebPurchases: number;
  NumCatalogPurchases: number;
  NumStorePurchases: number;
  NumWebVisitsMonth: number;
  AcceptedCmp3: number; // 0 or 1
  AcceptedCmp4: number; // 0 or 1
  AcceptedCmp5: number; // 0 or 1
  AcceptedCmp1: number; // 0 or 1
  AcceptedCmp2: number; // 0 or 1
  Complain: number;     // 0 or 1
  Z_CostContact: number;
  Z_Revenue: number;
}

export interface PredictionResponse {
  Prediction: number; // 0 or 1
}

export type FormFieldCategory = 
  | 'Demographics' 
  | 'Spending' 
  | 'Engagement' 
  | 'Campaign History' 
  | 'Technical';
