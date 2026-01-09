-- SchemeSaathi Complete Database Schema
-- Run this in your Supabase SQL editor to set up the complete database with Telegram support

-- Drop existing tables if they exist (optional - remove these lines if you want to keep existing data)
-- DROP TABLE IF EXISTS scheme_recommendations CASCADE;
-- DROP TABLE IF EXISTS schemes CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Create users table with support for both WhatsApp and Telegram
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) UNIQUE,
  telegram_id VARCHAR(50) UNIQUE,
  first_name VARCHAR(100),
  language_preference VARCHAR(3) CHECK (language_preference IN (
    'hi', 'en', 'ta', 'bn', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 
    'or', 'as', 'ur', 'sa', 'ne', 'si', 'my', 'ks', 'sd', 'kok', 
    'mni', 'doi', 'sat', 'bo', 'mai'
  )),
  eligibility_data JSONB,
  conversation_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT users_identifier_check CHECK (phone IS NOT NULL OR telegram_id IS NOT NULL)
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_language ON users(language_preference);
CREATE INDEX IF NOT EXISTS idx_users_eligibility ON users USING GIN (eligibility_data);

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
  name_ks VARCHAR(200), -- Kashmiri name
  name_mai VARCHAR(200), -- Maithili name
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
  description_ks TEXT,
  description_mai TEXT,
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
  benefits_ks TEXT,
  benefits_mai TEXT,
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
  application_process_ks TEXT,
  application_process_mai TEXT,
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

