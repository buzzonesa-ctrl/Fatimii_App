import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const Tasbih = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('tasbih');
  const [counters, setCounters] = useState({
    tasbih: 0,
    tahmid: 0,
    takbir: 0,
    istighfar: 0
  });
  const [dailyTotal, setDailyTotal] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const audioRef = useRef(null);

  const bgColor = darkMode ? '#0a0f0d' : '#f0f4f8';
  const cardBg = darkMode ? '#1a2a24' : '#ffffff';
  const textColor = darkMode ? '#d4f1d9' : '#1a2a24';
  const subText = darkMode ? '#8aa899' : '#5a7a6a';
  const borderColor = darkMode ? '#2a4a3a' : '#e0e0e0';

  const dhikrItems = {
    tasbih: { name: 'سبحان الله', target: 33, color: '#10b981', icon: '📿', reward: 'تسبيحة' },
    tahmid: { name: 'الحمد لله', target: 33, color: '#e0b074', icon: '🤲', reward: 'تحميدة' },
    takbir: { name: 'الله أكبر', target: 33, color: '#3b82f6', icon: '🕌', reward: 'تكبيرة' },
    istighfar: { name: 'أستغفر الله', target: 70, color: '#8b5cf6', icon: '💧', reward: 'استغفار' }
  };

  const morningDhikr = [
    { id: 1, text: 'رضيت بالله رباً، وبالإسلام ديناً، وبمحمد صلى الله عليه وسلم نبياً', count: 3 },
    { id: 2, text: 'اللهم إني أصبحت منك في نعمة وعافية وستر، فأتمم نعمتك علي وعافيتك وسترك في الدنيا والآخرة', count: 3 },
    { id: 3, text: 'سبحان الله وبحمده عدد خلقه ورضا نفسه وزنة عرشه ومداد كلماته', count: 3 }
  ];

  const eveningDhikr = [
    { id: 4, text: 'أمسينا وأمسى الملك لله والحمد لله، لا إله إلا الله وحده لا شريك له', count: 3 },
    { id: 5, text: 'اللهم بك أمسينا وبك نحيا وبك نموت وإليك النشور', count: 3 },
    { id: 6, text: 'أعوذ بكلمات الله التامات من شر ما خلق', count: 3 }
  ];

  const [morningCounts, setMorningCounts] = useState({});
  const [eveningCounts, setEveningCounts] = useState({});
  const [counterValues, setCounterValues] = useState({
    tasbih: 0, tahmid: 0, takbir: 0, istighfar: 0
  });
  const [progress, setProgress] = useState({
    tasbih: 0, tahmid: 0, takbir: 0, istighfar: 0
  });

  useEffect(() => {
    loadSavedData();
    playBackgroundAudio();
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const loadSavedData = () => {
    const saved = localStorage.getItem('dhikr_counters');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCounterValues(parsed);
      updateProgress(parsed);
    }
    
    const savedMorning = localStorage.getItem('morning_dhikr');
    if (savedMorning) setMorningCounts(JSON.parse(savedMorning));
    
    const savedEvening = localStorage.getItem('evening_dhikr');
    if (savedEvening) setEveningCounts(JSON.parse(savedEvening));
  };

  const updateProgress = (values) => {
    setProgress({
      tasbih: (values.tasbih / dhikrItems.tasbih.target) * 100,
      tahmid: (values.tahmid / dhikrItems.tahmid.target) * 100,
      takbir: (values.takbir / dhikrItems.takbir.target) * 100,
      istighfar: (values.istighfar / dhikrItems.istighfar.target) * 100
    });
    const total = Object.values(values).reduce((a, b) => a + b, 0);
    setDailyTotal(total);
  };

  const playSound = () => {
    const audio = new Audio('data:audio/wav;base64,U3RlYWx0aCBzb3VuZA==');
    audio.play().catch(e => console.log('Audio not supported'));
    
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const handleIncrement = (type) => {
    playSound();
    const newValue = counterValues[type] + 1;
    const target = dhikrItems[type].target;
    
    if (newValue <= target) {
      const newCounters = { ...counterValues, [type]: newValue };
      setCounterValues(newCounters);
      updateProgress(newCounters);
      localStorage.setItem('dhikr_counters', JSON.stringify(newCounters));
      
      if (newValue === target) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  };

  const resetCounter = (type) => {
    const newCounters = { ...counterValues, [type]: 0 };
    setCounterValues(newCounters);
    updateProgress(newCounters);
    localStorage.setItem('dhikr_counters', JSON.stringify(newCounters));
  };

  const resetAll = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين جميع الأذكار؟')) {
      const newCounters = { tasbih: 0, tahmid: 0, takbir: 0, istighfar: 0 };
      setCounterValues(newCounters);
      updateProgress(newCounters);
      localStorage.setItem('dhikr_counters', JSON.stringify(newCounters));
    }
  };

  const updateMorningDhikr = (id, current) => {
    const newCount = current + 1;
    const dhikr = morningDhikr.find(d => d.id === id);
    if (newCount <= dhikr.count) {
      const newCounts = { ...morningCounts, [id]: newCount };
      setMorningCounts(newCounts);
      localStorage.setItem('morning_dhikr', JSON.stringify(newCounts));
      playSound();
    }
  };

  const updateEveningDhikr = (id, current) => {
    const newCount = current + 1;
    const dhikr = eveningDhikr.find(d => d.id === id);
    if (newCount <= dhikr.count) {
      const newCounts = { ...eveningCounts, [id]: newCount };
      setEveningCounts(newCounts);
      localStorage.setItem('evening_dhikr', JSON.stringify(newCounts));
      playSound();
    }
  };

  const playBackgroundAudio = () => {
    // يمكن تفعيل صوت خلفية اختياري
  };

  const shareAchievement = () => {
    const text = `📿 إنجازي اليومي في التسبيح: ${dailyTotal} تسبيحة\n\n${Object.entries(counterValues).map(([k, v]) => `${dhikrItems[k].name}: ${v}/${dhikrItems[k].target}`).join('\n')}`;
    if (navigator.share) {
      navigator.share({ title: 'إنجازي في التسبيح', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('✅ تم نسخ الإنجاز إلى الحافظة');
    }
  };

  const getProgressCircle = (percentage, color) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return { circumference, offset, color };
  };

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>📿 المسبحة الإلكترونية</div>
          <div style={{ fontSize: '12px', color: subText }}>تسبيح - تحميد - تكبير - استغفار</div>
          <a href="/" style={{ display: 'inline-block', marginTop: '8px', color: '#e0b074', textDecoration: 'none' }}>← العودة للرئيسية</a>
        </div>

        {/* إنجاز اليوم */}
        <div style={{ backgroundColor: '#e0b074', borderRadius: '16px', padding: '12px', marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#0a0f0d' }}>📊 إجمالي اليوم</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0a0f0d' }}>{dailyTotal}</div>
        </div>

        {/* العدادات الأربعة */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {Object.entries(dhikrItems).map(([key, item]) => {
            const current = counterValues[key];
            const target = item.target;
            const percent = (current / target) * 100;
            
            return (
              <div key={key} style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '16px', textAlign: 'center', border: `1px solid ${borderColor}` }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: textColor }}>{item.name}</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: item.color, margin: '8px 0' }}>{current}</div>
                <div style={{ fontSize: '11px', color: subText }}>/ {target}</div>
                
                {/* شريط التقدم الدائري البسيط */}
                <div style={{ width: '100%', height: '4px', backgroundColor: darkMode ? '#2a4a3a' : '#e0e0e0', borderRadius: '2px', margin: '12px 0', overflow: 'hidden' }}>
                  <div style={{ width: `${(current / target) * 100}%`, height: '100%', backgroundColor: item.color, transition: 'width 0.3s' }}></div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button onClick={() => handleIncrement(key)} style={{ flex: 2, padding: '8px', backgroundColor: item.color, border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>➕</button>
                  <button onClick={() => resetCounter(key)} style={{ flex: 1, padding: '8px', backgroundColor: 'transparent', border: `1px solid ${borderColor}`, borderRadius: '12px', color: subText, cursor: 'pointer' }}>↺</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* تبويبات الأذكار */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[
            { id: 'tasbih', name: '📿 عداد التسبيح' },
            { id: 'morning', name: '🌅 أذكار الصباح' },
            { id: 'evening', name: '🌙 أذكار المساء' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: '10px', backgroundColor: activeTab === tab.id ? '#e0b074' : 'transparent', border: `1px solid ${borderColor}`, borderRadius: '12px', color: activeTab === tab.id ? '#0a0f0d' : textColor, cursor: 'pointer' }}>
              {tab.name}
            </button>
          ))}
        </div>

        {/* أذكار الصباح */}
        {activeTab === 'morning' && (
          <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '20px', border: `1px solid ${borderColor}` }}>
            <div style={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>🌅 أذكار الصباح</div>
            {morningDhikr.map(dhikr => {
              const current = morningCounts[dhikr.id] || 0;
              const isCompleted = current >= dhikr.count;
              return (
                <div key={dhikr.id} style={{ marginBottom: '16px', padding: '12px', backgroundColor: darkMode ? '#0a0f0d' : '#f8f9fa', borderRadius: '12px' }}>
                  <div style={{ fontSize: '13px', marginBottom: '8px' }}>{dhikr.text}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: subText }}>{current} / {dhikr.count}</span>
                    {!isCompleted && <button onClick={() => updateMorningDhikr(dhikr.id, current)} style={{ padding: '6px 16px', backgroundColor: '#10b981', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer' }}>📿 عدّ</button>}
                    {isCompleted && <span style={{ color: '#10b981' }}>✅ مكتمل</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* أذكار المساء */}
        {activeTab === 'evening' && (
          <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '20px', border: `1px solid ${borderColor}` }}>
            <div style={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>🌙 أذكار المساء</div>
            {eveningDhikr.map(dhikr => {
              const current = eveningCounts[dhikr.id] || 0;
              const isCompleted = current >= dhikr.count;
              return (
                <div key={dhikr.id} style={{ marginBottom: '16px', padding: '12px', backgroundColor: darkMode ? '#0a0f0d' : '#f8f9fa', borderRadius: '12px' }}>
                  <div style={{ fontSize: '13px', marginBottom: '8px' }}>{dhikr.text}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: subText }}>{current} / {dhikr.count}</span>
                    {!isCompleted && <button onClick={() => updateEveningDhikr(dhikr.id, current)} style={{ padding: '6px 16px', backgroundColor: '#10b981', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer' }}>📿 عدّ</button>}
                    {isCompleted && <span style={{ color: '#10b981' }}>✅ مكتمل</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button onClick={resetAll} style={{ flex: 1, padding: '12px', backgroundColor: '#dc2626', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>🔄 إعادة تعيين الكل</button>
          <button onClick={shareAchievement} style={{ flex: 1, padding: '12px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>📤 مشاركة الإنجاز</button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <div style={{ fontSize: '10px', color: subText }}>كل تسبيحة صدقة • أذكار الصباح والمساء</div>
        </div>

        {/* نافذة الاحتفال */}
        {showCelebration && (
          <div style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px', backgroundColor: '#10b981', borderRadius: '16px', padding: '16px', textAlign: 'center', color: 'white', animation: 'slideUp 0.3s ease', zIndex: 1000 }}>
            🎉 مبارك! أكملت المسبحة 🎉
            <style>{'@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }'}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasbih;
