-- SchemeSaathi Supabase Schema
-- Run this in your Supabase SQL editor to set up the database

-- Create users table with support for all major Indian languages
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  language_preference VARCHAR(3) CHECK (language_preference IN (
    'hi', 'en', 'ta', 'bn', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 
    'or', 'as', 'ur', 'sa', 'ne', 'si', 'my', 'ks', 'sd', 'kok', 
    'mni', 'doi', 'sat', 'bo'
  )),
  eligibility_data JSONB,
  conversation_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on phone for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Create index on language preference
CREATE INDEX IF NOT EXISTS idx_users_language ON users(language_preference);

-- Create GIN index on eligibility_data for faster JSON queries
CREATE INDEX IF NOT EXISTS idx_users_eligibility ON users USING GIN (eligibility_data);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations on users" ON users
    FOR ALL USING (true);

-- Create schemes table for caching government scheme data
CREATE TABLE IF NOT EXISTS schemes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  name_hi VARCHAR(200), -- Hindi name
  name_ta VARCHAR(200), -- Tamil name
  name_bn VARCHAR(200), -- Bengali name
  name_te VARCHAR(200), -- Telugu name
  name_mr VARCHAR(200), -- Marathi name
  name_gu VARCHAR(200), -- Gujarati name
  name_kn VARCHAR(200), -- Kannada name
  name_ml VARCHAR(200), -- Malayalam name
  name_pa VARCHAR(200), -- Punjabi name
  name_or VARCHAR(200), -- Odia name
  name_as VARCHAR(200), -- Assamese name
  name_ur VARCHAR(200), -- Urdu name
  description TEXT,
  description_hi TEXT,
  description_ta TEXT,
  description_bn TEXT,
  description_te TEXT,
  description_mr TEXT,
  description_gu TEXT,
  description_kn TEXT,
  description_ml TEXT,
  description_pa TEXT,
  description_or TEXT,
  description_as TEXT,
  description_ur TEXT,
  eligibility JSONB,
  benefits TEXT,
  benefits_hi TEXT,
  benefits_ta TEXT,
  benefits_bn TEXT,
  benefits_te TEXT,
  benefits_mr TEXT,
  benefits_gu TEXT,
  benefits_kn TEXT,
  benefits_ml TEXT,
  benefits_pa TEXT,
  benefits_or TEXT,
  benefits_as TEXT,
  benefits_ur TEXT,
  application_process TEXT,
  application_process_hi TEXT,
  application_process_ta TEXT,
  application_process_bn TEXT,
  application_process_te TEXT,
  application_process_mr TEXT,
  application_process_gu TEXT,
  application_process_kn TEXT,
  application_process_ml TEXT,
  application_process_pa TEXT,
  application_process_or TEXT,
  application_process_as TEXT,
  application_process_ur TEXT,
  department VARCHAR(200),
  ministry VARCHAR(200),
  state VARCHAR(50),
  category VARCHAR(50),
  target_beneficiary JSONB,
  age_min INTEGER,
  age_max INTEGER,
  income_min BIGINT,
  income_max BIGINT,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other', 'all')),
  social_category JSONB, -- SC, ST, OBC, General, EWS
  disability_support BOOLEAN DEFAULT FALSE,
  website_url VARCHAR(500),
  helpline_number VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for schemes
CREATE INDEX IF NOT EXISTS idx_schemes_state ON schemes(state);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);
CREATE INDEX IF NOT EXISTS idx_schemes_eligibility ON schemes USING GIN (eligibility);
CREATE INDEX IF NOT EXISTS idx_schemes_target ON schemes USING GIN (target_beneficiary);
CREATE INDEX IF NOT EXISTS idx_schemes_social_category ON schemes USING GIN (social_category);
CREATE INDEX IF NOT EXISTS idx_schemes_age ON schemes(age_min, age_max);
CREATE INDEX IF NOT EXISTS idx_schemes_income ON schemes(income_min, income_max);
CREATE INDEX IF NOT EXISTS idx_schemes_active ON schemes(is_active);

-- Create trigger for schemes updated_at
CREATE TRIGGER update_schemes_updated_at 
    BEFORE UPDATE ON schemes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for schemes
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;

