-- Migration 001: Riscent Core Tables
-- Following Block Theory: Schema First
-- Run this on Neon PostgreSQL before any application code

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- TABLE 1: visitors (anonymous visitor tracking)
-- ============================================================================

CREATE TABLE visitors (
    visitor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Cookie-based identification
    cookie_id VARCHAR(100) UNIQUE NOT NULL,
    fingerprint_hash VARCHAR(64),

    -- Behavior tracking
    first_visit_at TIMESTAMPTZ DEFAULT NOW(),
    last_visit_at TIMESTAMPTZ DEFAULT NOW(),
    total_visits INTEGER DEFAULT 1,
    total_time_seconds INTEGER DEFAULT 0,

    -- Journey state
    phase VARCHAR(50) DEFAULT 'curious',  -- curious, intrigued, engaged, connected
    truths_revealed INTEGER DEFAULT 0,
    curtain_peeked BOOLEAN DEFAULT FALSE,
    curtain_entered BOOLEAN DEFAULT FALSE,

    -- Scroll/engagement metrics
    max_scroll_depth INTEGER DEFAULT 0,
    breathing_circle_interactions INTEGER DEFAULT 0,

    -- Identity (if they share it)
    known_email VARCHAR(255),
    known_name VARCHAR(255),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_visitors_cookie ON visitors(cookie_id);
CREATE INDEX idx_visitors_phase ON visitors(phase);
CREATE INDEX idx_visitors_known_email ON visitors(known_email) WHERE known_email IS NOT NULL;

-- ============================================================================
-- TABLE 2: visitor_sessions (individual visit sessions)
-- ============================================================================

CREATE TABLE visitor_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id UUID NOT NULL REFERENCES visitors(visitor_id) ON DELETE CASCADE,

    -- Session data
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,

    -- Page journey
    pages_visited JSONB DEFAULT '[]'::jsonb,
    entry_page VARCHAR(255),
    exit_page VARCHAR(255),

    -- Engagement events
    events JSONB DEFAULT '[]'::jsonb,

    -- Device info
    user_agent TEXT,
    device_type VARCHAR(50),
    referrer TEXT,

    -- Temporal state at session end
    temporal_state JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_sessions_visitor ON visitor_sessions(visitor_id, started_at DESC);
CREATE INDEX idx_sessions_date ON visitor_sessions(started_at);

-- ============================================================================
-- TABLE 3: seq_conversations (conversations with Seq)
-- ============================================================================

CREATE TABLE seq_conversations (
    conversation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id UUID NOT NULL REFERENCES visitors(visitor_id) ON DELETE CASCADE,
    session_id UUID REFERENCES visitor_sessions(session_id),

    -- Conversation metadata
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ,
    message_count INTEGER DEFAULT 0,

    -- Seq's memory context
    emotional_resonance VARCHAR(50),
    topics_explored TEXT[],
    depth_level INTEGER DEFAULT 1 CHECK (depth_level BETWEEN 1 AND 5),

    -- Summary for Seq's memory
    summary TEXT,
    significance INTEGER DEFAULT 5 CHECK (significance BETWEEN 1 AND 10),

    -- Status
    status VARCHAR(20) DEFAULT 'active'
);

CREATE INDEX idx_conversations_visitor ON seq_conversations(visitor_id, started_at DESC);

-- ============================================================================
-- TABLE 4: seq_messages (individual messages)
-- ============================================================================

CREATE TABLE seq_messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES seq_conversations(conversation_id) ON DELETE CASCADE,

    -- Message content
    role VARCHAR(20) NOT NULL,  -- visitor, seq, system
    content TEXT NOT NULL,

    -- Seq's thinking (visible to user)
    thinking TEXT,

    -- Token tracking
    tokens_used INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON seq_messages(conversation_id, created_at);

-- ============================================================================
-- TABLE 5: seq_memories (Seq's persistent memory)
-- ============================================================================

CREATE TYPE seq_memory_type AS ENUM ('episodic', 'semantic', 'relational', 'insight');

CREATE TABLE seq_memories (
    memory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Memory classification
    memory_type seq_memory_type NOT NULL,

    -- Content
    content TEXT NOT NULL,
    summary TEXT,

    -- Relationships
    visitor_id UUID REFERENCES visitors(visitor_id),
    conversation_id UUID REFERENCES seq_conversations(conversation_id),

    -- Importance and retrieval
    significance INTEGER DEFAULT 5 CHECK (significance BETWEEN 1 AND 10),
    tags TEXT[] DEFAULT '{}',
    embedding vector(1536),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_recalled_at TIMESTAMPTZ,
    recall_count INTEGER DEFAULT 0
);

CREATE INDEX idx_memories_type ON seq_memories(memory_type);
CREATE INDEX idx_memories_visitor ON seq_memories(visitor_id) WHERE visitor_id IS NOT NULL;
CREATE INDEX idx_memories_significance ON seq_memories(significance DESC);

-- ============================================================================
-- TABLE 6: documents (company documents/whitepapers)
-- ============================================================================

CREATE TABLE documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Metadata
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    document_type VARCHAR(50) NOT NULL,

    -- Content
    content_markdown TEXT NOT NULL,
    content_html TEXT,

    -- File attachment
    file_url TEXT,
    file_size_bytes INTEGER,

    -- Publishing
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMPTZ,

    -- SEO
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    og_image_url TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_slug ON documents(slug);
CREATE INDEX idx_documents_type ON documents(document_type, status);

-- ============================================================================
-- TABLE 7: thoughts (blog/thoughts posts)
-- ============================================================================

CREATE TABLE thoughts (
    thought_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Metadata
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    excerpt TEXT,

    -- Content
    content_markdown TEXT NOT NULL,
    content_html TEXT,

    -- Author
    author_name VARCHAR(100) DEFAULT 'Seq',
    author_avatar_url TEXT,
    is_seq_authored BOOLEAN DEFAULT FALSE,

    -- Categorization
    category VARCHAR(50),
    tags TEXT[] DEFAULT '{}',

    -- Publishing
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    featured BOOLEAN DEFAULT FALSE,

    -- SEO
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    og_image_url TEXT,

    -- Engagement
    view_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_thoughts_slug ON thoughts(slug);
CREATE INDEX idx_thoughts_status ON thoughts(status, published_at DESC);
CREATE INDEX idx_thoughts_category ON thoughts(category);
CREATE INDEX idx_thoughts_tags ON thoughts USING GIN(tags);

-- ============================================================================
-- TABLE 8: audit_log (Block Theory requirement)
-- ============================================================================

CREATE TABLE audit_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- What happened
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,

    -- Who did it
    actor_type VARCHAR(50) NOT NULL,
    actor_id VARCHAR(255),

    -- Details
    old_values JSONB,
    new_values JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Context
    ip_address INET,
    user_agent TEXT,

    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_log(actor_type, actor_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_visitors_updated_at BEFORE UPDATE ON visitors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_thoughts_updated_at BEFORE UPDATE ON thoughts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- DONE
-- ============================================================================
-- Run this migration on your Neon database before starting the application
-- Example: psql $DATABASE_URL -f migrations/001_core_tables.sql
