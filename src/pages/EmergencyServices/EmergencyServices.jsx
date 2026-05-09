import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const EmergencyServices = () => {
  const { darkMode } = useTheme();
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const bgColor = darkMode ? '#0a0f0d' : '#f0f4f8';
  const cardBg = darkMode ? '#1a2a24' : '#ffffff';
  const textColor = darkMode ? '#d4f1d9' : '#1a2a24';
  const subText = darkMode ? '#8aa899' : '#5a7a6a';
  const borderColor = darkMode ? '#2a4a3a' : '#e0e0e0';

  const emergencyNumbers = [
    { name: '🚑 الإسعاف', number: '997', icon: '🚑', bg: '#dc2626' },
    { name: '👮 الشرطة', number: '999', icon: '👮', bg: '#2563eb' },
    { name: '🔥 الدفاع المدني', number: '998', icon: '🔥', bg: '#ea580c' },
    { name: '🚨 النجدة', number: '112', icon: '🚨', bg: '#7c3aed' }
  ];

  const reportTypes = [
    { id: 'medical', name: '🏥 حالة طبية طارئة', icon: '🏥' },
    { id: 'fire', name: '🔥 حريق', icon: '🔥' },
    { id: 'security', name: '👮 حالة أمنية', icon: '👮' },
    { id: 'accident', name: '🚗 حادث مروري', icon: '🚗' },
    { id: 'other', name: '📞 أخرى', icon: '📞' }
  ];

  const getReportTypeName = (id) => {
    const type = reportTypes.find(t => t.id === id);
    return type ? type.name : id;
  };

  const sendNotificationToAdmin = (report) => {
    // تخزين إشعار للمدير في localStorage
    const adminNotifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
    adminNotifications.unshift({
      id: Date.now(),
      title: '🚨 بلاغ طارئ جديد',
      message: `نوع: ${report.reportTypeName}\nالموقع: ${report.location}\nالوصف: ${report.description.substring(0, 50)}...`,
      reportId: report.id,
      read: false,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('admin_notifications', JSON.stringify(adminNotifications));
    
    // إذا كان التطبيق مفتوحاً في تبويب المشرف، نحدث واجهته
    if (window.localStorage.getItem('admin_panel_open') === 'true') {
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleSubmitReport = async () => {
    if (!reportType || !description || !location) {
      alert('⚠️ الرجاء ملء جميع الحقول');
      return;
    }

    setIsSubmitting(true);

    const newReport = {
      id: Date.now(),
      reportType,
      reportTypeName: getReportTypeName(reportType),
      description,
      location,
      contactInfo: contactInfo || 'لم يتم توفير',
      status: 'pending',
      createdAt: new Date().toISOString(),
      userIP: 'تم الرفع من التطبيق'
    };

    const existingReports = JSON.parse(localStorage.getItem('emergency_reports') || '[]');
    existingReports.unshift(newReport);
    localStorage.setItem('emergency_reports', JSON.stringify(existingReports));
    
    // إرسال إشعار للمدير
    sendNotificationToAdmin(newReport);

    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus(null);
        setReportType('');
        setDescription('');
        setLocation('');
        setContactInfo('');
      }, 3000);
    }, 1000);
  };

  const makeCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>🚨 خدمات الطوارئ</div>
          <div style={{ fontSize: '12px', color: subText, marginTop: '4px' }}>مساعدة فورية - دعم طارئ</div>
          <a href="/" style={{ display: 'inline-block', marginTop: '8px', color: '#e0b074', textDecoration: 'none' }}>← العودة للرئيسية</a>
        </div>

        <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '20px', border: `1px solid ${borderColor}`, marginBottom: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '16px', textAlign: 'center' }}>📞 أرقام الطوارئ المهمة</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {emergencyNumbers.map(emergency => (
              <button key={emergency.number} onClick={() => makeCall(emergency.number)} style={{ padding: '16px', backgroundColor: emergency.bg, border: 'none', borderRadius: '16px', color: 'white', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{emergency.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{emergency.name}</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px' }}>{emergency.number}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '20px', border: `1px solid ${borderColor}`, marginBottom: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '16px', textAlign: 'center' }}>📝 رفع بلاغ طارئ</div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', color: subText, marginBottom: '8px' }}>نوع البلاغ *</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {reportTypes.map(type => (
                <button key={type.id} onClick={() => setReportType(type.id)} style={{ padding: '10px', backgroundColor: reportType === type.id ? '#e0b074' : 'transparent', border: `1px solid ${borderColor}`, borderRadius: '12px', color: reportType === type.id ? '#0a0f0d' : textColor, cursor: 'pointer', fontSize: '13px' }}>
                  {type.icon} {type.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', color: subText, marginBottom: '8px' }}>موقع الحادث *</div>
            <input type="text" placeholder="العنوان أو الإحداثيات" value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: darkMode ? '#0a0f0d' : '#fff', border: `1px solid ${borderColor}`, color: textColor, fontSize: '14px' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', color: subText, marginBottom: '8px' }}>بيانات التواصل (اختياري)</div>
            <input type="text" placeholder="رقم الهاتف أو البريد الإلكتروني" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: darkMode ? '#0a0f0d' : '#fff', border: `1px solid ${borderColor}`, color: textColor, fontSize: '14px' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', color: subText, marginBottom: '8px' }}>تفاصيل البلاغ *</div>
            <textarea placeholder="وصف مفصل للحالة..." value={description} onChange={(e) => setDescription(e.target.value)} rows="4" style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: darkMode ? '#0a0f0d' : '#fff', border: `1px solid ${borderColor}`, color: textColor, fontSize: '14px', resize: 'vertical' }} />
          </div>

          <button onClick={handleSubmitReport} disabled={isSubmitting} style={{ width: '100%', padding: '14px', backgroundColor: '#dc2626', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'جاري الإرسال...' : '🚨 إرسال البلاغ'}
          </button>

          {submitStatus === 'success' && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#10b981', borderRadius: '12px', textAlign: 'center', color: 'white' }}>✅ تم استلام بلاغك بنجاح! سيتم التعامل معه فوراً.</div>
          )}
        </div>

        <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '20px', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: textColor, marginBottom: '12px', textAlign: 'center' }}>💡 نصائح مهمة في الحالات الطارئة</div>
          <ul style={{ color: subText, fontSize: '13px', lineHeight: 1.8, paddingRight: '20px' }}>
            <li>✅ حافظ على هدوئك ولا تُصعِب الموقف بنفسك</li>
            <li>✅ اتصل بأرقام الطوارئ أولاً قبل أي تصرف آخر</li>
            <li>✅ قدم موقعاً دقيقاً للحادث لتصل المساعدة بسرعة</li>
            <li>✅ لا تغادر موقع الحادث إلا للضرورة القصوى</li>
            <li>✅ أبلغ عن أي تصرف مشبهاً للسلطات فوراً</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <div style={{ fontSize: '11px', color: subText }}>سيتم إشعار إدارة التطبيق فور استلام البلاغ</div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyServices;
