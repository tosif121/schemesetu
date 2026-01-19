'use client';

// Telegram Bot Configuration
const TELEGRAM_BOT_USERNAME = 'schemesetu_bot';
const TELEGRAM_BOT_URL = `https://t.me/${TELEGRAM_BOT_USERNAME}`;

// Telegram message templates
export const TelegramMessages = {
  startChat: (language: string = 'en') => {
    const messages = {
      en: 'Hello! I need help finding government schemes.',
      hi: 'नमस्ते! मुझे सरकारी योजनाओं की जानकारी चाहिए।',
      bn: 'হ্যালো! আমার সরকারি স্কিম খুঁজে পেতে সাহায্য দরকার।',
      ta: 'வணக்கம்! எனக்கு அரசு திட்டங்களைக் கண்டறிய உதவி தேவை।',
      te: 'హలో! నాకు ప్రభుత్వ పథకాలను కనుగొనడంలో సహాయం కావాలి।',
      mr: 'नमस्कार! मला सरकारी योजना शोधण्यासाठी मदत हवी आहे।',
      gu: 'નમસ્તે! મને સરકારી યોજનાઓ શોધવામાં મદદ જોઈએ છે।',
      kn: 'ನಮಸ್ಕಾರ! ನನಗೆ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು ಸಹಾಯ ಬೇಕು।',
      ml: 'നമസ്കാരം! എനിക്ക് സർക്കാർ പദ്ധതികൾ കണ്ടെത്താൻ സഹായം വേണം।',
      pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਨੂੰ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।',
      or: 'ନମସ୍କାର! ମୋତେ ସରକାରୀ ଯୋଜନା ଖୋଜିବାରେ ସାହାଯ୍ୟ ଦରକାର।',
      as: 'নমস্কাৰ! মোৰ চৰকাৰী আঁচনি বিচাৰি উলিওৱাত সহায় লাগে।',
      ur: 'السلام علیکم! مجھے سرکاری اسکیمز تلاش کرنے میں مدد چاہیے۔',
      ks: 'آداب! مےٚ چھُس سرکاری اسکیمز تلاش کرنس منز مدد ضرورت۔',
      mai: 'प्रणाम! हमरा सरकारी योजना खोजबाक लेल मदद चाही।'
    };
    
    const message = messages[language as keyof typeof messages] || messages.en;
    return `${TELEGRAM_BOT_URL}?start=chat&text=${encodeURIComponent(message)}`;
  },

  findSchemes: (language: string = 'en') => {
    const messages = {
      en: 'I want to find government schemes I\'m eligible for.',
      hi: 'मैं उन सरकारी योजनाओं को खोजना चाहता हूं जिनके लिए मैं पात्र हूं।',
      bn: 'আমি সরকারি স্কিমগুলি খুঁজে পেতে চাই যার জন্য আমি যোগ্য।',
      ta: 'நான் தகுதியான அரசு திட்டங்களைக் கண்டறிய விரும்புகிறேன்।',
      te: 'నేను అర్హత ఉన్న ప్రభుత్వ పథకాలను కనుగొనాలని అనుకుంటున్నాను।',
      mr: 'मी पात्र असलेल्या सरकारी योजना शोधू इच्छितो।',
      gu: 'હું લાયક સરકારી યોજનાઓ શોધવા માંગુ છું।',
      kn: 'ನಾನು ಅರ್ಹತೆ ಹೊಂದಿರುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು ಬಯಸುತ್ತೇನೆ।',
      ml: 'എനിക്ക് അർഹതയുള്ള സർക്കാർ പദ്ധതികൾ കണ്ടെത്താൻ ഞാൻ ആഗ്രഹിക്കുന്നു।',
      pa: 'ਮੈਂ ਉਹਨਾਂ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਨੂੰ ਲੱਭਣਾ ਚਾਹੁੰਦਾ ਹਾਂ ਜਿਨ੍ਹਾਂ ਲਈ ਮੈਂ ਯੋਗ ਹਾਂ।',
      or: 'ମୁଁ ଯୋଗ୍ୟ ସରକାରୀ ଯୋଜନା ଖୋଜିବାକୁ ଚାହୁଁଛି।',
      as: 'মই যোগ্য চৰকাৰী আঁচনিবোৰ বিচাৰি উলিয়াব বিচাৰো।',
      ur: 'میں ان سرکاری اسکیمز کو تلاش کرنا چاہتا ہوں جن کے لیے میں اہل ہوں۔',
      ks: 'مےٚ چھُس تِم سرکاری اسکیمز تلاش کرُن یِم مےٚ اہل چھُس۔',
      mai: 'हम ओहि सरकारी योजना खोजब चाहैत छी जकरा लेल हम योग्य छी।'
    };
    
    const message = messages[language as keyof typeof messages] || messages.en;
    return `${TELEGRAM_BOT_URL}?start=schemes&text=${encodeURIComponent(message)}`;
  },

  getHelp: (language: string = 'en') => {
    const messages = {
      en: 'I need help understanding how to use SchemeSaathi.',
      hi: 'मुझे स्कीमसाथी का उपयोग करने में मदद चाहिए।',
      bn: 'স্কিমসাথী কীভাবে ব্যবহার করতে হয় তা বুঝতে আমার সাহায্য দরকার।',
      ta: 'ஸ்கீம்சாத்தியை எப்படி பயன்படுத்துவது என்பதைப் புரிந்துகொள்ள எனக்கு உதவி தேவை।',
      te: 'స్కీమ్‌సాథీని ఎలా ఉపయోగించాలో అర్థం చేసుకోవడానికి నాకు సహాయం కావాలి।',
      mr: 'स्कीमसाथी कसे वापरायचे हे समजून घेण्यासाठी मला मदत हवी आहे।',
      gu: 'સ્કીમસાથીનો ઉપયોગ કેવી રીતે કરવો તે સમજવા માટે મને મદદની જરૂર છે।',
      kn: 'ಸ್ಕೀಮ್‌ಸಾಥಿಯನ್ನು ಹೇಗೆ ಬಳಸಬೇಕೆಂದು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನನಗೆ ಸಹಾಯ ಬೇಕು।',
      ml: 'സ്കീംസാഥി എങ്ങനെ ഉപയോഗിക്കണമെന്ന് മനസ്സിലാക്കാൻ എനിക്ക് സഹായം വേണം।',
      pa: 'ਮੈਨੂੰ ਸਕੀਮਸਾਥੀ ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰਨੀ ਹੈ ਇਹ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।',
      or: 'ସ୍କୀମସାଥୀ କିପରି ବ୍ୟବହାର କରିବାକୁ ହେବ ତାହା ବୁଝିବାରେ ମୋତେ ସାହାଯ୍ୟ ଦରକାର।',
      as: 'স্কীমসাথী কেনেকৈ ব্যৱহাৰ কৰিব লাগে সেয়া বুজি পাবলৈ মোৰ সহায় লাগে।',
      ur: 'مجھے سکیم ساتھی کا استعمال کرنے کا طریقہ سمجھنے میں مدد چاہیے۔',
      ks: 'مےٚ چھُس سکیم ساتھی استعمال کرنُک طریقہ سمجھنس منز مدد ضرورت۔',
      mai: 'हमरा स्कीमसाथी केना उपयोग करबाक अछि से बुझबाक लेल मदद चाही।'
    };
    
    const message = messages[language as keyof typeof messages] || messages.en;
    return `${TELEGRAM_BOT_URL}?start=help&text=${encodeURIComponent(message)}`;
  }
};

// Utility functions
export const openTelegram = (url: string) => {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

// React hook for Telegram integration
export const useTelegram = () => {
  const startChat = (language: string = 'en') => {
    const url = TelegramMessages.startChat(language);
    openTelegram(url);
  };

  const findSchemes = (language: string = 'en') => {
    const url = TelegramMessages.findSchemes(language);
    openTelegram(url);
  };

  const getHelp = (language: string = 'en') => {
    const url = TelegramMessages.getHelp(language);
    openTelegram(url);
  };

  return {
    startChat,
    findSchemes,
    getHelp,
    botUsername: TELEGRAM_BOT_USERNAME,
    botUrl: TELEGRAM_BOT_URL
  };
};

export default useTelegram;