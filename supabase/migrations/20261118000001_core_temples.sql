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
