-- Migration 003: Research System and IP-Based User Tracking
-- Following Block Theory: Schema First
-- Run after 002_cost_tracking_and_verification.sql

-- ============================================================================
-- TABLE 1: research_topics (Three core research areas)
-- ============================================================================

CREATE TABLE research_topics (
    topic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identification
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500),

    -- Content
    description TEXT NOT NULL,
    icon_name VARCHAR(50) NOT NULL,  -- 'Brain', 'Target', 'Sparkles'
    color_hex VARCHAR(7) NOT NULL,   -- e.g., '#2C5282'

    -- Ordering
    display_order INTEGER DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'hidden')),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_research_topics_slug ON research_topics(slug);
CREATE INDEX idx_research_topics_order ON research_topics(display_order);

-- ============================================================================
-- TABLE 2: research_articles (Articles within topics)
-- ============================================================================

CREATE TABLE research_articles (
    article_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship (optional - some articles are "Interesting Finds" without a topic)
    topic_id UUID REFERENCES research_topics(topic_id) ON DELETE SET NULL,

    -- Identification
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500),

    -- Content
    introduction TEXT,
    conclusion TEXT,
    key_takeaways JSONB DEFAULT '[]'::jsonb,  -- Array of strings
    content_sections JSONB DEFAULT '[]'::jsonb,  -- Array of {heading, content}

    -- Metadata
    author_name VARCHAR(100) DEFAULT 'Riscent Research Team',
    published_date DATE,
    read_time VARCHAR(50),
    category VARCHAR(100),
    color_hex VARCHAR(7) DEFAULT '#4A7C59',  -- Default sage

    -- Publishing
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    featured BOOLEAN DEFAULT FALSE,
    is_interesting_find BOOLEAN DEFAULT FALSE,  -- For "Interesting Finds" section

    -- SEO
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_research_articles_slug ON research_articles(slug);
CREATE INDEX idx_research_articles_topic ON research_articles(topic_id, status);
CREATE INDEX idx_research_articles_status ON research_articles(status, published_at DESC);
CREATE INDEX idx_research_articles_interesting ON research_articles(is_interesting_find, status) WHERE is_interesting_find = TRUE;

-- ============================================================================
-- TABLE 3: research_documents (PDFs and files per topic)
-- ============================================================================

CREATE TABLE research_documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    topic_id UUID REFERENCES research_topics(topic_id) ON DELETE SET NULL,
    article_id UUID REFERENCES research_articles(article_id) ON DELETE SET NULL,

    -- File info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(50) DEFAULT 'pdf',
    file_size_bytes INTEGER,

    -- Ordering
    display_order INTEGER DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_research_documents_topic ON research_documents(topic_id, status);
CREATE INDEX idx_research_documents_article ON research_documents(article_id) WHERE article_id IS NOT NULL;

-- ============================================================================
-- TABLE 4: users (Clerk-linked user accounts - primary user identity)
-- ============================================================================

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Clerk integration
    clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
    clerk_org_id VARCHAR(255),  -- e.g., 'org_seq' for Seq organization

    -- Profile (from Clerk)
    email VARCHAR(255),
    full_name VARCHAR(255),
    avatar_url TEXT,

    -- Usage tracking
    total_tokens_used INTEGER DEFAULT 0,
    total_input_tokens INTEGER DEFAULT 0,
    total_output_tokens INTEGER DEFAULT 0,
    total_cost_cents NUMERIC(10,4) DEFAULT 0,
    cost_limit_cents NUMERIC(10,4) DEFAULT 100,  -- $1.00 default for logged-in users

    -- Time tracking
    total_time_seconds INTEGER DEFAULT 0,
    conversation_count INTEGER DEFAULT 0,

    -- Conversion tracking
    converted_from_visitor_id UUID REFERENCES visitors(visitor_id),
    converted_from_ip_hash VARCHAR(64),
    converted_at TIMESTAMPTZ,

    -- Role
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'premium', 'admin')),

    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_users_clerk_org ON users(clerk_org_id) WHERE clerk_org_id IS NOT NULL;
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- TABLE 5: ip_visitors (IP-based tracking for anonymous users)
-- ============================================================================

