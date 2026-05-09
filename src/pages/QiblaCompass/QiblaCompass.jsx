import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const QiblaCompass = () => {
  const [location, setLocation] = useState(null);
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [currentDirection, setCurrentDirection] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const { darkMode } = useTheme();

  const compassRef = useRef(null);

  const bgColor = darkMode ? '#0a0f0d' : '#f0f4f8';
  const cardBg = darkMode ? '#1a2a24' : '#ffffff';
  const textColor = darkMode ? '#d4f1d9' : '#1a2a24';
  const subText = darkMode ? '#8aa899' : '#5a7a6a';
  const borderColor = darkMode ? '#2a4a3a' : '#e0e0e0';

  // إحداثيات الكعبة المشرفة (مكة المكرمة)
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  // حساب اتجاه القبلة
  const calculateQiblaDirection = (userLat, userLng) => {
    const lat1 = userLat * Math.PI / 180;
    const lat2 = KAABA_LAT * Math.PI / 180;
    const deltaLng = (KAABA_LNG - userLng) * Math.PI / 180;

    const x = Math.sin(deltaLng) * Math.cos(lat2);
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

    let bearing = Math.atan2(x, y) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;

    return bearing;
  };

  // الحصول على اتجاه الجهاز
  const handleOrientation = (event) => {
    if (event.webkitCompassHeading !== undefined) {
      // iOS
      setCurrentDirection(event.webkitCompassHeading);
    } else if (event.alpha !== null) {
      // Android
      setCurrentDirection(360 - event.alpha);
    }
  };

  // الحصول على موقع المستخدم
  const getLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم خاصية تحديد الموقع');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        
        const direction = calculateQiblaDirection(latitude, longitude);
        setQiblaDirection(direction);
        setLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        if (err.code === 1) {
          setPermissionDenied(true);
          setError('الرجاء السماح للتطبيق بالوصول إلى موقعك');
        } else {
          setError('حدث خطأ في تحديد موقعك');
        }
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // طلب إذن المستشعرات (iOS)
  const requestSensorsPermission = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

  useEffect(() => {
    getLocation();
    requestSensorsPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // حساب الفرق بين اتجاه القبلة والاتجاه الحالي
  const getDifference = () => {
    if (!qiblaDirection) return 0;
    let diff = qiblaDirection - currentDirection;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff;
  };

  const getCompassRotation = () => {
    return -currentDirection;
  };

  const getQiblaIndicatorRotation = () => {
    return getDifference();
  };

  const handleRefresh = () => {
    getLocation();
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🧭</div>
          <div>جاري تحديد موقعك...</div>
          <div style={{ fontSize: '12px', color: subText, marginTop: '8px' }}>يرجى السماح للتطبيق بالوصول إلى الموقع</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>🧭 بوصلة القبلة</div>
            <a href="/" style={{ display: 'inline-block', marginTop: '8px', color: '#e0b074', textDecoration: 'none' }}>← العودة للرئيسية</a>
          </div>
          <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '24px', textAlign: 'center', border: `1px solid ${borderColor}` }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <div style={{ color: textColor, marginBottom: '16px' }}>{error}</div>
            {permissionDenied && (
              <div style={{ color: subText, fontSize: '12px', marginBottom: '16px' }}>
                يمكنك تفعيل الموقع يدوياً من إعدادات المتصفح أو النظام
              </div>
            )}
            <button
              onClick={handleRefresh}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e0b074',
                border: 'none',
                borderRadius: '12px',
                color: '#0a0f0d',
                cursor: 'pointer'
              }}
            >
              🔄 إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  const diff = getDifference();
  const isAligned = Math.abs(diff) < 5;

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>🧭 بوصلة القبلة</div>
          <div style={{ fontSize: '12px', color: subText, marginTop: '8px' }}>
            الموقع: {location?.lat.toFixed(4)}°, {location?.lng.toFixed(4)}°
          </div>
          <a href="/" style={{ display: 'inline-block', marginTop: '16px', color: '#e0b074', textDecoration: 'none' }}>← العودة للرئيسية</a>
        </div>

        {/* البوصلة */}
        <div style={{ 
          backgroundColor: cardBg, 
          borderRadius: '50%', 
          padding: '20px', 
          marginBottom: '24px',
          border: `4px solid ${borderColor}`,
          position: 'relative',
          width: '280px',
          height: '280px',
          margin: '0 auto 24px auto'
        }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'relative',
              transform: `rotate(${getCompassRotation()}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {/* خلفية البوصلة */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* النقاط الأساسية */}
                <div style={{ position: 'absolute', top: '0%', left: '50%', transform: 'translate(-50%, -50%)', color: '#e0b074', fontWeight: 'bold' }}>ش</div>
                <div style={{ position: 'absolute', bottom: '0%', left: '50%', transform: 'translate(-50%, 50%)', color: subText }}>ج</div>
                <div style={{ position: 'absolute', left: '0%', top: '50%', transform: 'translate(-50%, -50%)', color: subText }}>غ</div>
                <div style={{ position: 'absolute', right: '0%', top: '50%', transform: 'translate(50%, -50%)', color: subText }}>ش</div>
                
                {/* الدوائر المتدرجة */}
                <div style={{ position: 'absolute', inset: '10%', border: '1px solid rgba(224,176,116,0.3)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', inset: '20%', border: '1px solid rgba(224,176,116,0.2)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', inset: '30%', border: '1px solid rgba(224,176,116,0.15)', borderRadius: '50%' }}></div>
                
                {/* سهم الاتجاه الحالي */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '60px solid #e0b074', position: 'relative', top: '-30px' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* مؤشر إبرة القبلة */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '4px',
              height: '120px',
              backgroundColor: isAligned ? '#10b981' : '#dc2626',
              transform: `translate(-50%, -50%) rotate(${getQiblaIndicatorRotation()}deg)`,
              transformOrigin: 'center',
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div style={{ position: 'absolute', top: '-8px', left: '-6px', width: '16px', height: '16px', backgroundColor: '#e0b074', borderRadius: '50%' }}></div>
          </div>
        </div>

        {/* معلومات الاتجاه */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '20px', marginBottom: '16px', border: `1px solid ${borderColor}`, textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: subText, marginBottom: '8px' }}>اتجاه القبلة</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e0b074', marginBottom: '8px' }}>
            {Math.round(qiblaDirection)}°
          </div>
          <div style={{ fontSize: '12px', color: subText }}>
            {isAligned ? (
              <span style={{ color: '#10b981' }}>✅ أنت في الاتجاه الصحيح للقبلة</span>
            ) : (
              <span>اتجه {Math.abs(Math.round(diff))}° إلى {diff > 0 ? 'اليسار' : 'اليمين'}</span>
            )}
          </div>
        </div>

        {/* معلومات إضافية */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, backgroundColor: cardBg, borderRadius: '16px', padding: '16px', textAlign: 'center', border: `1px solid ${borderColor}` }}>
            <div style={{ fontSize: '12px', color: subText }}>{Math.round(currentDirection)}°</div>
            <div style={{ fontSize: '10px', color: subText }}>جهتك الحالية</div>
          </div>
          <div style={{ flex: 1, backgroundColor: cardBg, borderRadius: '16px', padding: '16px', textAlign: 'center', border: `1px solid ${borderColor}` }}>
            <button
              onClick={handleRefresh}
              style={{
                background: 'none',
                border: 'none',
                color: '#e0b074',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              🔄
            </button>
            <div style={{ fontSize: '10px', color: subText }}>تحديث</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <div style={{ fontSize: '11px', color: subText }}>قد تحتاج إلى تحريك الجهاز للحصول على قراءة دقيقة</div>
        </div>
      </div>
    </div>
  );
};

export default QiblaCompass;
