import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const SocialObservatory = () => {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    volunteers: 15420,
    reports: 8732,
    verifiedReports: 6541,
    pendingReports: 2191,
    lastUpdate: '2026-05-09',
    regions: 12,
    categories: 8
  });
  const [loading, setLoading] = useState(false);

  const bgColor = darkMode ? '#0a0f0d' : '#f0f4f8';
  const cardBg = darkMode ? '#1a2a24' : '#ffffff';
  const textColor = darkMode ? '#d4f1d9' : '#1a2a24';
  const subText = darkMode ? '#8aa899' : '#5a7a6a';
  const borderColor = darkMode ? '#2a4a3a' : '#e0e0e0';

  // عنوان المرصد الخارجي
  const OBSERVATORY_URL = 'https://observatory.bohraexample.com'; // استبدل بالرابط الحقيقي لاحقاً

  // محاكاة جلب البيانات (سيتم ربطها بـ Backend لاحقاً)
  useEffect(() => {
    // هنا سيتم جلب البيانات من API حقيقي
    // مؤقتاً نستخدم البيانات الافتراضية
    setLoading(false);
  }, []);

  const shareStats = () => {
    const shareText = `📊 مرصد التواصل الاجتماعي\n\n` +
      `عدد المتطوعين: ${stats.volunteers.toLocaleString()}\n` +
      `إجمالي التقارير: ${stats.reports.toLocaleString()}\n` +
      `التقارير الموثقة: ${stats.verifiedReports.toLocaleString()}\n` +
      `آخر تحديث: ${stats.lastUpdate}\n\n` +
      `للمزيد من التفاصيل: ${OBSERVATORY_URL}`;

    if (navigator.share) {
      navigator.share({
        title: 'مرصد التواصل الاجتماعي',
        text: shareText,
        url: OBSERVATORY_URL
      }).catch(() => alert('تم إلغاء المشاركة'));
    } else {
      navigator.clipboard.writeText(shareText);
      alert('✅ تم نسخ المؤشرات إلى الحافظة');
    }
  };

  const openExternalObservatory = () => {
    window.open(OBSERVATORY_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>📊 المرصد الاجتماعي</div>
          <div style={{ fontSize: '12px', color: subText, marginTop: '4px' }}>تقارير استشرافية • بيانات المتطوعين</div>
          <a href="/" style={{ display: 'inline-block', marginTop: '8px', color: '#e0b074', textDecoration: 'none' }}>← العودة للرئيسية</a>
        </div>

        {/* بطاقة المؤشرات الرئيسية */}
        <div style={{ 
          backgroundColor: cardBg, 
          borderRadius: '24px', 
          padding: '20px',
          border: `1px solid ${borderColor}`,
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '16px', textAlign: 'center' }}>
            📈 المؤشرات الرئيسية
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e0b074' }}>{stats.volunteers.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: subText }}>متطوع مسجل</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e0b074' }}>{stats.reports.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: subText }}>إجمالي التقارير</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{stats.verifiedReports.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: subText }}>تقارير موثقة</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e0b074' }}>{stats.pendingReports.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: subText }}>قيد المراجعة</div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingTop: '12px',
            borderTop: `1px solid ${borderColor}`,
            fontSize: '11px',
            color: subText
          }}>
            <span>🗺️ {stats.regions} منطقة</span>
            <span>📂 {stats.categories} فئة</span>
            <span>🕐 آخر تحديث: {stats.lastUpdate}</span>
          </div>
        </div>

        {/* زر المشاركة */}
        <button
          onClick={shareStats}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#2563eb',
            border: 'none',
            borderRadius: '16px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          📤 مشاركة المؤشرات
        </button>

        {/* رابط المرصد الخارجي */}
        <div style={{ 
          backgroundColor: '#e0b074', 
          borderRadius: '20px', 
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0a0f0d', marginBottom: '12px' }}>
            🔗 منصة المرصد المتكاملة
          </div>
          <div style={{ fontSize: '13px', color: '#0a0f0d', marginBottom: '16px', opacity: 0.9 }}>
            للاطلاع على التقارير الكاملة، التحليلات المتعمقة، وإدارة بيانات المتطوعين بشكل آمن
          </div>
          <button
            onClick={openExternalObservatory}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0a0f0d',
              border: 'none',
              borderRadius: '12px',
              color: '#e0b074',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🌐 زيارة المرصد الخارجي ←
          </button>
        </div>

        {/* معلومات إضافية عن الحماية */}
        <div style={{ 
          backgroundColor: cardBg, 
          borderRadius: '16px', 
          padding: '16px',
          border: `1px solid ${borderColor}`,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '13px', color: subText, marginBottom: '8px' }}>
            🔒 المرصد يخضع لإجراءات أمنية مشددة لحماية بيانات المتطوعين
          </div>
          <div style={{ fontSize: '11px', color: subText }}>
            يتم توثيق هوية المتطوعين والتحقق من البيانات قبل النشر
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <div style={{ fontSize: '11px', color: subText }}>منصة استشرافية • بيانات ميدانية موثقة</div>
        </div>
        
      </div>
    </div>
  );
};

export default SocialObservatory;