CREATE TABLE ip_visitors (
    ip_visitor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- IP identification (hashed for privacy)
    ip_hash VARCHAR(64) UNIQUE NOT NULL,  -- SHA-256 hash of IP

    -- Cost tracking
    total_tokens_used INTEGER DEFAULT 0,
    total_input_tokens INTEGER DEFAULT 0,
    total_output_tokens INTEGER DEFAULT 0,
    total_cost_cents NUMERIC(10,4) DEFAULT 0,
    cost_gate_reached BOOLEAN DEFAULT FALSE,

    -- Linked data (when user signs up or we identify cookie)
    linked_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    linked_visitor_id UUID REFERENCES visitors(visitor_id) ON DELETE SET NULL,

    -- Timestamps
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ip_visitors_hash ON ip_visitors(ip_hash);
CREATE INDEX idx_ip_visitors_user ON ip_visitors(linked_user_id) WHERE linked_user_id IS NOT NULL;
CREATE INDEX idx_ip_visitors_cost_gate ON ip_visitors(cost_gate_reached) WHERE cost_gate_reached = TRUE;

-- ============================================================================
-- TABLE 6: user_conversations (Link conversations to user accounts)
-- ============================================================================

CREATE TABLE user_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    conversation_id UUID NOT NULL REFERENCES seq_conversations(conversation_id) ON DELETE CASCADE,

    -- Timestamps
    linked_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, conversation_id)
);

CREATE INDEX idx_user_conversations_user ON user_conversations(user_id);
CREATE INDEX idx_user_conversations_conv ON user_conversations(conversation_id);

-- ============================================================================
-- ALTER: Add IP hash tracking to seq_messages
-- ============================================================================

ALTER TABLE seq_messages ADD COLUMN IF NOT EXISTS ip_hash VARCHAR(64);

-- ============================================================================
-- ALTER: Add user_id to seq_conversations for direct user linking
-- ============================================================================

