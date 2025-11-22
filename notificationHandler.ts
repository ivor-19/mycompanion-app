import * as Notifications from 'expo-notifications';

console.log('==========================================');
console.log('🚀 notificationHandler.ts LOADING - ' + new Date().toISOString());
console.log('==========================================');

// CRITICAL: Set the handler SYNCHRONOUSLY at module load
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    console.log('==========================================');
    console.log('🔔 HANDLER FIRED - ' + new Date().toISOString());
    console.log('==========================================');
    
    const data = notification.request.content.data;
    console.log('📦 Raw notification data:', JSON.stringify(data, null, 2));
    
    // Parse selectedDays
    let selectedDays: number[] = [];
    
    try {
      if (data?.selectedDays) {
        if (typeof data.selectedDays === 'string') {
          selectedDays = JSON.parse(data.selectedDays);
          console.log('✅ Parsed selectedDays from string:', selectedDays);
        } else if (Array.isArray(data.selectedDays)) {
          selectedDays = data.selectedDays;
          console.log('✅ Using array selectedDays:', selectedDays);
        }
      }
      
      console.log('🔍 Final selectedDays:', selectedDays);
      console.log('🔍 Array length:', selectedDays.length);
      
    } catch (e) {
      console.error('❌ Failed to parse selectedDays:', e);
      // On error, show the notification
      console.log('⚠️ Showing notification due to parse error');
      return {
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      };
    }
    
    // ALWAYS log the day check - this is critical
    const today = new Date().getDay();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    console.log('==========================================');
    console.log(`📆 TODAY IS: ${today} (${dayNames[today]})`);
    console.log('==========================================');
    
    // If no day selection or all 7 days selected, show every day
    if (!selectedDays || selectedDays.length === 0 || selectedDays.length === 7) {
      console.log('📅 No day filter - showing notification');
      console.log('✅✅✅ SHOWING NOTIFICATION (ALL DAYS)');
      return {
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      };
    }
    
    // Check if today is in selected days
    console.log('📋 Selected days:', selectedDays.map(d => `${d}=${dayNames[d]}`).join(', '));
    
    const shouldShow = selectedDays.includes(today);
    console.log(`🔍 Is ${today} in [${selectedDays.join(', ')}]? ${shouldShow}`);
    
    if (shouldShow) {
      console.log('==========================================');
      console.log('✅✅✅ SHOWING NOTIFICATION');
      console.log('==========================================');
    } else {
      console.log('==========================================');
      console.log('❌❌❌ HIDING NOTIFICATION');
      console.log('==========================================');
    }
    
    return {
      shouldPlaySound: shouldShow,
      shouldSetBadge: false,
      shouldShowBanner: shouldShow,
      shouldShowList: shouldShow,
    };
  },
});

console.log('✅✅✅ Notification handler CONFIGURED - ' + new Date().toISOString());

export { };
