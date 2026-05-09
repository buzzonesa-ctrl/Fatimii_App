import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('daily');
  const { darkMode } = useTheme();

  const bgColor = darkMode ? '#0a0f0d' : '#f0f4f8';
  const cardBg = darkMode ? '#1a2a24' : '#ffffff';
  const textColor = darkMode ? '#d4f1d9' : '#1a2a24';
  const subText = darkMode ? '#8aa899' : '#5a7a6a';
  const borderColor = darkMode ? '#2a4a3a' : '#e0e0e0';

  const months = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  useEffect(() => {
    fetchEvents();
    loadFavorites();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events/list');
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
        calculateTodayEvents(data.events);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTodayEvents = (allEvents) => {
    const today = 24;
    const todayMonth = 11;
    const todaysEvents = allEvents.filter(event => event.day === today && event.month === todayMonth);
    setTodayEvents(todaysEvents);
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorite_events');
    if (saved) setFavorites(JSON.parse(saved));
  };

  const toggleFavorite = (eventId) => {
    let newFavorites;
    if (favorites.includes(eventId)) {
      newFavorites = favorites.filter(id => id !== eventId);
    } else {
      newFavorites = [...favorites, eventId];
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorite_events', JSON.stringify(newFavorites));
  };

  const getImportanceColor = (importance) => {
    switch(importance) {
      case 'very_high': return '#e0b074';
      case 'high': return '#8aa899';
      default: return '#5a7a6a';
    }
  };

  const shareEvent = (event) => {
    const text = `🕌 ${event.name}\n📅 اليوم ${event.day} من ${event.month_name}\n📍 الأهمية: ${event.importance === 'very_high' ? 'عالية جداً' : event.importance === 'high' ? 'عالية' : 'متوسطة'}\n${event.note ? `📌 ${event.note}` : ''}`;
    if (navigator.share) {
      navigator.share({ title: event.name, text });
    } else {
      navigator.clipboard.writeText(text);
      alert('✅ تم نسخ المعلومات');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.includes(searchTerm) || event.month_name.includes(searchTerm);
    const matchesMonth = selectedMonth === 'all' || event.month === parseInt(selectedMonth);
    return matchesSearch && matchesMonth;
  });

  const groupedEvents = {};
  filteredEvents.forEach(event => {
    if (!groupedEvents[event.month]) {
      groupedEvents[event.month] = [];
    }
    groupedEvents[event.month].push(event);
  });

  if (loading) {
    return (
      <div style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor }}>
        جاري تحميل المناسبات...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>📅 المناسبات الإسلامية</div>
          <div style={{ fontSize: '12px', color: subText, marginTop: '4px' }}>التقويم الفاطمي • المذهب الإسماعيلي السليماني</div>
          <a href="/" style={{ display: 'inline-block', marginTop: '8px', color: '#e0b074', textDecoration: 'none' }}>← العودة للرئيسية</a>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: cardBg, borderRadius: '12px', padding: '4px' }}>
          {[
            { id: 'daily', name: '⭐ مناسبات اليوم', icon: '⭐' },
            { id: 'yearly', name: '📅 التقويم السنوي', icon: '📅' },
            { id: 'list', name: '📋 قائمة المناسبات', icon: '📋' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#e0b074' : 'transparent',
                color: activeTab === tab.id ? '#0a0f0d' : textColor,
                fontWeight: 'bold'
              }}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* تبويب مناسبات اليوم */}
        {activeTab === 'daily' && (
          <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '24px', border: `1px solid ${borderColor}`, textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>⭐ مناسبات اليوم</div>
            {todayEvents.length === 0 ? (
              <div style={{ color: subText }}>لا توجد مناسبات خاصة اليوم</div>
            ) : (
              todayEvents.map((event, idx) => (
                <div key={idx} style={{ padding: '16px', backgroundColor: darkMode ? '#0a0f0d' : '#f8f9fa', borderRadius: '12px', borderRight: `4px solid ${getImportanceColor(event.importance)}` }}>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{event.name}</div>
                  <div style={{ fontSize: '13px', color: subText, marginTop: '4px' }}>{event.note}</div>
                  <div style={{ fontSize: '12px', color: subText, marginTop: '4px' }}>اليوم {event.day} من {event.month_name}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* تبويب التقويم السنوي */}
        {activeTab === 'yearly' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {months.map((month, idx) => {
              const monthNumber = idx + 1;
              const monthEvents = groupedEvents[monthNumber] || [];
              const isExpanded = expandedMonth === monthNumber;
              return (
                <div key={idx} style={{ backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
                  <div onClick={() => setExpandedMonth(isExpanded ? null : monthNumber)} style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', backgroundColor: isExpanded ? (darkMode ? '#2a4a3a' : '#f0f4f8') : 'transparent' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: textColor }}>{month}</div>
                    <div style={{ fontSize: '12px', color: subText, marginTop: '4px' }}>{monthEvents.length} مناسبة</div>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: '12px', borderTop: `1px solid ${borderColor}` }}>
                      {monthEvents.length === 0 ? (
                        <div style={{ textAlign: 'center', color: subText, fontSize: '12px', padding: '8px' }}>لا توجد مناسبات</div>
                      ) : (
                        monthEvents.map((event, eventIdx) => (
                          <div key={eventIdx} style={{ marginBottom: '12px', padding: '10px', backgroundColor: darkMode ? '#0a0f0d' : '#f8f9fa', borderRadius: '10px', borderRight: `3px solid ${getImportanceColor(event.importance)}` }}>
                            <div style={{ fontWeight: 'bold', fontSize: '13px', color: textColor }}>{event.name}</div>
                            <div style={{ fontSize: '11px', color: subText, marginTop: '4px' }}>اليوم {event.day}</div>
                            {event.note && <div style={{ fontSize: '10px', color: '#e0b074', marginTop: '4px' }}>📌 {event.note}</div>}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* تبويب قائمة المناسبات */}
        {activeTab === 'list' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <input type="text" placeholder="🔍 ابحث عن مناسبة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: cardBg, color: textColor, border: `1px solid ${borderColor}`, marginBottom: '12px' }} />
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: cardBg, color: textColor, border: `1px solid ${borderColor}` }}>
                <option value="all">كل الشهور</option>
                {months.map((month, idx) => (<option key={idx} value={idx + 1}>{month}</option>))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(groupedEvents).map(([monthNum, monthEvents]) => (
                <div key={monthNum} style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '16px', border: `1px solid ${borderColor}` }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '12px' }}>{months[monthNum - 1]}</div>
                  {monthEvents.map((event, idx) => (
                    <div key={idx} style={{ marginBottom: '12px', padding: '10px', backgroundColor: darkMode ? '#0a0f0d' : '#f8f9fa', borderRadius: '10px', borderRight: `3px solid ${getImportanceColor(event.importance)}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 'bold', color: textColor }}>{event.name}</div>
                        <div><button onClick={() => toggleFavorite(event.id)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: favorites.includes(event.id) ? '#e0b074' : subText }}>⭐</button></div>
                      </div>
                      <div style={{ fontSize: '12px', color: subText }}>اليوم {event.day}</div>
                      {event.note && <div style={{ fontSize: '11px', color: '#e0b074', marginTop: '4px' }}>📌 {event.note}</div>}
                      <button onClick={() => shareEvent(event)} style={{ marginTop: '8px', padding: '4px 12px', backgroundColor: '#e0b074', border: 'none', borderRadius: '8px', color: '#0a0f0d', cursor: 'pointer', fontSize: '11px' }}>📤 مشاركة</button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventsList;


