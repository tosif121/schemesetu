-- SchemeSaathi Database Schema
-- Complete schema for both Next.js app and Telegram bot

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for both WhatsApp and Telegram users
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- WhatsApp fields
    phone_number VARCHAR(20) UNIQUE,
    whatsapp_name VARCHAR(255),
    
    -- Telegram fields  
    telegram_id VARCHAR(50) UNIQUE,
    first_name VARCHAR(255),
    username VARCHAR(255),
    
    -- Common fields
    language_preference VARCHAR(10) DEFAULT 'en',
    eligibility_data JSONB DEFAULT '{}',
    conversation_history JSONB DEFAULT '[]',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT users_platform_check CHECK (
        (phone_number IS NOT NULL AND whatsapp_name IS NOT NULL) OR 
        (telegram_id IS NOT NULL AND first_name IS NOT NULL)
    )
);

-- Government schemes table
CREATE TABLE IF NOT EXISTS schemes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    scheme_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    benefits TEXT,
    eligibility_criteria JSONB DEFAULT '{}',
    application_url VARCHAR(1000),
    department VARCHAR(255),
    state VARCHAR(100),
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User interactions/conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL, -- 'whatsapp' or 'telegram'
    message_type VARCHAR(50) NOT NULL, -- 'user_message', 'bot_response', 'scheme_query', etc.
    content TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User scheme interactions (applications, interests, etc.)
CREATE TABLE IF NOT EXISTS user_schemes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scheme_uuid UUID REFERENCES schemes(id) ON DELETE CASCADE,
    scheme_id VARCHAR(100), -- This will store the scheme_id from schemes table for easier lookup
    interaction_type VARCHAR(50) NOT NULL, -- 'interested', 'applied', 'eligible', 'not_eligible'
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate interactions
    UNIQUE(user_id, scheme_uuid, interaction_type)
);

-- Analytics table for tracking bot usage
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- 'message_sent', 'scheme_searched', 'language_changed', etc.
    event_data JSONB DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_language_preference ON users(language_preference);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active);

CREATE INDEX IF NOT EXISTS idx_schemes_scheme_id ON schemes(scheme_id);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);
CREATE INDEX IF NOT EXISTS idx_schemes_state ON schemes(state);
CREATE INDEX IF NOT EXISTS idx_schemes_status ON schemes(status);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_platform ON conversations(platform);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);

CREATE INDEX IF NOT EXISTS idx_user_schemes_user_id ON user_schemes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_schemes_scheme_uuid ON user_schemes(scheme_uuid);
CREATE INDEX IF NOT EXISTS idx_user_schemes_scheme_id ON user_schemes(scheme_id);
CREATE INDEX IF NOT EXISTS idx_user_schemes_interaction_type ON user_schemes(interaction_type);

CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_platform ON analytics(platform);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schemes_updated_at BEFORE UPDATE ON schemes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_schemes_updated_at BEFORE UPDATE ON user_schemes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample schemes data
INSERT INTO schemes (scheme_id, name, description, benefits, eligibility_criteria, application_url, department, category) VALUES
('pm-kisan', 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)', 'Direct income support to farmers', '₹6,000 per year in 3 installments of ₹2,000 each', '{"occupation": ["farmer"], "landOwnership": true, "income_max": null}', 'https://pmkisan.gov.in/', 'Ministry of Agriculture', 'agriculture'),

('ayushman-bharat', 'Ayushman Bharat PM-JAY', 'Health insurance for economically vulnerable families', '₹5 lakh per family per year health coverage', '{"income_max": 500000, "category": ["BPL", "SECC"], "family_size_max": null}', 'https://pmjay.gov.in/', 'Ministry of Health', 'health'),

('mudra-loan', 'Pradhan Mantri MUDRA Yojana', 'Micro finance for small businesses and entrepreneurs', 'Loans up to ₹10 lakh without collateral', '{"occupation": ["business", "entrepreneur", "self-employed"], "age_min": 18, "age_max": 65}', 'https://mudra.org.in/', 'Ministry of Finance', 'business'),

('beti-bachao', 'Beti Bachao Beti Padhao', 'Girl child education and empowerment scheme', 'Financial support for girl child education and safety', '{"gender": "female", "age_max": 18}', 'https://wcd.nic.in/bbbp-scheme', 'Ministry of Women and Child Development', 'women'),

('national-scholarship', 'National Scholarship Portal', 'Financial assistance for students from various backgrounds', 'Scholarships up to ₹2 lakh per year', '{"occupation": ["student"], "age_min": 16, "age_max": 25, "income_max": 800000}', 'https://scholarships.gov.in/', 'Ministry of Education', 'education'),