ALTER TABLE seq_conversations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(user_id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_user ON seq_conversations(user_id) WHERE user_id IS NOT NULL;

-- ============================================================================
-- FUNCTION: update_ip_visitor_cost
-- Updates cost tracking for IP-based visitors
-- Returns: new_cost, gate_reached, limit_cents
-- ============================================================================

CREATE OR REPLACE FUNCTION update_ip_visitor_cost(
    p_ip_hash VARCHAR(64),
    p_input_tokens INTEGER,
    p_output_tokens INTEGER
) RETURNS TABLE(new_cost NUMERIC, gate_reached BOOLEAN, limit_cents NUMERIC) AS $$
DECLARE
    v_ip_visitor ip_visitors%ROWTYPE;
    v_user users%ROWTYPE;
    v_threshold NUMERIC := 30.0;  -- 30 cents = $0.30 for anonymous
    v_new_cost NUMERIC;
BEGIN
    -- Get or create IP visitor
    INSERT INTO ip_visitors (ip_hash)
    VALUES (p_ip_hash)
    ON CONFLICT (ip_hash) DO UPDATE SET last_seen_at = NOW()
    RETURNING * INTO v_ip_visitor;

    -- Check if linked to a user
    IF v_ip_visitor.linked_user_id IS NOT NULL THEN
        -- Update user cost
        UPDATE users SET
            total_tokens_used = total_tokens_used + p_input_tokens + p_output_tokens,
            total_input_tokens = total_input_tokens + p_input_tokens,
            total_output_tokens = total_output_tokens + p_output_tokens,
            total_cost_cents = total_cost_cents + (p_input_tokens * 0.0003) + (p_output_tokens * 0.0015),
            last_active_at = NOW(),
            updated_at = NOW()
        WHERE user_id = v_ip_visitor.linked_user_id
        RETURNING * INTO v_user;

        RETURN QUERY SELECT
            v_user.total_cost_cents,
            v_user.total_cost_cents >= v_user.cost_limit_cents,
            v_user.cost_limit_cents;
    ELSE
        -- Update IP visitor cost
        UPDATE ip_visitors SET
            total_tokens_used = total_tokens_used + p_input_tokens + p_output_tokens,
            total_input_tokens = total_input_tokens + p_input_tokens,
            total_output_tokens = total_output_tokens + p_output_tokens,
            total_cost_cents = total_cost_cents + (p_input_tokens * 0.0003) + (p_output_tokens * 0.0015),
            cost_gate_reached = CASE
                WHEN total_cost_cents + (p_input_tokens * 0.0003) + (p_output_tokens * 0.0015) >= v_threshold
                THEN TRUE ELSE cost_gate_reached
            END,
            updated_at = NOW()
        WHERE ip_hash = p_ip_hash
        RETURNING total_cost_cents INTO v_new_cost;

        RETURN QUERY SELECT
            v_new_cost,
            v_new_cost >= v_threshold,
            v_threshold;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: get_ip_cost_status
-- Get current cost status for an IP
-- ============================================================================

CREATE OR REPLACE FUNCTION get_ip_cost_status(
    p_ip_hash VARCHAR(64)
) RETURNS TABLE(
    total_cost NUMERIC,
    gate_reached BOOLEAN,
    limit_cents NUMERIC,
    is_linked_user BOOLEAN,
    user_id UUID
) AS $$
DECLARE
    v_ip_visitor ip_visitors%ROWTYPE;
    v_user users%ROWTYPE;
    v_threshold NUMERIC := 30.0;
BEGIN
    SELECT * INTO v_ip_visitor FROM ip_visitors WHERE ip_hash = p_ip_hash;

    IF v_ip_visitor IS NULL THEN
        -- New IP, return defaults
        RETURN QUERY SELECT
            0::NUMERIC,
            FALSE,
            v_threshold,
            FALSE,
            NULL::UUID;
        RETURN;
    END IF;

    IF v_ip_visitor.linked_user_id IS NOT NULL THEN
        SELECT * INTO v_user FROM users WHERE user_id = v_ip_visitor.linked_user_id;

        RETURN QUERY SELECT
            v_user.total_cost_cents,
            v_user.total_cost_cents >= v_user.cost_limit_cents,
            v_user.cost_limit_cents,
            TRUE,
            v_user.user_id;
    ELSE
        RETURN QUERY SELECT
            v_ip_visitor.total_cost_cents,
            v_ip_visitor.cost_gate_reached,
            v_threshold,
            FALSE,
            NULL::UUID;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: link_ip_to_user
-- Link an IP visitor to a user account (called on login/signup)
-- ============================================================================

CREATE OR REPLACE FUNCTION link_ip_to_user(
    p_ip_hash VARCHAR(64),
    p_user_id UUID
) RETURNS VOID AS $$
BEGIN
    -- Update IP visitor to link to user
    UPDATE ip_visitors SET
        linked_user_id = p_user_id,
        updated_at = NOW()
    WHERE ip_hash = p_ip_hash;

    -- Update user with conversion info
    UPDATE users SET
        converted_from_ip_hash = p_ip_hash,
        converted_at = COALESCE(converted_at, NOW()),
        updated_at = NOW()
    WHERE user_id = p_user_id
      AND converted_from_ip_hash IS NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_research_topics_updated_at
    BEFORE UPDATE ON research_topics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_research_articles_updated_at
    BEFORE UPDATE ON research_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_research_documents_updated_at
    BEFORE UPDATE ON research_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ip_visitors_updated_at
    BEFORE UPDATE ON ip_visitors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- SEED DATA: Initial research topics
-- ============================================================================

INSERT INTO research_topics (slug, title, subtitle, description, icon_name, color_hex, display_order, status) VALUES
(
    'mechanistic-interpretability',
    'Mechanistic Interpretability',
    'Understanding How Neural Networks Actually Think',
    'Opening the black box of AI systems through reverse-engineering neural network internals. We believe transparency is the foundation of trust.',
    'Brain',
    '#2C5282',
    1,
    'active'
),
(
    'usefulness-purpose-understanding-intent',
    'Usefulness & Purpose of Understanding Intent',
    'Why Intent Matters in AI Systems',
    'Exploring how understanding and encoding intent in AI systems creates more useful, trustworthy, and aligned artificial intelligence.',
    'Target',
    '#E07A5F',
    2,
    'active'
),
(
    'consciousness-abstraction',
    'Consciousness Abstraction',
    'Layers of Awareness in Synthetic Intelligence',
    'Investigating the abstraction layers of consciousness—from reactive patterns to meta-awareness—and how they manifest in AI systems.',
    'Sparkles',
    '#4A7C59',
    3,
    'active'
);

-- ============================================================================
-- DONE
-- ============================================================================
-- Run this migration on your Neon database after 002_cost_tracking_and_verification.sql
-- Example: psql $DATABASE_URL -f migrations/003_research_and_users.sql
