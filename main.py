import pandas as pd
import joblib
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

app = FastAPI()

# --------------------------------------
# 1) TRAIN MODEL (Runs once at startup)
# --------------------------------------
DATA = pd.read_csv(r"C:\Users\21892\Desktop\cvs\fulldata.csv")

X = DATA.drop(columns=['Response','ID','Education','Marital_Status','Dt_Customer'], axis=1)
y = DATA['Response']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

joblib.dump(model, "rf_model.pkl")
joblib.dump(list(X.columns), "model_columns.pkl")

model = joblib.load("rf_model.pkl")
columns = joblib.load("model_columns.pkl")

# --------------------------------------
# 2) API INPUT SCHEMA
# --------------------------------------
class InputData(BaseModel):
    Year_Birth: int
    Income: float
    Kidhome: int
    Teenhome: int
    Recency: int
    MntWines: float
    MntFruits: float
    MntMeatProducts: float
    MntFishProducts: float
    MntSweetProducts: float
    MntGoldProds: float
    NumDealsPurchases: int
    NumWebPurchases: int
    NumCatalogPurchases: int
    NumStorePurchases: int
    NumWebVisitsMonth: int
    AcceptedCmp3: int
    AcceptedCmp4: int
    AcceptedCmp5: int
    AcceptedCmp1: int
    AcceptedCmp2: int
    Complain: int
    Z_CostContact: int
    Z_Revenue: int

# --------------------------------------
# 3) API ENDPOINT
# --------------------------------------
@app.post("/predict")
def make_prediction(data: InputData):
    df = pd.DataFrame([data.dict()])
    df = df[columns]
    pred = model.predict(df)[0]
    return {"Prediction": int(pred)}
