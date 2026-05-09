import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const DailyQuran = () => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMathPopup, setShowMathPopup] = useState(false);
  const { darkMode } = useTheme();

  const bgColor = darkMode ? '#0a0f0d' : '#f0f4f8';
  const cardBg = darkMode ? '#1a2a24' : '#ffffff';
  const textColor = darkMode ? '#d4f1d9' : '#1a2a24';
  const subText = darkMode ? '#8aa899' : '#5a7a6a';
  const borderColor = darkMode ? '#2a4a3a' : '#e0e0e0';

  // قاعدة بيانات الآيات (مؤقتة، يمكن توسيعها)
  const versesDB = [
    { surah: 1, verse: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', meaning: 'بسم الله الرحمن الرحيم', explanation: 'افتتاح القرآن الكريم، تذكير برحمة الله وعظمته.' },
    { surah: 2, verse: 255, text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', meaning: 'الله لا إله إلا هو الحي القيوم', explanation: 'آية الكرسي، أعظم آية في القرآن.' },
    { surah: 13, verse: 28, text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', meaning: 'ألا بذكر الله تطمئن القلوب', explanation: 'الذكر يمنح القلب السكينة والطمأنينة.' },
    { surah: 94, verse: 5, text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', meaning: 'فإن مع العسر يسراً', explanation: 'بعد كل شدة يأتي التيسير.' },
  ];

  useEffect(() => {
    loadDailyVerse();
  }, []);

  const loadDailyVerse = () => {
    const today = new Date().getDate();
    const index = today % versesDB.length;
    setVerse(versesDB[index]);
    setLoading(false);
  };

  const showUnderConstruction = () => {
    setShowMathPopup(true);
    setTimeout(() => setShowMathPopup(false), 3000);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🕋</div>
          <div>جاري تحميل آية اليوم...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>🕋 القرآن الكريم</div>
          <div style={{ fontSize: '12px', color: subText }}>آية اليوم وتفسيرها</div>
          <a href="/" style={{ display: 'inline-block', marginTop: '8px', color: '#e0b074', textDecoration: 'none' }}>← العودة للرئيسية</a>
        </div>

        {/* الآية */}
        <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '28px', marginBottom: '20px', border: `1px solid ${borderColor}`, textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: subText, marginBottom: '12px' }}>
            سورة {verse.surah} - آية {verse.verse}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor, marginBottom: '20px', lineHeight: 1.8 }}>
            {verse.text}
          </div>
          <div style={{ fontSize: '18px', color: '#e0b074', marginBottom: '16px' }}>
            {verse.meaning}
          </div>
          <div style={{ fontSize: '14px', color: subText, paddingTop: '16px', borderTop: `1px solid ${borderColor}` }}>
            {verse.explanation}
          </div>
        </div>

        {/* أزرار التفاعل */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={showUnderConstruction}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#8b5cf6',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🧮 القيمة الجبرية
          </button>
          <button
            onClick={loadDailyVerse}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#e0b074',
              border: 'none',
              borderRadius: '12px',
              color: '#0a0f0d',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔄 آية أخرى
          </button>
        </div>

        {/* ملاحظة تحت التطوير */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '16px', border: `1px solid ${borderColor}`, textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: subText }}>
            🔧 الخصائص الإضافية (البحث، المفضلة، القيمة الجبرية) قيد التطوير
          </div>
          <div style={{ fontSize: '11px', color: subText, marginTop: '8px' }}>
            ستُتاح قريبًا بإذن الله
          </div>
        </div>

        {/* نافذة منبثقة تحت التطوير */}
        {showMathPopup && (
          <div style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px', backgroundColor: '#8b5cf6', borderRadius: '16px', padding: '16px', textAlign: 'center', color: 'white', animation: 'slideUp 0.3s ease', zIndex: 1000 }}>
            🧮 هذه الخاصية (القيمة الجبرية) قيد التطوير حاليًا، ستتاح قريبًا بإذن الله
            <style>{'@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }'}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyQuran;
