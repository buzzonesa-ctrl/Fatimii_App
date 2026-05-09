import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Tasbih from './components/Tasbih';
import MonthView from './pages/MonthView/MonthView';
import EventsList from './pages/Events/EventsList';
import Settings from './pages/Settings/Settings';
import QiblaCompass from './pages/QiblaCompass/QiblaCompass';
import WeatherPrayer from './pages/WeatherPrayer/WeatherPrayer';
import DailyQuran from './pages/DailyQuran/DailyQuran';
import BusinessDirectory from './pages/BusinessDirectory/BusinessDirectory';
import EmergencyServices from './pages/EmergencyServices/EmergencyServices';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import SocialObservatory from './pages/SocialObservatory/SocialObservatory';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import Volunteer from './pages/Volunteer/Volunteer';

function App() {
  const path = window.location.pathname;
  
  const routes = {
    '/': Home,
    '/tasbih': Tasbih,
    '/month': MonthView,
    '/events': EventsList,
    '/settings': Settings,
    '/qibla': QiblaCompass,
    '/weather': WeatherPrayer,
    '/quran': DailyQuran,
    '/business': BusinessDirectory,
    '/emergency': EmergencyServices,
    '/admin': AdminPanel,
    '/observatory': SocialObservatory,
    '/dashboard': UserDashboard,
    '/volunteer': Volunteer
  };
  
  const PageComponent = routes[path] || Home;
  
  return (
    <ThemeProvider>
      <PageComponent />
    </ThemeProvider>
  );
}

export default App;

