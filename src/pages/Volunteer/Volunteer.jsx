import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Volunteer = () => {
  const { darkMode } = useTheme();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [applicationForm, setApplicationForm] = useState({ name: '', phone: '', message: '' });
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const bgColor = darkMode ? '#0a0f0d' : '#f0f4f8';
  const cardBg = darkMode ? '#1a2a24' : '#ffffff';
  const textColor = darkMode ? '#d4f1d9' : '#1a2a24';
  const subText = darkMode ? '#8aa899' : '#5a7a6a';
  const borderColor = darkMode ? '#2a4a3a' : '#e0e0e0';

  // تحميل الفرص التطوعية
  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = () => {
    const stored = localStorage.getItem('volunteer_opportunities');
    if (stored) {
      setOpportunities(JSON.parse(stored));
    } else {
      // بيانات افتراضية
      const defaultOpportunities = [
        { id: 1, title: 'مساعدة في إطعام المحتاجين', description: 'توزيع وجبات إفطار على المحتاجين خلال شهر رمضان', location: 'حي النزهة', date: '2026-05-15', slots: 10, filled: 3, image: '🍽️' },
        { id: 2, title: 'زيارة المرضى', description: 'زيارة المرضى في المستشفى وتقديم الدعم المعنوي', location: 'مستشفى العام', date: '2026-05-20', slots: 5, filled: 2, image: '🏥' },
        { id: 3, title: 'تدريس القرآن للأطفال', description: 'تعليم الأطفال القرآن الكريم والتجويد', location: 'مسجد الفرقان', date: '2026-05-25', slots: 8, filled: 4, image: '📖' },
        { id: 4, title: 'تنظيف الحدائق العامة', description: 'حملة نظافة في حدائق المدينة', location: 'حديقة السلام', date: '2026-06-01', slots: 20, filled: 5, image: '🌱' }
      ];
      setOpportunities(defaultOpportunities);
      localStorage.setItem('volunteer_opportunities', JSON.stringify(defaultOpportunities));
    }
    setLoading(false);
  };

  const handleApply = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowForm(true);
    setApplicationForm({ name: '', phone: '', message: '' });
  };

  const handleSubmitApplication = () => {
    if (!applicationForm.name || !applicationForm.phone) {
      alert('⚠️ الرجاء إدخال الاسم ورقم الهاتف');
      return;
    }

    // حفظ الطلب
    const newApplication = {
      id: Date.now(),
      opportunityId: selectedOpportunity.id,
      opportunityTitle: selectedOpportunity.title,
      name: applicationForm.name,
      phone: applicationForm.phone,
      message: applicationForm.message,
      status: 'pending',
      date: new Date().toISOString()
    };

    const existingApps = JSON.parse(localStorage.getItem('volunteer_applications') || '[]');
    existingApps.push(newApplication);
    localStorage.setItem('volunteer_applications', JSON.stringify(existingApps));

    // تحديث عدد المقاعد المحجوزة
    const updatedOps = opportunities.map(op =>
      op.id === selectedOpportunity.id ? { ...op, filled: op.filled + 1 } : op
    );
    setOpportunities(updatedOps);
    localStorage.setItem('volunteer_opportunities', JSON.stringify(updatedOps));

    setSubmitStatus('success');
    setTimeout(() => {
      setShowForm(false);
      setSubmitStatus(null);
    }, 2000);
  };

  const getAvailableSlots = (opportunity) => {
    return opportunity.slots - opportunity.filled;
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor }}>
        جاري تحميل فرص التطوع...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>🤝 تطوع معنا</div>
          <div style={{ fontSize: '12px', color: subText, marginTop: '4px' }}>شارك في العمل الخيري والتطوعي</div>
          <a href="/" style={{ display: 'inline-block', marginTop: '8px', color: '#e0b074', textDecoration: 'none' }}>← العودة للرئيسية</a>
        </div>

        {/* قائمة الفرص التطوعية */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {opportunities.map(opp => {
            const available = getAvailableSlots(opp);
            const isFull = available === 0;
            
            return (
              <div key={opp.id} style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '16px', border: `1px solid ${borderColor}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{opp.image}</span>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor }}>{opp.title}</div>
                    <div style={{ fontSize: '12px', color: subText }}>📍 {opp.location}</div>
                  </div>
                </div>
                
                <div style={{ fontSize: '13px', color: textColor, marginBottom: '12px' }}>{opp.description}</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '12px', color: subText }}>📅 {opp.date}</div>
                  <div style={{ fontSize: '12px', color: subText }}>👥 {opp.filled}/{opp.slots} متطوع</div>
                  <div style={{ fontSize: '12px', color: available > 0 ? '#10b981' : '#dc2626' }}>
                    {available > 0 ? `✅ متبقي ${available} مقاعد` : '❌ اكتمل العدد'}
                  </div>
                </div>
                
                {!isFull && (
                  <button
                    onClick={() => handleApply(opp)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#10b981',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    🤝 التقدم لهذه الفرصة
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* نموذج التقديم */}
        {showForm && selectedOpportunity && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: cardBg, borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '400px', maxHeight: '80vh', overflow: 'auto' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: textColor, marginBottom: '16px', textAlign: 'center' }}>
                التقديم على: {selectedOpportunity.title}
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', color: subText, marginBottom: '4px' }}>الاسم الكامل *</div>
                <input
                  type="text"
                  value={applicationForm.name}
                  onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: darkMode ? '#0a0f0d' : '#fff', border: `1px solid ${borderColor}`, color: textColor }}
                />
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', color: subText, marginBottom: '4px' }}>رقم الجوال *</div>
                <input
                  type="tel"
                  value={applicationForm.phone}
                  onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: darkMode ? '#0a0f0d' : '#fff', border: `1px solid ${borderColor}`, color: textColor }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', color: subText, marginBottom: '4px' }}>رسالة (اختياري)</div>
                <textarea
                  value={applicationForm.message}
                  onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })}
                  rows="3"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: darkMode ? '#0a0f0d' : '#fff', border: `1px solid ${borderColor}`, color: textColor, resize: 'vertical' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleSubmitApplication} style={{ flex: 1, padding: '12px', backgroundColor: '#10b981', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>إرسال الطلب</button>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#dc2626', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>إلغاء</button>
              </div>
              
              {submitStatus === 'success' && (
                <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#10b981', borderRadius: '10px', textAlign: 'center', color: 'white' }}>✅ تم إرسال طلبك بنجاح!</div>
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <div style={{ fontSize: '11px', color: subText }}>تطوعك يصنع فرقاً في حياة الآخرين</div>
        </div>
        
      </div>
    </div>
  );
};

export default Volunteer;
