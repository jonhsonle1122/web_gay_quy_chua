-- Migration 3: Donations, Bank Transactions, Complaints, and Immutable Audit Logs
CREATE TYPE donation_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'MANUAL_CONFIRMED',
    'EXPIRED'
);

CREATE TYPE reconciliation_source AS ENUM (
    'WEBHOOK',
    'RECEIPT_MANUAL',
    'STATEMENT_MANUAL'
);

-- Table: donations
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE RESTRICT NOT NULL,
    donation_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. 'CD-8F3K2'
    donor_name VARCHAR(255) DEFAULT 'Ẩn danh' NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE NOT NULL,
    is_amount_hidden BOOLEAN DEFAULT FALSE NOT NULL,
    amount BIGINT NOT NULL CHECK (amount > 0),
    prayer_message TEXT,
    status donation_status DEFAULT 'PENDING' NOT NULL,
    reconciliation_source reconciliation_source,
    receipt_image_url TEXT,
    donor_email VARCHAR(255),
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table: bank_transactions
CREATE TABLE bank_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE RESTRICT NOT NULL,
    transaction_code VARCHAR(100) UNIQUE NOT NULL, -- Unique bank reference code from Napas/webhook
    amount BIGINT NOT NULL CHECK (amount > 0),
    content TEXT NOT NULL,
    transaction_time TIMESTAMPTZ NOT NULL,
    matched_donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,
    is_matched BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table: complaints
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    temple_id UUID REFERENCES temples(id) ON DELETE CASCADE,
    complainant_name VARCHAR(255) NOT NULL,
    complainant_phone VARCHAR(20),
    complainant_email VARCHAR(255),
    content TEXT NOT NULL,
    evidence_urls TEXT[] DEFAULT '{}' NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN' NOT NULL, -- 'OPEN', 'RESOLVING', 'RESOLVED', 'REJECTED'
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table: audit_logs (Strictly Immutable)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id VARCHAR(100) NOT NULL, -- User UUID or 'SYSTEM_WEBHOOK'
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL, -- e.g. 'MANUAL_CONFIRM_DONATION', 'SUSPEND_CAMPAIGN'
    target_table VARCHAR(100) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    before_state JSONB,
    after_state JSONB,
    evidence_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger to enforce Immutability on audit_logs: NO UPDATE or DELETE allowed
CREATE OR REPLACE FUNCTION enforce_audit_logs_immutability()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'audit_logs entries are immutable and cannot be modified or deleted.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_logs_immutable
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION enforce_audit_logs_immutability();

-- Indexes for high performance lookup
CREATE INDEX idx_donations_code ON donations(donation_code);
CREATE INDEX idx_donations_campaign_status ON donations(campaign_id, status);
CREATE INDEX idx_bank_transactions_code ON bank_transactions(transaction_code);
CREATE INDEX idx_bank_transactions_matched ON bank_transactions(is_matched);
