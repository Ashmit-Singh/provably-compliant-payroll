# AI Compliance Co-pilot

This service provides a scaffolded AI Compliance Co-pilot that:

- Monitors regulatory feeds and parses legislation text
- Predicts payroll impact and compliance risks
- Produces audit-ready, tamper-evident proofs (SHA-256 digests) for later anchoring on blockchain

Notes for production hardening:

1. Replace `_fetch_feed` with authenticated feed connectors (government APIs, RSS, govgazettes).
2. Integrate a real LLM or fine-tuned model for deeper NLP (the project already includes `transformers` in requirements).
3. For blockchain anchoring, replace the `_make_blockchain_proof` with a signed transaction to your blockchain service.
4. Use message queues (e.g., Kafka/RabbitMQ) for feed ingestion at scale.
5. Add observability (metrics, tracing) and secure API keys using a secrets manager.

Endpoints:

- POST /copilot/monitor
  - Payload: { feed_urls?: string[], ad_hoc_texts?: string[], current_employee_data?: [] }
  - Returns: scanned results, predictions and proofs

- POST /copilot/risks
  - Payload: { payroll_data: [] }
  - Returns: risk_score, risk_level, recommendations, audit_proof

Run locally:

1. Ensure `ai-service/requirements.txt` installed in a virtualenv
2. Start with: `uvicorn app.main:app --reload --port 8000`
3. Configure the frontend `REACT_APP_API_URL` to point to `http://localhost:8000`

This is intended as Phase 1 of the `AI COMPLIANCE CO-PILOT` feature set.
