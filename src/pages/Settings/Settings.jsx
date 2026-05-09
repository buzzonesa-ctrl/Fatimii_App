import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import NotificationManager from '../../utils/NotificationManager';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [language, setLanguage] = useState(i18n.language);
  const [fontSize, setFontSize] = useState('medium');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const bgColor = darkMode ? '#0a0f0d' : '#f0f4f8';
  const cardBg = darkMode ? '#1a2a24' : '#ffffff';
  const textColor = darkMode ? '#d4f1d9' : '#1a2a24';
  const subText = darkMode ? '#8aa899' : '#5a7a6a';
  const borderColor = darkMode ? '#2a4a3a' : '#e0e0e0';

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications_enabled');
    const savedFontSize = localStorage.getItem('font_size');
    if (savedNotifications === 'true') setNotificationsEnabled(true);
    if (savedFontSize) setFontSize(savedFontSize);
    applyFontSize(savedFontSize || 'medium');
  }, []);

  const applyFontSize = (size) => {
    const root = document.documentElement;
    switch(size) {
      case 'small': root.style.fontSize = '14px'; break;
      case 'large': root.style.fontSize = '18px'; break;
      default: root.style.fontSize = '16px';
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    window.location.reload();
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await NotificationManager.requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
        localStorage.setItem('notifications_enabled', 'true');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notifications_enabled', 'false');
    }
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem('font_size', size);
    applyFontSize(size);
  };

  const resetAllSettings = () => {
    localStorage.removeItem('notifications_enabled');
    localStorage.removeItem('font_size');
    localStorage.removeItem('darkMode');
    localStorage.removeItem('tasbih_total');
    localStorage.removeItem('i18nextLng');
    setNotificationsEnabled(false);
    setFontSize('medium');
    applyFontSize('medium');
    changeLanguage('ar');
    if (!darkMode) toggleDarkMode();
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: textColor }}>⚙️ {t('settings.title')}</div>
          <a href="/" style={{ display: 'inline-block', marginTop: '8px', color: '#e0b074', textDecoration: 'none' }}>← {t('nav.home')}</a>
        </div>

        {/* القائمة المنسدلة للغة */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '20px', marginBottom: '16px', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '16px' }}>🌐 {t('settings.language')}</div>
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: darkMode ? '#0a0f0d' : '#fff',
              color: textColor,
              border: `1px solid ${borderColor}`,
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            <option value="ar">🇸🇦 العربية</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>

        {/* Dark Mode */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '20px', marginBottom: '16px', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '16px' }}>🌓 {t('settings.darkMode')}</div>
          <button onClick={toggleDarkMode} style={{ padding: '8px 20px', backgroundColor: darkMode ? '#e0b074' : '#2a4a3a', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer' }}>{darkMode ? '☀️' : '🌙'}</button>
        </div>

        {/* Notifications */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '20px', marginBottom: '16px', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '16px' }}>🔔 {t('settings.notifications')}</div>
          <button onClick={handleToggleNotifications} style={{ padding: '8px 20px', backgroundColor: notificationsEnabled ? '#dc2626' : '#10b981', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer' }}>{notificationsEnabled ? '🔕' : '🔔'}</button>
        </div>

        {/* Font Size */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '20px', marginBottom: '16px', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '16px' }}>🔤 {t('settings.fontSize')}</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => handleFontSizeChange('small')} style={{ flex: 1, padding: '10px', backgroundColor: fontSize === 'small' ? '#e0b074' : 'transparent', border: `1px solid ${borderColor}`, borderRadius: '8px', cursor: 'pointer' }}>صغير</button>
            <button onClick={() => handleFontSizeChange('medium')} style={{ flex: 1, padding: '10px', backgroundColor: fontSize === 'medium' ? '#e0b074' : 'transparent', border: `1px solid ${borderColor}`, borderRadius: '8px', cursor: 'pointer' }}>متوسط</button>
            <button onClick={() => handleFontSizeChange('large')} style={{ flex: 1, padding: '10px', backgroundColor: fontSize === 'large' ? '#e0b074' : 'transparent', border: `1px solid ${borderColor}`, borderRadius: '8px', cursor: 'pointer' }}>كبير</button>
          </div>
        </div>

        {/* Reset */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '20px', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '16px' }}>🔄 {t('settings.reset')}</div>
          {!showResetConfirm ? (
            <button onClick={() => setShowResetConfirm(true)} style={{ width: '100%', padding: '12px', backgroundColor: '#dc2626', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>{t('settings.reset')}</button>
          ) : (
            <div>
              <div style={{ color: subText, marginBottom: '12px', textAlign: 'center' }}>⚠️ {t('common.confirm')}</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={resetAllSettings} style={{ flex: 1, padding: '10px', backgroundColor: '#dc2626', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>{t('common.yes')}</button>
                <button onClick={() => setShowResetConfirm(false)} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', border: `1px solid ${borderColor}`, borderRadius: '8px', color: textColor, cursor: 'pointer' }}>{t('common.no')}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
