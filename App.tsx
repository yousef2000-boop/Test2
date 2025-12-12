import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  History, 
  Settings2, 
  Activity, 
  CheckCircle2, 
  XCircle,
  BrainCircuit,
  Loader2,
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { PredictionRequest, PredictionResponse } from './types';
import InputField from './components/InputField';
import FormSection from './components/FormSection';

// Determine API URL based on environment
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// If running locally, use localhost:8000.
// If running in production (e.g., Render), we usually want to point to the deployed backend URL.
// Replace the production string with your actual Render URL after deployment: e.g. "https://my-app.onrender.com/predict"
const API_URL = isLocal 
  ? "http://127.0.0.1:8000/predict" 
  : "https://customer-response-predictor.onrender.com/predict"; 

const INITIAL_STATE: PredictionRequest = {
  Year_Birth: 1980,
  Income: 55000,
  Kidhome: 0,
  Teenhome: 0,
  Recency: 30,
  MntWines: 200,
  MntFruits: 20,
  MntMeatProducts: 100,
  MntFishProducts: 15,
  MntSweetProducts: 10,
  MntGoldProds: 15,
  NumDealsPurchases: 2,
  NumWebPurchases: 5,
  NumCatalogPurchases: 2,
  NumStorePurchases: 5,
  NumWebVisitsMonth: 4,
  AcceptedCmp3: 0,
  AcceptedCmp4: 0,
  AcceptedCmp5: 0,
  AcceptedCmp1: 0,
  AcceptedCmp2: 0,
  Complain: 0,
  Z_CostContact: 3,
  Z_Revenue: 11,
};

