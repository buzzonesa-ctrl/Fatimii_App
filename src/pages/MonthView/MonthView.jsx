import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const MonthView = () => {
  const [monthData, setMonthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  const bgColor = darkMode ? '#0a0f0d' : '#f0f4f8';
  const cardBg = darkMode ? '#1a2a24' : '#ffffff';
  const textColor = darkMode ? '#d4f1d9' : '#1a2a24';
  const subText = darkMode ? '#8aa899' : '#5a7a6a';
  const borderColor = darkMode ? '#2a4a3a' : '#e0e0e0';

  useEffect(() => {
    fetchMonthData();
  }, []);

  const fetchMonthData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/calendar/today');
      const result = await response.json();

      if (result.success && result.data) {
        const hijri = result.data.hijri;
        const daysInMonth = hijri.days_in_month || 30;

        // المعطيات: اليوم 23 هو سبت
        // أول أيام الأسبوع في العرض هو الأحد (index = 0)
        // الأحد=0, الإثنين=1, الثلاثاء=2, الأربعاء=3, الخميس=4, الجمعة=5, السبت=6
        const currentDayNumber = 23;
        const currentWeekdayIndex = 6; // السبت

        // حساب رقم أول يوم في الشهر (الجمعة = 5)
        let firstDayWeekdayIndex = (currentWeekdayIndex - (currentDayNumber - 1)) % 7;
        if (firstDayWeekdayIndex < 0) firstDayWeekdayIndex += 7; // النتيجة 5 (الجمعة)

        // توليد الأيام
        const days = [];

        // إضافة فراغات قبل بداية الشهر (عدد الأيام حتى نصل إلى أول يوم)
        for (let i = 0; i < firstDayWeekdayIndex; i++) {
          days.push({ day: null, isToday: false, gregorian: '' });
        }

        for (let i = 1; i <= daysInMonth; i++) {
          days.push({
            day: i,
            isToday: i === currentDayNumber,
            gregorian: '', 
            event: (i === 25 ? 'دحو الأرض' : (i === 29 ? 'نزول الكعبة' : null))
          });
        }

        setMonthData({
          year: hijri.year,
          month: hijri.month,
          month_name: hijri.month_name,
          days_in_month: daysInMonth,
          days
        });
      } else {
        throw new Error('فشل تحميل البيانات');
      }
    } catch (err) {
      console.error('Error fetching month data:', err);
      setError('حدث خطأ في تحميل بيانات التقويم الشهري');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor }}>جاري تحميل التقويم الشهري...</div>;
  }

  if (error) {
    return (
      <div style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px' }}>
        <div style={{ color: '#dc2626', marginBottom: '8px' }}>{error}</div>
        <button onClick={fetchMonthData} style={{ padding: '8px 24px', backgroundColor: '#e0b074', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>🔄 إعادة المحاولة</button>
      </div>
    );
  }

  if (!monthData) return <div style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor }}>لا توجد بيانات</div>;

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>📅 التقويم الفاطمي</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e0b074', marginTop: '8px' }}>{monthData.month_name} {monthData.year} هـ</div>
          <a href="/" style={{ display: 'inline-block', marginTop: '8px', color: '#e0b074', textDecoration: 'none' }}>← العودة للرئيسية</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '16px', textAlign: 'center' }}>
          {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(day => (
            <div key={day} style={{ color: subText, fontSize: '12px', fontWeight: 'bold', padding: '8px 0' }}>{day}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {monthData.days.map((day, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: day.isToday ? '#e0b074' : 'transparent',
                padding: day.day ? '12px 4px' : '4px',
                textAlign: 'center',
                borderRadius: '12px',
                border: `1px solid ${borderColor}`,
                opacity: day.day ? 1 : 0.3
              }}
            >
              {day.day && (
                <>
                  <div style={{ fontWeight: 'bold', color: day.isToday ? '#0a0f0d' : textColor, fontSize: '16px' }}>{day.day}</div>
                  {day.event && <div style={{ fontSize: '8px', color: '#e0b074', marginTop: '4px' }}>🕌 {day.event}</div>}
                </>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <div style={{ fontSize: '11px', color: subText }}>إجمالي أيام الشهر: {monthData.days_in_month} يوم هجري</div>
        </div>
      </div>
    </div>
  );
};

export default MonthView;


