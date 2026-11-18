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