function App() {
  const [formData, setFormData] = useState<PredictionRequest>(INITIAL_STATE);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCorsGuide, setShowCorsGuide] = useState(false);
  
  // Default to Simulation Mode so the app works immediately for the user
  const [isSimulationMode, setIsSimulationMode] = useState(true);

  const handleInputChange = (name: string, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (result !== null) setResult(null);
    if (error) {
      setError(null);
      setShowCorsGuide(false);
    }
  };

  const toggleMode = () => {
    setIsSimulationMode(!isSimulationMode);
    setError(null);
    setResult(null);
    setShowCorsGuide(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setShowCorsGuide(false);

    try {
      let predictionValue: number;

      if (isSimulationMode) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simple logic to mimic the Random Forest model for demonstration
        const totalSpend = formData.MntWines + formData.MntMeatProducts + formData.MntGoldProds;
        const engagement = formData.NumWebPurchases + formData.NumStorePurchases;
        
        // Mock logic: High income OR High spend OR High engagement = Positive response
        predictionValue = (formData.Income > 70000 || totalSpend > 800 || engagement > 15) ? 1 : 0;
      } else {
        try {
          // Use the relative URL or configured API_URL
          // If the backend is on Render and this frontend is static, ensure API_URL is the full Render URL.
          const targetUrl = API_URL;
          
          console.log(`Sending request to: ${targetUrl}`);
          const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
          }

          const data: PredictionResponse = await response.json();
          predictionValue = data.Prediction;
        } catch (fetchError: any) {
          console.error(fetchError);
          // Detect common CORS or Network errors
          if (fetchError.message === 'Failed to fetch' || fetchError.name === 'TypeError') {
            setShowCorsGuide(true);
            throw new Error("Connection Refused. Ensure Backend is running and CORS is enabled.");
          }
          throw fetchError;
        }
      }

      setResult(predictionValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">ResponseAI</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">Random Forest Classifier Interface</p>
            </div>
          </div>
          
          <button 
            onClick={toggleMode}
            className={`flex items-center space-x-3 px-4 py-2 rounded-full border transition-all duration-200 ${
              isSimulationMode 
                ? 'bg-amber-50 border-amber-200 hover:bg-amber-100' 
                : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Click to toggle between Simulation and Live Backend"
          >
             <div className="flex items-center space-x-2">
                <div className={`relative flex h-3 w-3`}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulationMode ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isSimulationMode ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wide ${isSimulationMode ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {isSimulationMode ? 'Simulation Mode' : 'Live Connection'}
                </span>
             </div>
             {isSimulationMode ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit}>
              
              <FormSection title="Demographics" icon={Users}>
                <InputField label="Year of Birth" name="Year_Birth" value={formData.Year_Birth} onChange={handleInputChange} min={1900} max={2024} />
                <InputField label="Annual Income" name="Income" value={formData.Income} onChange={handleInputChange} type="currency" step={100} />
                <InputField label="Kids at Home" name="Kidhome" value={formData.Kidhome} onChange={handleInputChange} min={0} max={10} />
                <InputField label="Teens at Home" name="Teenhome" value={formData.Teenhome} onChange={handleInputChange} min={0} max={10} />
              </FormSection>

              <FormSection title="Spending Habits (Last 2 Years)" icon={ShoppingBag}>
                <InputField label="Wines" name="MntWines" value={formData.MntWines} onChange={handleInputChange} type="currency" />
                <InputField label="Fruits" name="MntFruits" value={formData.MntFruits} onChange={handleInputChange} type="currency" />
                <InputField label="Meat Products" name="MntMeatProducts" value={formData.MntMeatProducts} onChange={handleInputChange} type="currency" />
                <InputField label="Fish Products" name="MntFishProducts" value={formData.MntFishProducts} onChange={handleInputChange} type="currency" />
                <InputField label="Sweet Products" name="MntSweetProducts" value={formData.MntSweetProducts} onChange={handleInputChange} type="currency" />
                <InputField label="Gold Products" name="MntGoldProds" value={formData.MntGoldProds} onChange={handleInputChange} type="currency" />
              </FormSection>

              <FormSection title="Engagement & Behavior" icon={Activity}>
                <InputField label="Days Since Last Purchase" name="Recency" value={formData.Recency} onChange={handleInputChange} />
                <InputField label="Deals Purchases" name="NumDealsPurchases" value={formData.NumDealsPurchases} onChange={handleInputChange} />
                <InputField label="Web Purchases" name="NumWebPurchases" value={formData.NumWebPurchases} onChange={handleInputChange} />
                <InputField label="Catalog Purchases" name="NumCatalogPurchases" value={formData.NumCatalogPurchases} onChange={handleInputChange} />
                <InputField label="Store Purchases" name="NumStorePurchases" value={formData.NumStorePurchases} onChange={handleInputChange} />
                <InputField label="Web Visits (Month)" name="NumWebVisitsMonth" value={formData.NumWebVisitsMonth} onChange={handleInputChange} />
              </FormSection>

              <FormSection title="Campaign History" icon={History}>
                <InputField label="Accepted Campaign 1" name="AcceptedCmp1" value={formData.AcceptedCmp1} onChange={handleInputChange} type="toggle" />
                <InputField label="Accepted Campaign 2" name="AcceptedCmp2" value={formData.AcceptedCmp2} onChange={handleInputChange} type="toggle" />
                <InputField label="Accepted Campaign 3" name="AcceptedCmp3" value={formData.AcceptedCmp3} onChange={handleInputChange} type="toggle" />
                <InputField label="Accepted Campaign 4" name="AcceptedCmp4" value={formData.AcceptedCmp4} onChange={handleInputChange} type="toggle" />
                <InputField label="Accepted Campaign 5" name="AcceptedCmp5" value={formData.AcceptedCmp5} onChange={handleInputChange} type="toggle" />
              </FormSection>

              <FormSection title="Technical / Other" icon={Settings2}>
                <InputField label="Complaints Filed" name="Complain" value={formData.Complain} onChange={handleInputChange} type="toggle" />
                <InputField label="Z Cost Contact" name="Z_CostContact" value={formData.Z_CostContact} onChange={handleInputChange} />
                <InputField label="Z Revenue" name="Z_Revenue" value={formData.Z_Revenue} onChange={handleInputChange} />
              </FormSection>

            </form>
          </div>

          {/* Right Column: Result Sticky Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Action Card */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isSimulationMode ? 'from-amber-400 to-orange-500' : 'from-blue-500 to-indigo-600'}`}></div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">Run Analysis</h2>
                <p className="text-slate-500 text-sm mb-6">
                  {isSimulationMode 
                    ? "Running in Simulation Mode. Toggling inputs will generate instant mock predictions."
                    : "Submit the customer profile to your local Random Forest model for real-time scoring."
                  }
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full flex items-center justify-center space-x-2 py-4 rounded-lg font-semibold text-white shadow-md transition-all transform active:scale-[0.98]
                    ${loading 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : isSimulationMode
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 hover:shadow-orange-200'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-200'
                    }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5" />
                      <span>{isSimulationMode ? 'Simulate Prediction' : 'Predict Response'}</span>
                    </>
                  )}
                </button>

                {error && (
                   <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                     <div className="flex items-center space-x-2 font-semibold">
                        <XCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                        <span>Analysis Failed</span>
                     </div>
                     <p className="ml-7 text-red-600/90">{error}</p>
                   </div>
                )}
              </div>

              {/* Result Card */}
              {result !== null && (
                <div className={`rounded-xl shadow-xl border overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-4
                  ${result === 1 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-white border-slate-200'
                  }`}
                >
                  <div className={`p-8 text-center border-b ${result === 1 ? 'border-emerald-100' : 'border-slate-100'}`}>
                    <div className={`mx-auto flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-sm ${result === 1 ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                      {result === 1 ? (
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                      ) : (
                        <XCircle className="w-10 h-10 text-slate-400" />
                      )}
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${result === 1 ? 'text-emerald-800' : 'text-slate-800'}`}>
                      {result === 1 ? "Positive Response" : "Negative Response"}
                    </h3>
                    <p className={`text-base font-medium ${result === 1 ? 'text-emerald-600' : 'text-slate-500'}`}>
                      Model Prediction: {result}
                    </p>
                  </div>
                  <div className="p-4 bg-white/40 text-xs text-center text-slate-500 font-medium">
                    Prediction based on 24 variable inputs.
                  </div>
                </div>
              )}

              {/* CORS / Connection Help Guide */}
              {showCorsGuide && !isSimulationMode && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm animate-in fade-in zoom-in-95">
                  <h4 className="flex items-center space-x-2 text-amber-800 font-bold mb-3">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Connection Issue Detected</span>
                  </h4>
                  <p className="text-sm text-amber-700 mb-3 leading-relaxed">
                    The browser blocked the request. This is usually due to missing <b>CORS</b> configuration or the server being offline.
                  </p>
                  <div className="bg-slate-900 rounded-md p-3 overflow-x-auto relative group">
                    <pre className="text-xs text-emerald-400 font-mono leading-relaxed">
{`from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`}
                    </pre>
                  </div>
                </div>
              )}

              {/* Stats / Info */}
              {!showCorsGuide && (
                <div className="bg-slate-900 text-slate-300 rounded-xl p-6 shadow-md border border-slate-800">
                  <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                    <Settings2 className="w-4 h-4" />
                    <span>System Status</span>
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span>Backend URL</span>
                      <code className="text-xs bg-slate-800 px-2 py-1 rounded text-blue-300 truncate max-w-[150px]" title={API_URL}>
                        {API_URL}
                      </code>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span>Mode</span>
                      <span className={`font-medium ${isSimulationMode ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {isSimulationMode ? 'Simulation' : 'Live'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Model</span>
                      <span className="text-white font-medium">Random Forest</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;