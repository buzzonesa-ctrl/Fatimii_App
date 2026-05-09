class NotificationManager {
  static async requestPermission() {
    if (!("Notification" in window)) {
      console.log("هذا المتصفح لا يدعم الإشعارات");
      return false;
    }
    
    if (Notification.permission === "granted") {
      return true;
    }
    
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    
    return false;
  }

  static async showNotification(title, body, icon = "🕌", tag = null) {
    const hasPermission = await this.requestPermission();
    
    if (!hasPermission) {
      console.log("لا يوجد إذن للإشعارات");
      return;
    }
    
    const options = {
      body: body,
      icon: "https://cdn-icons-png.flaticon.com/512/1055/1055656.png",
      badge: "https://cdn-icons-png.flaticon.com/512/1055/1055656.png",
      tag: tag || title,
      renotify: true,
      silent: false
    };
    
    const notification = new Notification(title, options);
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    return notification;
  }

  static async checkUpcomingEvents(events, daysAhead = 3) {
    const notifiedEvents = JSON.parse(localStorage.getItem('notified_events') || '[]');
    const now = new Date();
    
    for (const event of events) {
      // حساب التاريخ التقريبي للمناسبة
      const eventDate = this.calculateEventDate(event.month, event.day);
      const daysDiff = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 0 && daysDiff <= daysAhead && !notifiedEvents.includes(event.name)) {
        let notificationTitle = `🕌 ${event.name}`;
        let notificationBody = `باقي ${daysDiff} يوم${daysDiff !== 1 ? 'اً' : ''} على ${event.name}`;
        
        if (daysDiff === 0) {
          notificationBody = `اليوم هو ${event.name}`;
        } else if (daysDiff === 1) {
          notificationBody = `غداً هو ${event.name}`;
        }
        
        await this.showNotification(notificationTitle, notificationBody);
        
        // حفظ المناسبة لإشعارها مرة واحدة
        notifiedEvents.push(event.name);
        localStorage.setItem('notified_events', JSON.stringify(notifiedEvents));
      }
    }
  }
  
  static calculateEventDate(month, day) {
    // تاريخ تقريبي (سنحسّنه لاحقاً)
    const now = new Date();
    let eventDate = new Date(now.getFullYear(), month - 1, day);
    
    if (eventDate < now) {
      eventDate = new Date(now.getFullYear() + 1, month - 1, day);
    }
    
    return eventDate;
  }
  
  static resetNotifications() {
    localStorage.removeItem('notified_events');
    console.log("تمت إعادة تعيين الإشعارات");
  }
}

export default NotificationManager;
