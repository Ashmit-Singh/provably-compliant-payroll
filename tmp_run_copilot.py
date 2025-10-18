import sys
sys.path.insert(0, 'c:/Users/ashmi/provably-compliant-payroll/ai-service/src')
from app.services.ai_compliance_copilot import AIComplianceCopilot
from app.services.nlp_service import NLPService
from app.services.prediction_service import PredictionService
from app.services.compliance_parser import ComplianceParser

nlp = NLPService()
pred = PredictionService()
parser = ComplianceParser()
copilot = AIComplianceCopilot(nlp, pred, parser)

res = copilot.monitor_global_regulations(ad_hoc_texts=['An increase of 2% tax effective January 1, 2026.'], current_employee_data=[{'employee_id':'1','name':'A','salary':90000}])
print(res)
