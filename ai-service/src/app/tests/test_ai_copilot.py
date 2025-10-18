import sys
sys.path.insert(0, 'c:/Users/ashmi/provably-compliant-payroll/ai-service/src')

from app.services.ai_compliance_copilot import AIComplianceCopilot
from app.services.nlp_service import NLPService
from app.services.prediction_service import PredictionService
from app.services.compliance_parser import ComplianceParser


def test_copilot_predict():
    nlp = NLPService()
    pred = PredictionService()
    parser = ComplianceParser()
    copilot = AIComplianceCopilot(nlp, pred, parser)

    # simple payroll data
    payroll = [
        {"employee_id": "1", "name": "Alice", "salary": 90000},
        {"employee_id": "2", "name": "Bob", "salary": 120000},
    ]

    result = copilot.predict_compliance_risks(payroll)
    assert 'risk_score' in result
    assert 'risk_level' in result

    print('copilot predict test OK')
