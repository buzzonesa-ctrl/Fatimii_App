import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const UserDashboard = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    name: 'محمد المستخدم',
    email: 'user@example.com',
    phone: '+966 5XXXXXXXX',
    joinDate: '2026-01-15',
    reportsCount: 12,
    volunteerHours: 48,
    level: 'نشط',
    achievements: ['أول تسبيح', 'أول بلاغ', 'ختم القرآن']
  });

  const [userReports, setUserReports] = useState([
    { id: 1, type: 'حوادث', description: 'حادث مروري تقاطع الملك فهد', status: 'completed', date: '2026-05-01' },
    { id: 2, type: 'طبية', description: 'حالة إغماء في المركز التجاري', status: 'processing', date: '2026-05-05' },
    { id: 3, type: 'بلاغ عام', description: 'أضواء معطلة في الشارع الرئيسي', status: 'pending', date: '2026-05-07' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'تم معالجة بلاغك رقم #2', read: false, date: '2026-05-08' },
    { id: 2, message: 'مرحباً بك في التطبيق! أكمل ملفك الشخصي', read: true, date: '2026-01-15' }
  ]);

  const bgColor = darkMode ? '#0a0f0d' : '#f0f4f8';
  const cardBg = darkMode ? '#1a2a24' : '#ffffff';
  const textColor = darkMode ? '#d4f1d9' : '#1a2a24';
  const subText = darkMode ? '#8aa899' : '#5a7a6a';
  const borderColor = darkMode ? '#2a4a3a' : '#e0e0e0';

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return { text: '⏳ قيد الانتظار', color: '#e0b074' };
      case 'processing': return { text: '🔄 جاري المعالجة', color: '#3b82f6' };
      case 'completed': return { text: '✅ مكتمل', color: '#10b981' };
      default: return { text: status, color: '#6b7280' };
    }
  };

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>👤 لوحة التحكم</div>
          <div style={{ fontSize: '12px', color: subText, marginTop: '4px' }}>ملفك الشخصي ونشاطاتك</div>
          <a href="/" style={{ display: 'inline-block', marginTop: '8px', color: '#e0b074', textDecoration: 'none' }}>← العودة للرئيسية</a>
        </div>

        {/* تبويبات التنقل */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', backgroundColor: cardBg, borderRadius: '12px', padding: '4px', flexWrap: 'wrap' }}>
          {[
            { id: 'profile', name: '👤 الملف الشخصي' },
            { id: 'reports', name: '📋 بلاغاتي' },
            { id: 'notifications', name: `🔔 الإشعارات (${notifications.filter(n => !n.read).length})` },
            { id: 'achievements', name: '🏆 الإنجازات' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#e0b074' : 'transparent',
                color: activeTab === tab.id ? '#0a0f0d' : textColor,
                fontSize: '13px'
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* المحتوى حسب التبويب النشط */}
        
        {/* التبويب: الملف الشخصي */}
        {activeTab === 'profile' && (
          <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '20px', border: `1px solid ${borderColor}` }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>👤</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: textColor }}>{userData.name}</div>
              <div style={{ fontSize: '13px', color: subText }}>عضو منذ {userData.joinDate}</div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', padding: '16px', backgroundColor: darkMode ? '#0a0f0d' : '#f8f9fa', borderRadius: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e0b074' }}>{userData.reportsCount}</div>
                <div style={{ fontSize: '11px', color: subText }}>بلاغ</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e0b074' }}>{userData.volunteerHours}</div>
                <div style={{ fontSize: '11px', color: subText }}>ساعة تطوع</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{userData.level}</div>
                <div style={{ fontSize: '11px', color: subText }}>المستوى</div>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: textColor, marginBottom: '8px' }}>📧 البريد الإلكتروني</div>
              <div style={{ fontSize: '13px', color: subText }}>{userData.email}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: textColor, marginBottom: '8px' }}>📞 رقم الجوال</div>
              <div style={{ fontSize: '13px', color: subText }}>{userData.phone}</div>
            </div>
            <button style={{ width: '100%', padding: '12px', backgroundColor: '#e0b074', border: 'none', borderRadius: '12px', color: '#0a0f0d', fontWeight: 'bold', cursor: 'pointer' }}>
              ✏️ تعديل الملف الشخصي
            </button>
          </div>
        )}

        {/* التبويب: بلاغاتي */}
        {activeTab === 'reports' && (
          <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '20px', border: `1px solid ${borderColor}` }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: textColor, marginBottom: '16px', textAlign: 'center' }}>
              📋 بلاغاتي السابقة
            </div>
            {userReports.map(report => (
              <div key={report.id} style={{ marginBottom: '12px', padding: '12px', backgroundColor: darkMode ? '#0a0f0d' : '#f8f9fa', borderRadius: '12px', borderRight: `3px solid ${getStatusBadge(report.status).color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: textColor }}>{report.type}</div>
                  <div style={{ fontSize: '11px', color: getStatusBadge(report.status).color }}>{getStatusBadge(report.status).text}</div>
                </div>
                <div style={{ fontSize: '12px', color: subText, marginBottom: '4px' }}>{report.description}</div>
                <div style={{ fontSize: '10px', color: subText }}>📅 {report.date}</div>
              </div>
            ))}
          </div>
        )}

        {/* التبويب: الإشعارات */}
        {activeTab === 'notifications' && (
          <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '20px', border: `1px solid ${borderColor}` }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: textColor, marginBottom: '16px', textAlign: 'center' }}>
              🔔 الإشعارات
            </div>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: subText }}>لا توجد إشعارات</div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} style={{ marginBottom: '12px', padding: '12px', backgroundColor: darkMode ? '#0a0f0d' : '#f8f9fa', borderRadius: '12px', opacity: notif.read ? 0.7 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '13px', color: textColor }}>{notif.message}</div>
                    {!notif.read && (
                      <button onClick={() => markAsRead(notif.id)} style={{ padding: '4px 8px', backgroundColor: '#e0b074', border: 'none', borderRadius: '8px', color: '#0a0f0d', fontSize: '10px', cursor: 'pointer' }}>قرأت</button>
                    )}
                  </div>
                  <div style={{ fontSize: '10px', color: subText, marginTop: '4px' }}>{notif.date}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* التبويب: الإنجازات */}
        {activeTab === 'achievements' && (
          <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '20px', border: `1px solid ${borderColor}` }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: textColor, marginBottom: '16px', textAlign: 'center' }}>
              🏆 إنجازاتي
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: darkMode ? '#0a0f0d' : '#f8f9fa', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>📿</span>
                <div><div style={{ fontWeight: 'bold', color: textColor }}>أول تسبيح</div><div style={{ fontSize: '11px', color: subText }}>أكملت تسبيحتك الأولى</div></div>
              </div>
              <div style={{ padding: '12px', backgroundColor: darkMode ? '#0a0f0d' : '#f8f9fa', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>📋</span>
                <div><div style={{ fontWeight: 'bold', color: textColor }}>أول بلاغ</div><div style={{ fontSize: '11px', color: subText }}>قدمت أول بلاغ عبر التطبيق</div></div>
              </div>
              <div style={{ padding: '12px', backgroundColor: darkMode ? '#0a0f0d' : '#f8f9fa', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>🕋</span>
                <div><div style={{ fontWeight: 'bold', color: textColor }}>ختم القرآن</div><div style={{ fontSize: '11px', color: subText }}>أكملت ختم القرآن الكريم</div></div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserDashboard;
