import React, { useState, useEffect } from 'react';

function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = async () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await fetch(`/api/calendar/today?timezone=${timezone}`);
      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
        setLastUpdate(new Date());
        setError(null);
      } else {
        setError('فشل تحميل البيانات');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchData();
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;
    const midnightTimer = setTimeout(() => {
      fetchData();
      setInterval(fetchData, 86400000);
    }, msUntilMidnight);
    return () => clearTimeout(midnightTimer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  if (loading && !data) {
    return (
      <div style={{ backgroundColor: '#0a0f0d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b0d9b4' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #2a4a3a', borderTop: '4px solid #e0b074', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
          <div>جاري تحميل التقويم الفاطمي...</div>
          <style>{'@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }'}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#0a0f0d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px' }}>
        <div style={{ color: '#dc2626', fontSize: '24px', marginBottom: '16px' }}>⚠️</div>
        <div style={{ color: '#dc2626', textAlign: 'center', marginBottom: '16px' }}>{error}</div>
        <button onClick={handleRefresh} style={{ padding: '8px 24px', backgroundColor: '#e0b074', border: 'none', borderRadius: '20px', color: '#0a0f0d', cursor: 'pointer' }}>🔄 إعادة المحاولة</button>
      </div>
    );
  }

  if (!data) return null;

  const formattedTime = currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ backgroundColor: '#0a0f0d', minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* الرأس */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4f1d9' }}>التقويم الفاطمي</div>
          <div style={{ fontSize: '12px', color: '#e0b074', marginTop: '4px' }}>🕐 {formattedTime} | 📅 {formattedDate}</div>
          <div style={{ fontSize: '10px', color: '#5a7a6a', marginTop: '4px' }}>المنطقة: {data.timezone} | آخر تحديث: {lastUpdate?.toLocaleTimeString('ar-EG') || '--'}</div>

          {/* الروابط الكاملة لجميع الصفحات */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
            <a href="/" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>🏠 الرئيسية</a>
            <a href="/tasbih" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>📿 المسبحة</a>
            <a href="/month" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>📅 التقويم الشهري</a>
            <a href="/events" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>📋 المناسبات</a>
            <a href="/qibla" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>🧭 بوصلة القبلة</a>
            <a href="/weather" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>🌤️ الطقس وأوقات الصلاة</a>
            <a href="/quran" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>🕋 القرآن اليومي</a>
            <a href="/business" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>📋 دليل الأعمال</a>
            <a href="/emergency" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>🚨 خدمات الطوارئ</a>
            <a href="/admin" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>👑 لوحة الإدارة</a>
            <a href="/observatory" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>📊 المرصد الاجتماعي</a>
            <a href="/dashboard" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>👤 لوحة التحكم</a>
            <a href="/volunteer" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>🤝 فرص التطوع</a>

            <a href="/settings" style={{ color: '#e0b074', textDecoration: 'none', fontSize: '12px' }}>⚙️ الإعدادات</a>
          </div>
        </div>

        {/* بطاقة التاريخ الفاطمي */}
        <div style={{ backgroundColor: '#1a2a24', borderRadius: '16px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#e0b074', marginBottom: '8px' }}>{data.hijri.day}</div>
          <div style={{ fontSize: '20px', color: '#d4f1d9', marginBottom: '6px' }}>{data.hijri.month_name} {data.hijri.year} هـ</div>
          <div style={{ fontSize: '16px', color: '#b0d9b4', marginBottom: '4px' }}>{data.day_name}</div>
          <div style={{ fontSize: '14px', color: '#8aa899' }}>{data.gregorian.formatted}</div>
        </div>

        {/* معلومات الشهر والسنة */}
        <div style={{ backgroundColor: '#1a2a24', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4f1d9' }}>{data.hijri.month_name}</div>
              <div style={{ fontSize: '12px', color: '#8aa899' }}>الشهر الحالي</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', color: '#b0d9b4' }}>نوع السنة: {data.year_type}</div>
              <div style={{ fontSize: '13px', color: '#b0d9b4' }}>أيام الشهر: {data.hijri.days_in_month} يوم</div>
            </div>
          </div>
        </div>

        {/* زر التحديث */}
        <button 
          onClick={handleRefresh} 
          style={{ width: '100%', padding: '12px', backgroundColor: '#e0b074', border: 'none', borderRadius: '12px', color: '#0a0f0d', fontWeight: 'bold', cursor: 'pointer' }}
        >
          🔄 تحديث البيانات
        </button>

        {/* تذييل */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <div style={{ fontSize: '10px', color: '#5a7a6a' }}>التقويم الفاطمي • المذهب الإسماعيلي السليماني</div>
          <div style={{ fontSize: '9px', color: '#5a7a6a', marginTop: '4px' }}>يعتمد على توقيت مكة المكرمة • يتكيف مع منطقتك</div>
        </div>
      </div>
    </div>
  );
}

export default Home;




