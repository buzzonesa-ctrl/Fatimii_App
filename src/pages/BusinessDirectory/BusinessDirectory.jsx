import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const BusinessDirectory = () => {
  const { darkMode } = useTheme();

  const bgColor = darkMode ? '#0a0f0d' : '#f0f4f8';
  const cardBg = darkMode ? '#1a2a24' : '#ffffff';
  const textColor = darkMode ? '#d4f1d9' : '#1a2a24';
  const subText = darkMode ? '#8aa899' : '#5a7a6a';
  const borderColor = darkMode ? '#2a4a3a' : '#e0e0e0';

  const openBusinessPortal = () => {
    window.open('https://bohrabusiness.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>📋 دليل الأعمال</div>
          <div style={{ fontSize: '12px', color: subText, marginTop: '4px' }}>البوابة التجارية الشاملة</div>
          <a href="/" style={{ display: 'inline-block', marginTop: '8px', color: '#e0b074', textDecoration: 'none' }}>← العودة للرئيسية</a>
        </div>

        {/* البطاقة الرئيسية */}
        <div style={{ 
          backgroundColor: cardBg, 
          borderRadius: '24px', 
          padding: '32px 24px', 
          textAlign: 'center',
          border: `1px solid ${borderColor}`,
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌐</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: textColor, marginBottom: '12px' }}>
            بوابة الأعمال التجارية
          </div>
          <div style={{ fontSize: '14px', color: subText, marginBottom: '24px', lineHeight: 1.6 }}>
            استعرض آلاف الخدمات والمنتجات من مختلف القطاعات التجارية
          </div>
          <button
            onClick={openBusinessPortal}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#e0b074',
              border: 'none',
              borderRadius: '16px',
              color: '#0a0f0d',
              fontWeight: 'bold',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            🔗 زيارة البوابة الآن
          </button>
        </div>

        {/* الفئات الرئيسية */}
        <div style={{ 
          backgroundColor: cardBg, 
          borderRadius: '20px', 
          padding: '20px',
          border: `1px solid ${borderColor}`,
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '16px', textAlign: 'center' }}>
            📂 الفئات المتاحة
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {[
              'المقاولات والبناء', 'العدد والمواد الصناعية', 'الأغذية والمشروبات', 
              'تقنية المعلومات', 'الرعاية الصحية', 'العقارات', 'السفر والسياحة', 
              'السيارات وقطع الغيار', 'التعليم والتدريب', 'الصناعات التحويلية',
              'المحاسبة والاستشارات', 'الإعلان والتسويق'
            ].map(cat => (
              <div key={cat} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: darkMode ? '#0a0f0d' : '#f8f9fa',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onClick={openBusinessPortal}
              >
                <span style={{ fontSize: '16px' }}>📌</span>
                <span style={{ fontSize: '13px', color: textColor }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* معلومات إضافية */}
        <div style={{ 
          backgroundColor: cardBg, 
          borderRadius: '16px', 
          padding: '20px',
          border: `1px solid ${borderColor}`,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: subText, marginBottom: '12px' }}>
            💡 نصيحة سيدنا محمد برهان الدين (رض)
          </div>
          <div style={{ fontSize: '15px', color: textColor, fontStyle: 'italic', marginBottom: '16px' }}>
            "Become Business minded, NOT service minded"
          </div>
          <button
            onClick={openBusinessPortal}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              color: '#e0b074',
              cursor: 'pointer'
            }}
          >
            استكشف الآن ←
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <div style={{ fontSize: '11px', color: subText }}>مدعوم من BohraBusiness.com | البوابة التجارية الأولى</div>
        </div>
        
      </div>
    </div>
  );
};

export default BusinessDirectory;
