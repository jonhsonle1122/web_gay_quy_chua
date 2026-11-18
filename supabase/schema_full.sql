-- Migration 1: Temples, Bank Accounts, and Documents
-- Enums for Temple status
CREATE TYPE temple_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');
CREATE TYPE document_type AS ENUM ('RELIGIOUS_CERTIFICATE', 'APPOINTMENT_DECISION', 'TEMPLE_FACADE_PHOTO', 'REPRESENTATIVE_ID');
CREATE TYPE document_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- Table: temples
CREATE TABLE temples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    province VARCHAR(100) NOT NULL,
    representative_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    status temple_status DEFAULT 'PENDING' NOT NULL,
    warning_flag BOOLEAN DEFAULT FALSE NOT NULL,
    can_create_campaign BOOLEAN DEFAULT FALSE NOT NULL,
    report_on_time_rate NUMERIC(5, 2) DEFAULT 100.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table: bank_accounts
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    temple_id UUID REFERENCES temples(id) ON DELETE CASCADE NOT NULL,
    bank_code VARCHAR(20) NOT NULL, -- e.g. 'MB', 'VCB', 'TCB'
    account_number VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_default BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_temple_bank_account UNIQUE (temple_id, bank_code, account_number)
);

-- Table: documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    temple_id UUID REFERENCES temples(id) ON DELETE CASCADE NOT NULL,
    doc_type document_type NOT NULL,
    file_url TEXT NOT NULL,
    status document_status DEFAULT 'PENDING' NOT NULL,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_temples_slug ON temples(slug);
CREATE INDEX idx_temples_status ON temples(status);
CREATE INDEX idx_bank_accounts_temple_id ON bank_accounts(temple_id);
-- Migration 2: Campaigns, Budget Items, Reports, and Media Updates
CREATE TYPE campaign_type AS ENUM (
    'TRAI_TANG',
    'KATHINA',
    'CONSTRUCTION',
    'AN_VI',
    'CHARITY',
    'OTHER'
);

CREATE TYPE campaign_status AS ENUM (
    'DRAFT',
    'PENDING_REVIEW',
    'FUNDING',
    'FUNDED',
    'EXPIRED',
    'EVENT_HELD',
    'REPORTED',
    'CLOSED',
    'SUSPENDED'
);

CREATE TYPE surplus_policy AS ENUM (
    'NEXT_EVENT',     -- Chuyển sang sự kiện tiếp theo của chùa
    'CHARITY_FUND',   -- Đưa vào quỹ từ thiện của chùa
    'NEXT_SEASON'     -- Giữ cho cùng mục đích vào mùa lễ sau
);

-- Table: campaigns
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    temple_id UUID REFERENCES temples(id) ON DELETE RESTRICT NOT NULL,
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE RESTRICT NOT NULL,
    type campaign_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    target_amount BIGINT NOT NULL CHECK (target_amount > 0),
    current_confirmed_amount BIGINT DEFAULT 0 NOT NULL,
    current_pending_amount BIGINT DEFAULT 0 NOT NULL,
    event_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status campaign_status DEFAULT 'DRAFT' NOT NULL,
    surplus_policy surplus_policy NOT NULL,
    allow_over_target BOOLEAN DEFAULT FALSE NOT NULL,
    cover_image TEXT,
    monks_count INT, -- Số vị tăng ni dự kiến (cho Trai Tăng)
    robes_count INT, -- Số lượng y (cho Kathina)
    retreat_season VARCHAR(100), -- Mùa an cư (cho Kathina)
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table: budget_items
CREATE TABLE budget_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 1 NOT NULL CHECK (quantity > 0),
    unit_price BIGINT NOT NULL CHECK (unit_price >= 0),
    total_price BIGINT GENERATED ALWAYS AS (quantity * unit_price) STORED,
    actual_expense BIGINT, -- Điền khi nộp báo cáo
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table: reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE UNIQUE NOT NULL,
    actual_total_raised BIGINT NOT NULL,
    actual_total_spent BIGINT NOT NULL,
    surplus_amount BIGINT GENERATED ALWAYS AS (actual_total_raised - actual_total_spent) STORED,
    explanation TEXT,
    receipt_urls TEXT[] DEFAULT '{}' NOT NULL,
    livestream_url TEXT,
    status VARCHAR(50) DEFAULT 'PENDING_APPROVAL' NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    approved_at TIMESTAMPTZ,
    admin_notes TEXT
);

-- Table: media_updates
CREATE TABLE media_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('IMAGE', 'VIDEO', 'LIVESTREAM')),
    url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_campaigns_slug ON campaigns(slug);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_temple ON campaigns(temple_id);
CREATE INDEX idx_budget_campaign ON budget_items(campaign_id);
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