('pmay-urban', 'Pradhan Mantri Awas Yojana (Urban)', 'Housing for all in urban areas', 'Interest subsidy and financial assistance for home purchase', '{"income_max": 1800000, "location_type": "urban", "house_ownership": false}', 'https://pmaymis.gov.in/', 'Ministry of Housing', 'housing'),

('pmay-rural', 'Pradhan Mantri Awas Yojana (Rural)', 'Housing for all in rural areas', 'Financial assistance up to ₹1.2 lakh for house construction', '{"income_max": 200000, "location_type": "rural", "house_ownership": false}', 'https://pmayg.nic.in/', 'Ministry of Rural Development', 'housing'),

('jan-aushadhi', 'Pradhan Mantri Bhartiya Janaushadhi Pariyojana', 'Affordable generic medicines', 'Generic medicines at 50-90% lower prices', '{"age_min": 0, "income_max": null}', 'https://janaushadhi.gov.in/', 'Ministry of Chemicals and Fertilizers', 'health'),

('skill-india', 'Pradhan Mantri Kaushal Vikas Yojana', 'Skill development and training programs', 'Free skill training and certification', '{"age_min": 15, "age_max": 45, "education_max": "12th"}', 'https://pmkvyofficial.org/', 'Ministry of Skill Development', 'skill'),

('ujjwala', 'Pradhan Mantri Ujjwala Yojana', 'Free LPG connections to women from BPL families', 'Free LPG connection and financial assistance', '{"gender": "female", "category": ["BPL"], "age_min": 18}', 'https://pmuy.gov.in/', 'Ministry of Petroleum', 'energy'),

('fasal-bima', 'Pradhan Mantri Fasal Bima Yojana', 'Crop insurance for farmers', 'Insurance coverage for crop losses', '{"occupation": ["farmer"], "landOwnership": true}', 'https://pmfby.gov.in/', 'Ministry of Agriculture', 'agriculture'),

('startup-india', 'Startup India', 'Support for startups and entrepreneurs', 'Tax benefits, funding support, and mentorship', '{"occupation": ["entrepreneur", "startup"], "age_min": 18, "business_age_max": 10}', 'https://startupindia.gov.in/', 'Department of Industrial Policy', 'business'),

('digital-india', 'Digital India', 'Digital literacy and infrastructure development', 'Digital services and skill development', '{"age_min": 14, "age_max": 60}', 'https://digitalindia.gov.in/', 'Ministry of Electronics and IT', 'digital'),

('swachh-bharat', 'Swachh Bharat Mission', 'Sanitation and cleanliness initiative', 'Financial assistance for toilet construction', '{"location_type": "rural", "toilet_access": false}', 'https://swachhbharatmission.gov.in/', 'Ministry of Jal Shakti', 'sanitation'),

('make-in-india', 'Make in India', 'Manufacturing and investment promotion', 'Investment facilitation and manufacturing support', '{"occupation": ["business", "manufacturer"], "investment_min": 100000}', 'https://makeinindia.gov.in/', 'Department of Industrial Policy', 'manufacturing')

ON CONFLICT (scheme_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    benefits = EXCLUDED.benefits,
    eligibility_criteria = EXCLUDED.eligibility_criteria,
    application_url = EXCLUDED.application_url,
    department = EXCLUDED.department,
    category = EXCLUDED.category,
    updated_at = NOW();

-- Create RLS (Row Level Security) policies if needed
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_schemes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Create a view for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN phone_number IS NOT NULL THEN 1 END) as whatsapp_users,
    COUNT(CASE WHEN telegram_id IS NOT NULL THEN 1 END) as telegram_users,
    COUNT(CASE WHEN language_preference != 'en' THEN 1 END) as non_english_users,
    COUNT(CASE WHEN last_active >= NOW() - INTERVAL '7 days' THEN 1 END) as active_weekly,
    COUNT(CASE WHEN last_active >= NOW() - INTERVAL '30 days' THEN 1 END) as active_monthly
FROM users;

-- Create a view for scheme statistics
CREATE OR REPLACE VIEW scheme_stats AS
SELECT 
    s.scheme_id,
    s.name,
    s.category,
    COUNT(us.id) as total_interactions,
    COUNT(CASE WHEN us.interaction_type = 'interested' THEN 1 END) as interested_users,
    COUNT(CASE WHEN us.interaction_type = 'applied' THEN 1 END) as applied_users,
    COUNT(CASE WHEN us.interaction_type = 'eligible' THEN 1 END) as eligible_users
FROM schemes s
LEFT JOIN user_schemes us ON s.id = us.scheme_uuid
GROUP BY s.id, s.scheme_id, s.name, s.category
ORDER BY total_interactions DESC;

-- Success message
SELECT 'Database schema created successfully! 🎉' as status;