-- Create policy for schemes
CREATE POLICY "Allow read access to schemes" ON schemes
    FOR SELECT USING (is_active = true);

-- Create analytics table for tracking scheme recommendations
CREATE TABLE IF NOT EXISTS scheme_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_phone VARCHAR(20) NOT NULL,
  scheme_id VARCHAR(50) NOT NULL,
  eligibility_criteria JSONB,
  recommended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_language VARCHAR(3),
  response_sent BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_phone) REFERENCES users(phone),
  FOREIGN KEY (scheme_id) REFERENCES schemes(id)
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON scheme_recommendations(user_phone);
CREATE INDEX IF NOT EXISTS idx_recommendations_scheme ON scheme_recommendations(scheme_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_date ON scheme_recommendations(recommended_at);
CREATE INDEX IF NOT EXISTS idx_recommendations_language ON scheme_recommendations(user_language);

-- Enable RLS for recommendations
ALTER TABLE scheme_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policy for recommendations
CREATE POLICY "Allow all operations on recommendations" ON scheme_recommendations
    FOR ALL USING (true);

-- Insert comprehensive scheme data with multilingual support
INSERT INTO schemes (
  id, name, name_hi, name_ta, name_bn, description, description_hi, description_ta, description_bn,
  eligibility, benefits, benefits_hi, benefits_ta, benefits_bn,
  application_process, application_process_hi, application_process_ta, application_process_bn,
  department, ministry, category, target_beneficiary, age_min, age_max, income_max,
  gender, social_category, website_url, helpline_number
) VALUES
(
  'pm-kisan',
  'PM-KISAN',
  'पीएम-किसान',
  'பிஎம்-கிசான்',
  'পিএম-কিষাণ',
  'Pradhan Mantri Kisan Samman Nidhi - Direct income support to farmers',
  'प्रधानमंत्री किसान सम्मान निधि - किसानों को प्रत्यक्ष आय सहायता',
  'பிரதம மந்திரி கிசான் சம்மான் நிதி - விவசாயிகளுக்கு நேரடி வருமான ஆதரவு',
  'প্রধানমন্ত্রী কিষাণ সম্মান নিধি - কৃষকদের প্রত্যক্ষ আয় সহায়তা',
  '{"occupation": ["farmer", "agriculture"], "landholding": "up to 2 hectares"}',
  '₹6000 per year in 3 equal installments',
  'वर्ष में ₹6000 तीन समान किस्तों में',
  'ஆண்டுக்கு ₹6000 மூன்று சம பகுதிகளில்',
  'বছরে ₹৬০০০ তিনটি সমান কিস্তিতে',
  'Apply online at pmkisan.gov.in or visit nearest Common Service Center',
  'pmkisan.gov.in पर ऑनलाइन आवेदन करें या निकटतम कॉमन सर्विस सेंटर पर जाएं',
  'pmkisan.gov.in இல் ஆன்லைனில் விண்ணப்பிக்கவும் அல்லது அருகிலுள்ள பொது சேவை மையத்தைப் பார்வையிடவும்',
  'pmkisan.gov.in এ অনলাইনে আবেদন করুন বা নিকটতম কমন সার্ভিস সেন্টারে যান',
  'Department of Agriculture and Cooperation',
  'Ministry of Agriculture and Farmers Welfare',
  'agriculture',
  '["farmers", "landowners"]',
  18, 100, NULL,
  'all',
  '["General", "SC", "ST", "OBC", "EWS"]',
  'https://pmkisan.gov.in',
  '155261'
),
(
  'ayushman-bharat',
  'Ayushman Bharat PM-JAY',
  'आयुष्मान भारत पीएम-जेएवाई',
  'ஆயுஷ்மான் பாரத் பிஎம்-ஜேஏஒய்',
  'আয়ুষ্মান ভারত পিএম-জেএওয়াই',
  'Pradhan Mantri Jan Arogya Yojana - Health insurance for economically vulnerable families',
  'प्रधानमंत्री जन आरोग्य योजना - आर्थिक रूप से कमजोर परिवारों के लिए स्वास्थ्य बीमा',
  'பிரதம மந்திரி ஜன் ஆரோக்ய யோஜனா - பொருளாதார ரீதியாக பாதிக்கப்படக்கூடிய குடும்பங்களுக்கான சுகாதார காப்பீடு',
  'প্রধানমন্ত্রী জন আরোগ্য যোজনা - অর্থনৈতিকভাবে দুর্বল পরিবারের জন্য স্বাস্থ্য বীমা',
  '{"income_max": 500000, "category": ["BPL", "SECC_2011"]}',
  '₹5 lakh per family per year health insurance coverage',
  'प्रति परिवार प्रति वर्ष ₹5 लाख स्वास्थ्य बीमा कवरेज',
  'ஒரு குடும்பத்திற்கு ஆண்டுக்கு ₹5 லட்சம் சுகாதார காப்பீடு',
  'প্রতি পরিবার প্রতি বছর ₹৫ লক্ষ স্বাস্থ্য বীমা কভারেজ',
  'Visit nearest empanelled hospital or Common Service Center with Ayushman card',
  'आयुष्मान कार्ड के साथ निकटतम सूचीबद्ध अस्पताल या कॉमन सर्विस सेंटर पर जाएं',
  'ஆயுஷ்மான் அட்டையுடன் அருகிலுள்ள பட்டியலிடப்பட்ட மருத்துவமனை அல்லது பொது சேவை மையத்தைப் பார்வையிடவும்',
  'আয়ুষ্মান কার্ড সহ নিকটতম তালিকাভুক্ত হাসপাতাল বা কমন সার্ভিস সেন্টারে যান',
  'National Health Authority',
  'Ministry of Health and Family Welfare',
  'health',
  '["BPL_families", "SECC_2011_beneficiaries"]',
  0, 100, 500000,
  'all',
  '["General", "SC", "ST", "OBC", "EWS"]',
  'https://pmjay.gov.in',
  '14555'
)
ON CONFLICT (id) DO NOTHING;

-- Create view for active schemes with language support
CREATE OR REPLACE VIEW active_schemes_view AS
SELECT 
  id,
  name,
  name_hi,
  name_ta,
  name_bn,
  description,
  description_hi,
  description_ta,
  description_bn,
  eligibility,
  benefits,
  benefits_hi,
  benefits_ta,
  benefits_bn,
  application_process,
  application_process_hi,
  application_process_ta,
  application_process_bn,
  department,
  ministry,
  state,
  category,
  target_beneficiary,
  age_min,
  age_max,
  income_min,
  income_max,
  gender,
  social_category,
  website_url,
  helpline_number
FROM schemes 
WHERE is_active = true;

-- Create function to get schemes by eligibility
CREATE OR REPLACE FUNCTION get_matching_schemes(
  p_age INTEGER DEFAULT NULL,
  p_income BIGINT DEFAULT NULL,
  p_state VARCHAR DEFAULT NULL,
  p_gender VARCHAR DEFAULT NULL,
  p_category VARCHAR DEFAULT NULL,
  p_occupation VARCHAR DEFAULT NULL
)
RETURNS TABLE (
  scheme_id VARCHAR,
  scheme_name VARCHAR,
  scheme_description TEXT,
  scheme_benefits TEXT,
  scheme_application TEXT,
  scheme_website VARCHAR,
  scheme_helpline VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.description,
    s.benefits,
    s.application_process,
    s.website_url,
    s.helpline_number
  FROM schemes s
  WHERE s.is_active = true
    AND (p_age IS NULL OR (s.age_min IS NULL OR p_age >= s.age_min))
    AND (p_age IS NULL OR (s.age_max IS NULL OR p_age <= s.age_max))
    AND (p_income IS NULL OR (s.income_max IS NULL OR p_income <= s.income_max))
    AND (p_state IS NULL OR s.state IS NULL OR s.state = p_state OR s.state = 'All India')
    AND (p_gender IS NULL OR s.gender = 'all' OR s.gender = p_gender)
    AND (p_category IS NULL OR s.social_category IS NULL OR s.social_category ? p_category)
    AND (p_occupation IS NULL OR s.eligibility ? 'occupation' OR s.target_beneficiary ? p_occupation);
END;
$$ LANGUAGE plpgsql;