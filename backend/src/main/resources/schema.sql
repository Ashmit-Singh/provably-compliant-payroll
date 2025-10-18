-- H2 Database Schema (compatible with PostgreSQL for production)
-- Note: H2 doesn't support CREATE EXTENSION, so we'll use H2's built-in UUID functions

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    job_role VARCHAR(100),
    salary NUMERIC(12,2) NOT NULL,
    benefit_plan VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payroll_runs (
    id UUID PRIMARY KEY,
    pay_period VARCHAR(50) NOT NULL, -- e.g. "2025-10"
    run_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    total_amount NUMERIC(15,2) NOT NULL,
    employee_count INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    blockchain_tx_hash VARCHAR(255),
    compliance_rules_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS blockchain_transactions (
    id UUID PRIMARY KEY,
    transaction_type VARCHAR(100) NOT NULL, -- e.g. PayrollRun, BenefitUpdate
    details TEXT NOT NULL,
    transaction_hash VARCHAR(255) UNIQUE NOT NULL,
    data_hash VARCHAR(255) NOT NULL,
    previous_hash VARCHAR(255),
    block_number BIGINT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
