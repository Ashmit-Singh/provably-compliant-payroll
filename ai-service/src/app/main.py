from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import logging

from .services.nlp_service import NLPService
from .services.prediction_service import PredictionService
from .services.compliance_parser import ComplianceParser

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CompliantPay AI Service",
    description="AI-powered predictive analytics and compliance parsing for payroll system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
nlp_service = NLPService()
prediction_service = PredictionService()
compliance_parser = ComplianceParser()

class LegislationAnalysisRequest(BaseModel):
    legislation_text: str
    current_employee_data: List[Dict[str, Any]]

class PredictionResponse(BaseModel):
    projected_cost_increase: float
    affected_employee_count: int
    monthly_increase: float
    effective_date: str
    cost_breakdown: Dict[str, float]
    affected_employees: List[Dict[str, Any]]
    recommendations: List[str]

class ComplianceRule(BaseModel):
    jurisdiction: str
    rule_type: str
    description: str
    effective_date: str
    impact: str

@app.get("/")
async def root():
    return {"message": "CompliantPay AI Service is running"}

@app.post("/analyze/legislation", response_model=PredictionResponse)
async def analyze_legislation_impact(request: LegislationAnalysisRequest):
    """
    Analyze the financial impact of proposed legislation on payroll costs
    """
    try:
        logger.info("Analyzing legislation impact")
        
        # Parse legislation text
        parsed_rules = compliance_parser.parse_legislation_text(request.legislation_text)
        
        # Predict impact
        impact_analysis = prediction_service.predict_impact(
            request.current_employee_data,
            parsed_rules
        )
        
        return impact_analysis
        
    except Exception as e:
        logger.error(f"Error analyzing legislation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)