import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const WeatherPrayer = () => {
  const [weather, setWeather] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null, city: 'جاري التحديد...' });
  const { darkMode } = useTheme();

  const bgColor = darkMode ? '#0a0f0d' : '#f0f4f8';
  const cardBg = darkMode ? '#1a2a24' : '#ffffff';
  const textColor = darkMode ? '#d4f1d9' : '#1a2a24';
  const subText = darkMode ? '#8aa899' : '#5a7a6a';
  const borderColor = darkMode ? '#2a4a3a' : '#e0e0e0';

  const API_KEY = 'c29170897e5b502384ab462925817268';

  // الحصول على موقع المستخدم
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(prev => ({ ...prev, lat: latitude, lng: longitude }));
        await Promise.all([
          fetchWeather(latitude, longitude),
          fetchPrayerTimes(latitude, longitude),
          fetchCityName(latitude, longitude)
        ]);
      },
      (err) => {
        setError('الرجاء السماح بتحديد الموقع');
        setLoading(false);
      }
    );
  };

  // جلب بيانات الطقس
  const fetchWeather = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=ar&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeather({
          temp: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          condition: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        });
      }
    } catch (err) {
      console.error('Weather error:', err);
    }
  };

  // جلب أوقات الصلاة من AlAdhan API
  const fetchPrayerTimes = async (lat, lng) => {
    try {
      const date = new Date();
      const timestamp = Math.floor(date.getTime() / 1000);
      
      // استخدام طريقة أم القرى (method=4) للحرم المكي
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=4`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        const timings = data.data.timings;
        setPrayerTimes({
          Fajr: timings.Fajr,
          Sunrise: timings.Sunrise,
          Dhuhr: timings.Dhuhr,
          Asr: timings.Asr,
          Maghrib: timings.Maghrib,
          Isha: timings.Isha
        });
        calculateNextPrayer(timings);
      }
    } catch (err) {
      console.error('Prayer times error:', err);
    }
  };

  // حساب أقرب وقت صلاة
  const calculateNextPrayer = (timings) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
      { name: 'الفجر', time: timings.Fajr },
      { name: 'الظهر', time: timings.Dhuhr },
      { name: 'العصر', time: timings.Asr },
      { name: 'المغرب', time: timings.Maghrib },
      { name: 'العشاء', time: timings.Isha }
    ];
    
    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      if (prayerMinutes > currentTime) {
        setNextPrayer(prayer);
        return;
      }
    }
    // إذا لم يتبقى صلاة اليوم، نعرض الفجر للغد
    setNextPrayer({ name: 'الفجر', time: timings.Fajr, isTomorrow: true });
  };

  // جلب اسم المدينة
  const fetchCityName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.length > 0) {
        setLocation(prev => ({ ...prev, city: data[0].name }));
      }
    } catch (err) {
      console.error('City error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  if (loading) {
    return (
      <div style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🌤️</div>
          <div>جاري تحميل بيانات الطقس وأوقات الصلاة...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <div style={{ color: '#dc2626', textAlign: 'center' }}>{error}</div>
        <button onClick={getUserLocation} style={{ marginTop: '16px', padding: '8px 24px', backgroundColor: '#e0b074', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>🔄 إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', direction: 'rtl', padding: '16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>🌤️ الطقس وأوقات الصلاة</div>
          <div style={{ fontSize: '12px', color: subText, marginTop: '4px' }}>أوقات دقيقة حسب موقعك الجغرافي</div>
          <a href="/" style={{ display: 'inline-block', marginTop: '8px', color: '#e0b074', textDecoration: 'none' }}>← العودة للرئيسية</a>
        </div>

        {/* بطاقة الطقس */}
        <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '20px', marginBottom: '20px', textAlign: 'center', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor }}>{location.city}</div>
          {weather && (
            <>
              <img src={weather.icon} alt={weather.condition} style={{ width: '80px', margin: '10px 0' }} />
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#e0b074' }}>{weather.temp}°C</div>
              <div style={{ fontSize: '16px', color: subText }}>{weather.condition}</div>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
                <div><div>💧</div><div>{weather.humidity}%</div><div style={{ fontSize: '10px' }}>الرطوبة</div></div>
                <div><div>🌬️</div><div>{weather.windSpeed} كم/س</div><div style={{ fontSize: '10px' }}>الرياح</div></div>
                <div><div>🌡️</div><div>كـ {weather.feelsLike}°</div><div style={{ fontSize: '10px' }}>يشعر كـ</div></div>
              </div>
            </>
          )}
        </div>

        {/* الصلاة القادمة */}
        {nextPrayer && (
          <div style={{ backgroundColor: '#e0b074', borderRadius: '20px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#0a0f0d', marginBottom: '4px' }}>🕌 الصلاة القادمة</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0a0f0d', marginBottom: '4px' }}>{nextPrayer.name}</div>
            <div style={{ fontSize: '20px', color: '#0a0f0d' }}>{nextPrayer.time}</div>
            {nextPrayer.isTomorrow && <div style={{ fontSize: '12px', color: '#0a0f0d' }}>(غداً)</div>}
          </div>
        )}

        {/* أوقات الصلاة الكاملة */}
        {prayerTimes && (
          <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '20px', border: `1px solid ${borderColor}` }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', color: textColor }}>🕌 أوقات الصلاة (بتوقيت مكة)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${borderColor}` }}>
                <span style={{ color: textColor }}>الفجر</span>
                <span style={{ color: '#e0b074', fontFamily: 'monospace' }}>{prayerTimes.Fajr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${borderColor}` }}>
                <span style={{ color: textColor }}>الشروق</span>
                <span style={{ color: '#e0b074', fontFamily: 'monospace' }}>{prayerTimes.Sunrise}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${borderColor}` }}>
                <span style={{ color: textColor }}>الظهر</span>
                <span style={{ color: '#e0b074', fontFamily: 'monospace' }}>{prayerTimes.Dhuhr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${borderColor}` }}>
                <span style={{ color: textColor }}>العصر</span>
                <span style={{ color: '#e0b074', fontFamily: 'monospace' }}>{prayerTimes.Asr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${borderColor}` }}>
                <span style={{ color: textColor }}>المغرب</span>
                <span style={{ color: '#e0b074', fontFamily: 'monospace' }}>{prayerTimes.Maghrib}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: textColor }}>العشاء</span>
                <span style={{ color: '#e0b074', fontFamily: 'monospace' }}>{prayerTimes.Isha}</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <div style={{ fontSize: '10px', color: subText }}>بيانات الطقس: OpenWeatherMap • أوقات الصلاة: AlAdhan API (طريقة أم القرى)</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPrayer;
