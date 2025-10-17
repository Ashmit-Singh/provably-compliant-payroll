-- Create tables
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY,
    employee_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    salary DECIMAL(12,2) NOT NULL,
    benefit_plan VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payroll_runs (
    id UUID PRIMARY KEY,
    pay_period VARCHAR(255) NOT NULL,
    run_date TIMESTAMP NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    employee_count INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    blockchain_tx_hash VARCHAR(255),
    compliance_rules_hash VARCHAR(255),
    created_at TIMESTAMP,
    processed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blockchain_transactions (
    id UUID PRIMARY KEY,
    transaction_type VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    transaction_hash VARCHAR(255) UNIQUE NOT NULL,
    data_hash VARCHAR(255) NOT NULL,
    previous_hash VARCHAR(255) NOT NULL,
    block_number BIGINT,
    timestamp TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP
);