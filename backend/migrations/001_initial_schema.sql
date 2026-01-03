-- FestWish Database Schema
-- Initial Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- RELATIONSHIPS TABLE (Database-driven, not hardcoded)
-- =====================================================
CREATE TABLE relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- family, friends, professional, romantic, other
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 20+ relationships
INSERT INTO relationships (name, display_name, category, sort_order) VALUES
('father', 'Father', 'family', 1),
('mother', 'Mother', 'family', 2),
('brother', 'Brother', 'family', 3),
('sister', 'Sister', 'family', 4),
('son', 'Son', 'family', 5),
('daughter', 'Daughter', 'family', 6),
('husband', 'Husband', 'romantic', 7),
('wife', 'Wife', 'romantic', 8),
('partner', 'Partner', 'romantic', 9),
('girlfriend', 'Girlfriend', 'romantic', 10),
('boyfriend', 'Boyfriend', 'romantic', 11),
('friend', 'Friend', 'friends', 12),
('best_friend', 'Best Friend', 'friends', 13),
('colleague', 'Colleague', 'professional', 14),
('manager', 'Manager', 'professional', 15),
('team_member', 'Team Member', 'professional', 16),
('teacher', 'Teacher', 'professional', 17),
('student', 'Student', 'professional', 18),
('client', 'Client', 'professional', 19),
('customer', 'Customer', 'professional', 20),
('neighbor', 'Neighbor', 'other', 21),
('mentor', 'Mentor', 'professional', 22),
('relative', 'Relative', 'family', 23),
('grandparent', 'Grandparent', 'family', 24),
('grandchild', 'Grandchild', 'family', 25),
('uncle', 'Uncle', 'family', 26),
('aunt', 'Aunt', 'family', 27),
('cousin', 'Cousin', 'family', 28),
('in_law', 'In-Law', 'family', 29);

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    supabase_auth_id UUID UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_supabase_auth ON users(supabase_auth_id);

-- =====================================================
-- FESTIVALS TABLE
-- =====================================================
CREATE TABLE festivals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    religion_culture VARCHAR(100),
    typical_month VARCHAR(20),
    description TEXT,
    story_history TEXT,
    cultural_significance TEXT,
    traditions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_festivals_slug ON festivals(slug);
CREATE INDEX idx_festivals_month ON festivals(typical_month);
CREATE INDEX idx_festivals_culture ON festivals(religion_culture);

-- =====================================================
-- FESTIVAL QUOTES TABLE (Multiple per festival)
-- =====================================================
CREATE TABLE festival_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    quote_text TEXT NOT NULL,
    author VARCHAR(255),
    source VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_festival_quotes_festival ON festival_quotes(festival_id);

-- =====================================================
-- FESTIVAL IMAGES TABLE (20+ per festival)
-- =====================================================
CREATE TABLE festival_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    alt_text VARCHAR(255),
    is_card_template BOOLEAN DEFAULT FALSE,
    width INTEGER,
    height INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_festival_images_festival ON festival_images(festival_id);

-- =====================================================
-- WISH MESSAGES TABLE (50+ per festival-relationship combo)
-- =====================================================
CREATE TABLE wish_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    relationship_id UUID NOT NULL REFERENCES relationships(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    tone VARCHAR(50), -- formal, casual, warm, funny, spiritual
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wish_messages_festival ON wish_messages(festival_id);
CREATE INDEX idx_wish_messages_relationship ON wish_messages(relationship_id);
CREATE INDEX idx_wish_messages_combo ON wish_messages(festival_id, relationship_id);

-- =====================================================
-- USER UPLOADED IMAGES TABLE
-- =====================================================
CREATE TABLE user_uploaded_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    original_filename VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_images_user ON user_uploaded_images(user_id);

-- =====================================================
-- GENERATED WISHES TABLE
-- =====================================================
CREATE TABLE generated_wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    relationship_id UUID NOT NULL REFERENCES relationships(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255),
    message_id UUID REFERENCES wish_messages(id),
    custom_message TEXT,
    final_message TEXT NOT NULL,
    image_id UUID REFERENCES festival_images(id),
    user_image_id UUID REFERENCES user_uploaded_images(id),
    generated_card_url TEXT,
    quote_id UUID REFERENCES festival_quotes(id),
    channel_type VARCHAR(20), -- whatsapp, sms, email, download
    sent_status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_generated_wishes_user ON generated_wishes(user_id);
CREATE INDEX idx_generated_wishes_festival ON generated_wishes(festival_id);

-- =====================================================
-- AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- =====================================================
-- MESSAGE CHANNELS TABLE (For future integrations)
-- =====================================================
CREATE TABLE message_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE, -- whatsapp, sms, email
    display_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO message_channels (name, display_name, is_enabled) VALUES
('whatsapp', 'WhatsApp', FALSE),
('sms', 'SMS', FALSE),
('email', 'Email', FALSE),
('download', 'Download Only', TRUE);

-- =====================================================
-- FUNCTIONS FOR RANDOM SELECTION
-- =====================================================

-- Function to get random message for festival-relationship
CREATE OR REPLACE FUNCTION get_random_message(
    p_festival_id UUID,
    p_relationship_id UUID
) RETURNS TABLE (
    id UUID,
    message_text TEXT,
    tone VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT wm.id, wm.message_text, wm.tone
    FROM wish_messages wm
    WHERE wm.festival_id = p_festival_id
      AND wm.relationship_id = p_relationship_id
      AND wm.is_active = TRUE
    ORDER BY RANDOM()
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to get random quote for festival
CREATE OR REPLACE FUNCTION get_random_quote(
    p_festival_id UUID
) RETURNS TABLE (
    id UUID,
    quote_text TEXT,
    author VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT fq.id, fq.quote_text, fq.author
    FROM festival_quotes fq
    WHERE fq.festival_id = p_festival_id
      AND fq.is_active = TRUE
    ORDER BY RANDOM()
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to get random image for festival
CREATE OR REPLACE FUNCTION get_random_festival_image(
    p_festival_id UUID
) RETURNS TABLE (
    id UUID,
    image_url TEXT,
    alt_text VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT fi.id, fi.image_url, fi.alt_text
    FROM festival_images fi
    WHERE fi.festival_id = p_festival_id
      AND fi.is_active = TRUE
    ORDER BY RANDOM()
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_festivals_updated_at
    BEFORE UPDATE ON festivals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relationships_updated_at
    BEFORE UPDATE ON relationships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_channels_updated_at
    BEFORE UPDATE ON message_channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