-- Create analytics table for tracking scheme recommendations (supports both platforms)
CREATE TABLE IF NOT EXISTS scheme_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_phone VARCHAR(20),
  user_telegram_id VARCHAR(50),
  scheme_id VARCHAR(50) NOT NULL,
  eligibility_criteria JSONB,
  recommended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_language VARCHAR(3),
  platform VARCHAR(10) CHECK (platform IN ('whatsapp', 'telegram')),
  response_sent BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (scheme_id) REFERENCES schemes(id),
  CONSTRAINT recommendations_user_check CHECK (user_phone IS NOT NULL OR user_telegram_id IS NOT NULL)
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_recommendations_user_phone ON scheme_recommendations(user_phone);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_telegram ON scheme_recommendations(user_telegram_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_scheme ON scheme_recommendations(scheme_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_date ON scheme_recommendations(recommended_at);
CREATE INDEX IF NOT EXISTS idx_recommendations_language ON scheme_recommendations(user_language);
CREATE INDEX IF NOT EXISTS idx_recommendations_platform ON scheme_recommendations(platform);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schemes_updated_at 
    BEFORE UPDATE ON schemes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheme_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Allow all operations on users" ON users
    FOR ALL USING (true);

-- Create policies for schemes table
CREATE POLICY "Allow read access to schemes" ON schemes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow all operations on schemes for authenticated users" ON schemes
    FOR ALL USING (true);

-- Create policies for recommendations table
CREATE POLICY "Allow all operations on recommendations" ON scheme_recommendations
    FOR ALL USING (true);

-- Insert sample scheme data with multilingual support
INSERT INTO schemes (
  id, name, name_hi, name_ta, name_bn, name_te, name_mr, name_gu, name_kn, name_ml, name_pa, name_or, name_as, name_ur, name_ks, name_mai,
  description, description_hi, description_ta, description_bn, description_te, description_mr, description_gu, description_kn, description_ml, description_pa, description_or, description_as, description_ur, description_ks, description_mai,
  eligibility, benefits, benefits_hi, benefits_ta, benefits_bn, benefits_te, benefits_mr, benefits_gu, benefits_kn, benefits_ml, benefits_pa, benefits_or, benefits_as, benefits_ur, benefits_ks, benefits_mai,
  application_process, application_process_hi, application_process_ta, application_process_bn, application_process_te, application_process_mr, application_process_gu, application_process_kn, application_process_ml, application_process_pa, application_process_or, application_process_as, application_process_ur, application_process_ks, application_process_mai,
  department, ministry, category, target_beneficiary, age_min, age_max, income_max,
  gender, social_category, website_url, helpline_number
) VALUES
(
  'pm-kisan',
  'PM-KISAN',
  'पीएम-किसान',
  'பிஎம்-கிசான்',
  'পিএম-কিষাণ',
  'పిఎం-కిసాన్',
  'पीएम-किसान',
  'પીએમ-કિસાન',
  'ಪಿಎಂ-ಕಿಸಾನ್',
  'പിഎം-കിസാൻ',
  'ਪੀਐਮ-ਕਿਸਾਨ',
  'ପିଏମ-କିଷାଣ',
  'পিএম-কিষাণ',
  'پی ایم کسان',
  'پی ایم کسان',
  'पीएम-किसान',
  'Pradhan Mantri Kisan Samman Nidhi - Direct income support to farmers',
  'प्रधानमंत्री किसान सम्मान निधि - किसानों को प्रत्यक्ष आय सहायता',
  'பிரதம மந்திரி கிசான் சம்மான் நிதி - விவசாயிகளுக்கு நேரடி வருமான ஆதரவு',
  'প্রধানমন্ত্রী কিষাণ সম্মান নিধি - কৃষকদের প্রত্যক্ষ আয় সহায়তা',
  'ప్రధాన మంత్రి కిసాన్ సమ్మాన్ నిధి - రైతులకు ప్రత్యక్ష ఆదాయ మద్దతు',
  'प्रधानमंत्री किसान सम्मान निधि - शेतकऱ्यांना थेट उत्पन्न सहाय्य',
  'પ્રધાનમંત્રી કિસાન સમ્માન નિધિ - ખેડૂતોને પ્રત્યક્ષ આવક સહાય',
  'ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ - ರೈತರಿಗೆ ನೇರ ಆದಾಯ ಬೆಂಬಲ',
  'പ്രധാനമന്ത്രി കിസാൻ സമ്മാൻ നിധി - കർഷകർക്കുള്ള നേരിട്ടുള്ള വരുമാന പിന്തുണ',
  'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਕਿਸਾਨ ਸਮ੍ਮਾਨ ਨਿਧੀ - ਕਿਸਾਨਾਂ ਨੂੰ ਸਿੱਧੀ ਆਮਦਨ ਸਹਾਇਤਾ',
  'ପ୍ରଧାନମନ୍ତ୍ରୀ କିଷାଣ ସମ୍ମାନ ନିଧି - କୃଷକମାନଙ୍କୁ ପ୍ରତ୍ୟକ୍ଷ ଆୟ ସହାୟତା',
  'প্ৰধানমন্ত্ৰী কিষাণ সম্মান নিধি - কৃষকসকলক প্ৰত্যক্ষ আয় সহায়তা',
  'وزیر اعظم کسان سمان نیدھی - کسانوں کو براہ راست آمدنی کی مدد',
  'وزیر اعظم کسان سمان نیدھی - کسانن کو براہ راست آمدنی کی مدد',
  'प्रधानमंत्री किसान सम्मान निधि - किसानक प्रत्यक्ष आय सहायता',
  '{"occupation": ["farmer", "agriculture"], "landholding": "up to 2 hectares"}',
  '₹6000 per year in 3 equal installments',
  'वर्ष में ₹6000 तीन समान किस्तों में',
  'ஆண்டுக்கு ₹6000 மூன்று சம பகுதிகளில்',
  'বছরে ₹৬০০০ তিনটি সমান কিস্তিতে',
  'సంవత్సరానికి ₹6000 మూడు సమాన వాయిదాలలో',
  'वर्षात ₹6000 तीन समान हप्त्यांमध्ये',
  'વર્ષમાં ₹6000 ત્રણ સમાન હપ્તામાં',
  'ವರ್ಷಕ್ಕೆ ₹6000 ಮೂರು ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ',
  'വർഷത്തിൽ ₹6000 മൂന്ന് തുല്യ ഗഡുക്കളായി',
  'ਸਾਲ ਵਿੱਚ ₹6000 ਤਿੰਨ ਬਰਾਬਰ ਕਿਸ਼ਤਾਂ ਵਿੱਚ',
  'ବର୍ଷରେ ₹6000 ତିନୋଟି ସମାନ କିସ୍ତିରେ',
  'বছৰত ₹6000 তিনিটা সমান কিস্তিত',
  'سال میں ₹6000 تین برابر قسطوں میں',
  'ورس منز ₹6000 ترے برابر قسطن منز',
  'वर्षमे ₹6000 तीन समान किस्तमे',
  'Apply online at pmkisan.gov.in or visit nearest Common Service Center',
  'pmkisan.gov.in पर ऑनलाइन आवेदन करें या निकटतम कॉमन सर्विस सेंटर पर जाएं',
  'pmkisan.gov.in இல் ஆன்லைனில் விண்ணப்பிக்கவும் அல்லது அருகிலுள்ள பொது சேவை மையத்தைப் பார்வையிடவும்',
  'pmkisan.gov.in এ অনলাইনে আবেদন করুন বা নিকটতম কমন সার্ভিস সেন্টারে যান',
  'pmkisan.gov.in లో ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోండి లేదా సమీప కామన్ సర్వీస్ సెంటర్‌ను సందర్శించండి',
  'pmkisan.gov.in वर ऑनलाइन अर्ज करा किंवा जवळच्या कॉमन सर्व्हिस सेंटरला भेट द्या',
  'pmkisan.gov.in પર ઓનલાઇન અરજી કરો અથવા નજીકના કોમન સર્વિસ સેન્ટરની મુલાકાત લો',
  'pmkisan.gov.in ನಲ್ಲಿ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಅಥವಾ ಹತ್ತಿರದ ಕಾಮನ್ ಸರ್ವಿಸ್ ಸೆಂಟರ್‌ಗೆ ಭೇಟಿ ನೀಡಿ',
  'pmkisan.gov.in ൽ ഓൺലൈനായി അപേക്ഷിക്കുക അല്ലെങ്കിൽ അടുത്തുള്ള കോമൺ സർവീസ് സെന്റർ സന്ദർശിക്കുക',
  'pmkisan.gov.in ਤੇ ਔਨਲਾਈਨ ਅਰਜ਼ੀ ਦਿਓ ਜਾਂ ਨਜ਼ਦੀਕੀ ਕਾਮਨ ਸਰਵਿਸ ਸੈਂਟਰ ਜਾਓ',
  'pmkisan.gov.in ରେ ଅନଲାଇନ୍ ଆବେଦନ କରନ୍ତୁ କିମ୍ବା ନିକଟସ୍ଥ କମନ୍ ସର୍ଭିସ୍ ସେଣ୍ଟର ପରିଦର୍ଶନ କରନ୍ତୁ',
  'pmkisan.gov.in ত অনলাইনত আবেদন কৰক বা ওচৰৰ কমন সেৱা কেন্দ্ৰ দৰ্শন কৰক',
  'pmkisan.gov.in پر آن لائن درخواست دیں یا قریبی کامن سروس سینٹر جائیں',
  'pmkisan.gov.in پیٹھ آن لائن درخواست دِیو یا قریبی کامن سروس سینٹر گژھیو',
  'pmkisan.gov.in पर ऑनलाइन आवेदन करू या निकटतम कॉमन सर्विस सेंटर जाऊ',
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
  'ఆయుష్మాన్ భారత్ పిఎం-జేఏవై',
  'आयुष्मान भारत पीएम-जेएवाई',
  'આયુષ્માન ભારત પીએમ-જેએવાય',
  'ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಪಿಎಂ-ಜೆಎವೈ',
  'ആയുഷ്മാൻ ഭാരത് പിഎം-ജെഎവൈ',
  'ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ ਪੀਐਮ-ਜੇਏਵਾਈ',
  'ଆୟୁଷ୍ମାନ ଭାରତ ପିଏମ-ଜେଏୱାଇ',
  'আয়ুষ্মান ভাৰত পিএম-জেএৱাই',
  'آیوشمان بھارت پی ایم جے اے وائی',
  'آیوشمان بھارت پی ایم جے اے وائی',
  'आयुष्मान भारत पीएम-जेएवाई',
  'Pradhan Mantri Jan Arogya Yojana - Health insurance for economically vulnerable families',
  'प्रधानमंत्री जन आरोग्य योजना - आर्थिक रूप से कमजोर परिवारों के लिए स्वास्थ्य बीमा',
  'பிரதம மந்திரி ஜன் ஆரோக்ய யோஜனா - பொருளாதார ரீதியாக பாதிக்கப்படக்கூடிய குடும்பங்களுக்கான சுகாதார காப்பீடு',
  'প্রধানমন্ত্রী জন আরোগ্য যোজনা - অর্থনৈতিকভাবে দুর্বল পরিবারের জন্য স্বাস্থ্য বীমা',
  'ప్రధాన మంత్రి జన్ ఆరోగ్య యోజన - ఆర్థికంగా బలహీన కుటుంబాలకు ఆరోగ్య బీమా',
  'प्रधानमंत्री जन आरोग्य योजना - आर्थिकदृष्ट्या कमकुवत कुटुंबांसाठी आरोग्य विमा',
  'પ્રધાનમંત્રી જન આરોગ્ય યોજના - આર્થિક રીતે નબળા પરિવારો માટે આરોગ્ય વીમો',
  'ಪ್ರಧಾನ ಮಂತ್ರಿ ಜನ್ ಆರೋಗ್ಯ ಯೋಜನೆ - ಆರ್ಥಿಕವಾಗಿ ದುರ್ಬಲ ಕುಟುಂಬಗಳಿಗೆ ಆರೋಗ್ಯ ವಿಮೆ',
  'പ്രധാനമന്ത്രി ജൻ ആരോഗ്യ യോജന - സാമ്പത്തികമായി ദുർബലരായ കുടുംബങ്ങൾക്കുള്ള ആരോഗ്യ ഇൻഷുറൻസ്',
  'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਜਨ ਆਰੋਗਿਆ ਯੋਜਨਾ - ਆਰਥਿਕ ਤੌਰ ਤੇ ਕਮਜ਼ੋਰ ਪਰਿਵਾਰਾਂ ਲਈ ਸਿਹਤ ਬੀਮਾ',
  'ପ୍ରଧାନମନ୍ତ୍ରୀ ଜନ ଆରୋଗ୍ୟ ଯୋଜନା - ଆର୍ଥିକ ଦୃଷ୍ଟିରୁ ଦୁର୍ବଳ ପରିବାର ପାଇଁ ସ୍ୱାସ୍ଥ୍ୟ ବୀମା',
  'প্ৰধানমন্ত্ৰী জন আৰোগ্য যোজনা - অৰ্থনৈতিকভাৱে দুৰ্বল পৰিয়ালৰ বাবে স্বাস্থ্য বীমা',
  'وزیر اعظم جن آروگیہ یوجنا - معاشی طور پر کمزور خاندانوں کے لیے صحت کا بیمہ',
  'وزیر اعظم جن آروگیہ یوجنا - معاشی طور پر کمزور خاندانن کے لیے صحت کا بیمہ',
  'प्रधानमंत्री जन आरोग्य योजना - आर्थिक रूपसँ कमजोर परिवारक लेल स्वास्थ्य बीमा',
  '{"income_max": 500000, "category": ["BPL", "SECC_2011"]}',
  '₹5 lakh per family per year health insurance coverage',
  'प्रति परिवार प्रति वर्ष ₹5 लाख स्वास्थ्य बीमा कवरेज',
  'ஒரு குடும்பத்திற்கு ஆண்டுக்கு ₹5 லட்சம் சுகாதார காப்பீடு',
  'প্রতি পরিবার প্রতি বছর ₹৫ লক্ষ স্বাস্থ্য বীমা কভারেজ',
  'ప్రతి కుటుంబానికి సంవత్సరానికి ₹5 లక్షల ఆరోగ్య బీమా కవరేజీ',
  'प्रति कुटुंब दरवर्षी ₹5 लाख आरोग्य विमा कव्हरेज',
  'પ્રતિ પરિવાર દર વર્ષે ₹5 લાખ આરોગ્ય વીમા કવરેજ',
  'ಪ್ರತಿ ಕುಟುಂಬಕ್ಕೆ ವರ್ಷಕ್ಕೆ ₹5 ಲಕ್ಷ ಆರೋಗ್ಯ ವಿಮಾ ರಕ್ಷಣೆ',
  'ഓരോ കുടുംബത്തിനും വർഷത്തിൽ ₹5 ലക്ഷം ആരോഗ്യ ഇൻഷുറൻസ് കവറേജ്',
  'ਹਰ ਪਰਿਵਾਰ ਨੂੰ ਸਾਲਾਨਾ ₹5 ਲੱਖ ਸਿਹਤ ਬੀਮਾ ਕਵਰੇਜ',
  'ପ୍ରତି ପରିବାର ପ୍ରତି ବର୍ଷ ₹5 ଲକ୍ଷ ସ୍ୱାସ୍ଥ୍ୟ ବୀମା କଭରେଜ୍',
  'প্ৰতি পৰিয়াল প্ৰতি বছৰ ₹5 লাখ স্বাস্থ্য বীমা কভাৰেজ',
  'ہر خاندان کو سالانہ ₹5 لاکھ صحت کا بیمہ کوریج',
  'ہر خاندان کو سالانہ ₹5 لاکھ صحت کا بیمہ کوریج',
  'प्रति परिवार प्रति वर्ष ₹5 लाख स्वास्थ्य बीमा कवरेज',
  'Visit nearest empanelled hospital or Common Service Center with Ayushman card',
  'आयुष्मान कार्ड के साथ निकटतम सूचीबद्ध अस्पताल या कॉमन सर्विस सेंटर पर जाएं',
  'ஆயுஷ்மான் அட்டையுடன் அருகிலுள்ள பட்டியலிடப்பட்ட மருத்துவமனை அல்லது பொது சேவை மையத்தைப் பார்வையிடவும்',
  'আয়ুষ্মান কার্ড সহ নিকটতম তালিকাভুক্ত হাসপাতাল বা কমন সার্ভিস সেন্টারে যান',
  'ఆయుష్మాన్ కార్డుతో సమీప ఎంపానల్డ్ హాస్పిటల్ లేదా కామన్ సర్వీస్ సెంటర్‌ను సందర్శించండి',
  'आयुष्मान कार्डसह जवळच्या सूचीबद्ध रुग्णालयात किंवा कॉमन सर्व्हिस सेंटरला भेट द्या',
  'આયુષ્માન કાર્ડ સાથે નજીકની સૂચિબદ્ધ હોસ્પિટલ અથવા કોમન સર્વિસ સેન્ટરની મુલાકાત લો',
  'ಆಯುಷ್ಮಾನ್ ಕಾರ್ಡ್‌ನೊಂದಿಗೆ ಹತ್ತಿರದ ಎಂಪ್ಯಾನೆಲ್ಡ್ ಆಸ್ಪತ್ರೆ ಅಥವಾ ಕಾಮನ್ ಸರ್ವಿಸ್ ಸೆಂಟರ್‌ಗೆ ಭೇಟಿ ನೀಡಿ',
  'ആയുഷ്മാൻ കാർഡുമായി അടുത്തുള്ള എംപാനൽഡ് ആശുപത്രി അല്ലെങ്കിൽ കോമൺ സർവീസ് സെന്റർ സന്ദർശിക്കുക',
  'ਆਯੁਸ਼ਮਾਨ ਕਾਰਡ ਨਾਲ ਨਜ਼ਦੀਕੀ ਸੂਚੀਬੱਧ ਹਸਪਤਾਲ ਜਾਂ ਕਾਮਨ ਸਰਵਿਸ ਸੈਂਟਰ ਜਾਓ',
  'ଆୟୁଷ୍ମାନ କାର୍ଡ ସହିତ ନିକଟସ୍ଥ ତାଲିକାଭୁକ୍ତ ଡାକ୍ତରଖାନା କିମ୍ବା କମନ୍ ସର୍ଭିସ୍ ସେଣ୍ଟର ପରିଦର୍ଶନ କରନ୍ତୁ',
  'আয়ুষ্মান কাৰ্ডৰ সৈতে ওচৰৰ তালিকাভুক্ত চিকিৎসালয় বা কমন সেৱা কেন্দ্ৰ দৰ্শন কৰক',
  'آیوشمان کارڈ کے ساتھ قریبی فہرست میں شامل ہسپتال یا کامن سروس سینٹر جائیں',
  'آیوشمان کارڈ کے ساتھ قریبی فہرست میں شامل ہسپتال یا کامن سروس سینٹر گژھیو',
  'आयुष्मान कार्डक संग निकटतम सूचीबद्ध अस्पताल या कॉमन सर्विस सेंटर जाऊ',
  'National Health Authority',
  'Ministry of Health and Family Welfare',
  'health',
  '["BPL_families", "SECC_2011_beneficiaries"]',
  0, 100, 500000,
  'all',
  '["General", "SC", "ST", "OBC", "EWS"]',
  'https://pmjay.gov.in',
  '14555'
),
(
  'mudra-loan',
  'Pradhan Mantri MUDRA Yojana',
  'प्रधानमंत्री मुद्रा योजना',
  'பிரதம மந்திரி முத்ரா யோஜனா',
  'প্রধানমন্ত্রী মুদ্রা যোজনা',
  'ప్రధాన మంత్రి ముద్రా యోజన',
  'प्रधानमंत्री मुद्रा योजना',
  'પ્રધાનમંત્રી મુદ્રા યોજના',
  'ಪ್ರಧಾನ ಮಂತ್ರಿ ಮುದ್ರಾ ಯೋಜನೆ',
  'പ്രധാനമന്ത്രി മുദ്രാ യോജന',
  'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਮੁਦਰਾ ਯੋਜਨਾ',
  'ପ୍ରଧାନମନ୍ତ୍ରୀ ମୁଦ୍ରା ଯୋଜନା',
  'প্ৰধানমন্ত্ৰী মুদ্ৰা যোজনা',
  'وزیر اعظم مدرا یوجنا',
  'وزیر اعظم مدرا یوجنا',
  'प्रधानमंत्री मुद्रा योजना',
  'Micro Units Development and Refinance Agency - Loans for small businesses',
  'सूक्ष्म इकाई विकास और पुनर्वित्त एजेंसी - छोटे व्यापार के लिए ऋण',
  'நுண்ணிய அலகுகள் மேம்பாடு மற்றும் மறுநிதியளிப்பு நிறுவனம் - சிறு வணிகங்களுக்கான கடன்கள்',
  'ক্ষুদ্র ইউনিট উন্নয়ন ও পুনর্ঋণ সংস্থা - ছোট ব্যবসার জন্য ঋণ',
  'మైక్రో యూనిట్స్ డెవలప్‌మెంట్ అండ్ రిఫైనాన్స్ ఏజెన్సీ - చిన్న వ్యాపారాలకు రుణాలు',
  'सूक्ष्म एकक विकास आणि पुनर्वित्त एजन्सी - छोट्या व्यापारासाठी कर्ज',
  'માઇક્રો યુનિટ્સ ડેવલપમેન્ટ એન્ડ રિફાઇનાન્સ એજન્સી - નાના વ્યવસાયો માટે લોન',
  'ಮೈಕ್ರೋ ಯೂನಿಟ್ಸ್ ಡೆವಲಪ್‌ಮೆಂಟ್ ಮತ್ತು ರಿಫೈನಾನ್ಸ್ ಏಜೆನ್ಸಿ - ಸಣ್ಣ ವ್ಯಾಪಾರಗಳಿಗೆ ಸಾಲಗಳು',
  'മൈക്രോ യൂണിറ്റ്സ് ഡെവലപ്‌മെന്റ് ആൻഡ് റിഫൈനാൻസ് ഏജൻസി - ചെറുകിട ബിസിനസുകൾക്കുള്ള വായ്പകൾ',
  'ਮਾਈਕ੍ਰੋ ਯੂਨਿਟਸ ਡਿਵੈਲਪਮੈਂਟ ਐਂਡ ਰਿਫਾਇਨਾਂਸ ਏਜੰਸੀ - ਛੋਟੇ ਕਾਰੋਬਾਰਾਂ ਲਈ ਕਰਜ਼ੇ',
  'ମାଇକ୍ରୋ ୟୁନିଟ୍ସ ଡେଭଲପମେଣ୍ଟ ଏବଂ ରିଫାଇନାନ୍ସ ଏଜେନ୍ସି - ଛୋଟ ବ୍ୟବସାୟ ପାଇଁ ଋଣ',
  'মাইক্ৰো ইউনিটছ ডেভেলপমেণ্ট এণ্ড ৰিফাইনাঞ্চ এজেঞ্চী - সৰু ব্যৱসায়ৰ বাবে ঋণ',
  'مائیکرو یونٹس ڈیولپمنٹ اینڈ ریفائنانس ایجنسی - چھوٹے کاروبار کے لیے قرضے',
  'مائیکرو یونٹس ڈیولپمنٹ اینڈ ریفائنانس ایجنسی - چھوٹے کاروبار کے لیے قرضے',
  'सूक्ष्म इकाई विकास आ पुनर्वित्त एजेंसी - छोट व्यापारक लेल ऋण',
  '{"occupation": ["business", "entrepreneur", "self_employed"], "maxIncome": 1000000, "ageRange": [18, 65]}',
  'Loans up to ₹10 lakh without collateral in three categories: Shishu, Kishore, Tarun',
  'तीन श्रेणियों में बिना गारंटी के ₹10 लाख तक का ऋण: शिशु, किशोर, तरुण',
  'மூன்று வகைகளில் பிணையம் இல்லாமல் ₹10 லட்சம் வரை கடன்: சிசு, கிஷோர், தருண்',
  'তিনটি বিভাগে জামানত ছাড়াই ₹10 লক্ষ পর্যন্ত ঋণ: শিশু, কিশোর, তরুণ',
  'మూడు వర్గాలలో తాకట్టు లేకుండా ₹10 లక్షల వరకు రుణాలు: శిశు, కిశోర్, తరుణ్',
  'तीन श्रेणींमध्ये तारणाशिवाय ₹10 लाखापर्यंत कर्ज: शिशु, किशोर, तरुण',
  'ત્રણ કેટેગરીમાં જામીન વિના ₹10 લાખ સુધીની લોન: શિશુ, કિશોર, તરુણ',
  'ಮೂರು ವರ್ಗಗಳಲ್ಲಿ ಮೇಲಾಧಾರವಿಲ್ಲದೆ ₹10 ಲಕ್ಷದವರೆಗೆ ಸಾಲಗಳು: ಶಿಶು, ಕಿಶೋರ್, ತರುಣ್',
  'മൂന്ന് വിഭാഗങ്ങളിൽ ജാമ്യമില്ലാതെ ₹10 ലക്ഷം വരെ വായ്പകൾ: ശിശു, കിശോർ, തരുൺ',
  'ਤਿੰਨ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਬਿਨਾਂ ਗਾਰੰਟੀ ₹10 ਲੱਖ ਤੱਕ ਕਰਜ਼ਾ: ਸ਼ਿਸ਼ੂ, ਕਿਸ਼ੋਰ, ਤਰੁਣ',
  'ତିନୋଟି ବର୍ଗରେ ବିନା ଜାମିନରେ ₹10 ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ ଋଣ: ଶିଶୁ, କିଶୋର, ତରୁଣ',
  'তিনিটা শ্ৰেণীত বিনা জামিনত ₹10 লাখ পৰ্যন্ত ঋণ: শিশু, কিশোৰ, তৰুণ',
  'تین اقسام میں بغیر ضمانت ₹10 لاکھ تک قرض: شیشو، کشور، ترن',
  'تین اقسام میں بغیر ضمانت ₹10 لاکھ تک قرض: شیشو، کشور، ترن',
  'तीन श्रेणीमे बिना गारंटीक ₹10 लाख धरि ऋण: शिशु, किशोर, तरुण',
  'Apply through participating banks, NBFCs, or MFIs with business plan',
  'व्यापारिक योजना के साथ भाग लेने वाले बैंकों, एनबीएफसी या एमएफआई के माध्यम से आवेदन करें',
  'வணிகத் திட்டத்துடன் பங்கேற்கும் வங்கிகள், என்பிஎஃப்சிகள் அல்லது எம்எஃப்ஐகள் மூலம் விண்ணப்பிக்கவும்',
  'ব্যবসায়িক পরিকল্পনা সহ অংশগ্রহণকারী ব্যাংক, এনবিএফসি বা এমএফআই এর মাধ্যমে আবেদন করুন',
  'వ్యాపార ప్రణాళికతో పాల్గొనే బ్యాంకులు, ఎన్‌బిఎఫ్‌సిలు లేదా ఎంఎఫ్‌ఐల ద్వారా దరఖాస్తు చేసుకోండి',
  'व्यापारिक योजनेसह सहभागी बँका, एनबीएफसी किंवा एमएफआयद्वारे अर्ज करा',
  'બિઝનેસ પ્લાન સાથે ભાગ લેતી બેંકો, એનબીએફસી અથવા એમએફઆઈ દ્વારા અરજી કરો',
  'ವ್ಯಾಪಾರ ಯೋಜನೆಯೊಂದಿಗೆ ಭಾಗವಹಿಸುವ ಬ್ಯಾಂಕುಗಳು, ಎನ್‌ಬಿಎಫ್‌ಸಿಗಳು ಅಥವಾ ಎಂಎಫ್‌ಐಗಳ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
  'ബിസിനസ് പ്ലാനുമായി പങ്കെടുക്കുന്ന ബാങ്കുകൾ, എൻബിഎഫ്‌സികൾ അല്ലെങ്കിൽ എംഎഫ്‌ഐകൾ വഴി അപേക്ഷിക്കുക',
  'ਕਾਰੋਬਾਰੀ ਯੋਜਨਾ ਨਾਲ ਹਿੱਸਾ ਲੈਣ ਵਾਲੇ ਬੈਂਕਾਂ, ਐਨਬੀਐਫਸੀ ਜਾਂ ਐਮਐਫਆਈ ਰਾਹੀਂ ਅਰਜ਼ੀ ਦਿਓ',
  'ବ୍ୟବସାୟିକ ଯୋଜନା ସହିତ ଅଂଶଗ୍ରହଣକାରୀ ବ୍ୟାଙ୍କ, ଏନବିଏଫସି କିମ୍ବା ଏମଏଫଆଇ ମାଧ୍ୟମରେ ଆବେଦନ କରନ୍ତୁ',
  'ব্যৱসায়িক পৰিকল্পনাৰ সৈতে অংশগ্ৰহণকাৰী বেংক, এনবিএফচি বা এমএফআইৰ জৰিয়তে আবেদন কৰক',
  'کاروباری منصوبے کے ساتھ حصہ لینے والے بینکوں، این بی ایف سی یا ایم ایف آئی کے ذریعے درخواست دیں',
  'کاروباری منصوبے کے ساتھ حصہ لینے والے بینکن، این بی ایف سی یا ایم ایف آئی کے ذریعے درخواست دِیو',
  'व्यापारिक योजनाक संग भाग लेनिहार बैंक, एनबीएफसी या एमएफआईक माध्यमसँ आवेदन करू',
  'Ministry of Micro, Small and Medium Enterprises',
  'Ministry of Micro, Small and Medium Enterprises',
  'business',
  '["entrepreneurs", "small_business_owners", "self_employed"]',
  18, 65, 1000000,
  'all',
  '["General", "SC", "ST", "OBC", "EWS"]',
  'https://mudra.org.in',
  '1800-180-11-11'
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
  name_te,
  name_mr,
  name_gu,
  name_kn,
  name_ml,
  name_pa,
  name_or,
  name_as,
  name_ur,
  name_ks,
  name_mai,
  description,
  description_hi,
  description_ta,
  description_bn,
  description_te,
  description_mr,
  description_gu,
  description_kn,
  description_ml,
  description_pa,
  description_or,
  description_as,
  description_ur,
  description_ks,
  description_mai,
  eligibility,
  benefits,
  benefits_hi,
  benefits_ta,
  benefits_bn,
  benefits_te,
  benefits_mr,
  benefits_gu,
  benefits_kn,
  benefits_ml,
  benefits_pa,
  benefits_or,
  benefits_as,
  benefits_ur,
  benefits_ks,
  benefits_mai,
  application_process,
  application_process_hi,
  application_process_ta,
  application_process_bn,
  application_process_te,
  application_process_mr,
  application_process_gu,
  application_process_kn,
  application_process_ml,
  application_process_pa,
  application_process_or,
  application_process_as,
  application_process_ur,
  application_process_ks,
  application_process_mai,
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

-- Create function to get schemes by eligibility (supports both platforms)
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

-- Grant necessary permissions
GRANT ALL ON users TO anon, authenticated;
GRANT ALL ON schemes TO anon, authenticated;
GRANT ALL ON scheme_recommendations TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_matching_schemes TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_updated_at_column TO anon, authenticated;