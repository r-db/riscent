-- Migration 002: Cost Tracking and Phone Verification
-- Following Block Theory: Schema First
-- Run after 001_core_tables.sql

-- ============================================================================
-- TABLE 1: verified_users (phone-verified users)
-- ============================================================================

CREATE TABLE verified_users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identity
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,

    -- Verification status
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_verified_at TIMESTAMPTZ,

    -- Clerk OAuth integration
    clerk_user_id VARCHAR(255) UNIQUE,

    -- Consent tracking (required for SMS/calls)
    sms_consent BOOLEAN DEFAULT FALSE,
    call_consent BOOLEAN DEFAULT FALSE,

    -- Link to visitor
    visitor_id UUID REFERENCES visitors(visitor_id),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verified_users_phone ON verified_users(phone_number);
CREATE INDEX idx_verified_users_clerk ON verified_users(clerk_user_id) WHERE clerk_user_id IS NOT NULL;
CREATE INDEX idx_verified_users_visitor ON verified_users(visitor_id) WHERE visitor_id IS NOT NULL;

-- ============================================================================
-- TABLE 2: phone_verifications (OTP codes)
-- ============================================================================

CREATE TABLE phone_verifications (
    verification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Phone and code
    phone_number VARCHAR(20) NOT NULL,
    code VARCHAR(6) NOT NULL,

    -- Status tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'expired', 'failed')),
    attempts INTEGER DEFAULT 0,

    -- Link to visitor for tracking
    visitor_id UUID REFERENCES visitors(visitor_id),

    -- Expiration (10 minutes default)
    expires_at TIMESTAMPTZ NOT NULL,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_phone_verifications_phone ON phone_verifications(phone_number, status);
CREATE INDEX idx_phone_verifications_code ON phone_verifications(phone_number, code) WHERE status = 'pending';

-- ============================================================================
-- TABLE 3: session_verifications (per-session phone verification)
-- ============================================================================

CREATE TABLE session_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Session and user
    session_id UUID NOT NULL REFERENCES visitor_sessions(session_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES verified_users(user_id) ON DELETE CASCADE,

    -- Verification status for this session
    phone_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- One verification per session per user
    UNIQUE(session_id, user_id)
);

CREATE INDEX idx_session_verifications_session ON session_verifications(session_id);
CREATE INDEX idx_session_verifications_user ON session_verifications(user_id);

-- ============================================================================
-- ALTER: Add cost tracking columns to visitors
-- ============================================================================

ALTER TABLE visitors ADD COLUMN IF NOT EXISTS total_tokens_used INTEGER DEFAULT 0;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS total_input_tokens INTEGER DEFAULT 0;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS total_output_tokens INTEGER DEFAULT 0;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS total_cost_cents NUMERIC(10,4) DEFAULT 0;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS cost_gate_reached BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- ALTER: Add token split to seq_messages
-- ============================================================================

ALTER TABLE seq_messages ADD COLUMN IF NOT EXISTS input_tokens INTEGER DEFAULT 0;
ALTER TABLE seq_messages ADD COLUMN IF NOT EXISTS output_tokens INTEGER DEFAULT 0;

-- ============================================================================
-- FUNCTION: update_visitor_cost
-- Updates cost tracking after each message
-- ============================================================================

CREATE OR REPLACE FUNCTION update_visitor_cost(
    p_visitor_id UUID,
    p_input_tokens INTEGER,
    p_output_tokens INTEGER
) RETURNS NUMERIC AS $$
DECLARE
    v_new_cost NUMERIC;
    v_threshold NUMERIC := 10.0;  -- 10 cents = $0.10
BEGIN
    -- Claude Sonnet 4 pricing:
    -- Input: $3/1M tokens = 0.0003 cents/token
    -- Output: $15/1M tokens = 0.0015 cents/token

    UPDATE visitors SET
        total_tokens_used = total_tokens_used + p_input_tokens + p_output_tokens,
        total_input_tokens = total_input_tokens + p_input_tokens,
        total_output_tokens = total_output_tokens + p_output_tokens,
        total_cost_cents = total_cost_cents + (p_input_tokens * 0.0003) + (p_output_tokens * 0.0015),
        updated_at = NOW()
    WHERE visitor_id = p_visitor_id
    RETURNING total_cost_cents INTO v_new_cost;

    -- Mark gate as reached if threshold exceeded
    IF v_new_cost >= v_threshold THEN
        UPDATE visitors SET cost_gate_reached = TRUE WHERE visitor_id = p_visitor_id;
    END IF;

    RETURN v_new_cost;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: check_verification_rate_limit
-- Prevents spam: max 3 pending codes per phone in last 10 minutes
-- ============================================================================

CREATE OR REPLACE FUNCTION check_verification_rate_limit(
    p_phone_number VARCHAR(20)
) RETURNS BOOLEAN AS $$
DECLARE
    v_pending_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_pending_count
    FROM phone_verifications
    WHERE phone_number = p_phone_number
      AND status = 'pending'
      AND created_at > NOW() - INTERVAL '10 minutes';

    RETURN v_pending_count < 3;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER: Update verified_users updated_at
-- ============================================================================

CREATE TRIGGER update_verified_users_updated_at
    BEFORE UPDATE ON verified_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- CLEANUP: Expire old pending verifications
-- Run periodically via cron or Vercel function
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_expired_verifications() RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE phone_verifications
    SET status = 'expired'
    WHERE status = 'pending'
      AND expires_at < NOW();

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- DONE
-- ============================================================================
-- Run this migration on your Neon database after 001_core_tables.sql
-- Example: psql $DATABASE_URL -f migrations/002_cost_tracking_and_verification.sql
