import GBackground from "@/components/custom/GBackground";
import ReminderEntryModal from "@/components/custom/modal/ReminderEntryModal";
import { getRandomAffirmation } from "@/helper/affirmation";
import { FONT } from "@/lib/scale";
import { useColorModeStore } from "@/stores/colorModeStore";
import { useMoodStore } from "@/stores/moodStore";
import { useReminderStore } from "@/stores/reminderStore";
import { useThemeStore } from "@/stores/themeStore";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from 'expo-notifications';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { scale } from "react-native-size-matters";

// Mood type from store
export type Mood = {
  id: string;
  moodText: string;
  date: string;
  day: string;
  time: string;
  note: string;
  images?: string[];
};

// Helper functions for mood analytics
const calculateMoodStats = (moods: Mood[]) => {
  if (!moods || moods.length === 0)
    return { sessions: 0, wellnessScore: 0, weeklyProgress: 0 };

  // Calculate sessions (total mood entries)
  const sessions = moods.length;

  // Calculate wellness score based on mood types
  const moodScores: Record<string, number> = { Excited: 5, Happy: 4, Good: 4, Neutral: 3, Sad: 2, Anxious: 2, Angry: 1, Depressed: 1, };

  const totalScore = moods.reduce((sum, mood) => {
    return sum + (moodScores[mood.moodText] || 3);
  }, 0);

  const wellnessScore = Math.round((totalScore / (sessions * 5)) * 100);

  // Calculate weekly progress (assuming goal is 10 sessions per week)
  const weeklyGoal = 10;
  const weeklyProgress = Math.min((sessions / weeklyGoal) * 100, 100);

  return { sessions, wellnessScore, weeklyProgress };
};

// Get recent mood trend
const getRecentMoodTrend = (moods: Mood[]): string => {
  if (!moods || moods.length === 0) return "No data";

  const recent = moods.slice(0, 3); // Last 3 entries
  const moodValues: Record<string, number> = { Excited: 5, Happy: 4, Good: 4, Neutral: 3, Sad: 2, Anxious: 2, Angry: 1, Depressed: 1, };

  const avgMood =
    recent.reduce((sum, mood) => sum + (moodValues[mood.moodText] || 3), 0) /
    recent.length;

  if (avgMood >= 4) return "Great";
  if (avgMood >= 3.5) return "Good";
  if (avgMood >= 2.5) return "Fair";
  return "Needs Care";
};

// Calculate streak (consecutive days with entries)
const calculateStreak = (moods: Mood[]): number => {
  if (!moods || moods.length === 0) return 0;

  const dates = [...new Set(moods.map((mood) => mood.date))].sort();
  let streak = 1;

  for (let i = dates.length - 1; i > 0; i--) {
    const current = new Date(dates[i]);
    const previous = new Date(dates[i - 1]);
    const diffTime = Math.abs(current.getTime() - previous.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

// Get current mood for display
const getCurrentMood = (moods: Mood[]): string => {
  if (!moods || moods.length === 0) return "No data";
  return moods[0]?.moodText || "No data";
};

export default function Home() {
  const { moods } = useMoodStore()
  const affirmation = getRandomAffirmation()
  const { theme } = useThemeStore()
  const { mode } = useColorModeStore()
  const { reminders, deleteReminder } = useReminderStore()
  const [reminderOpen, setReminderOpen] = useState(false)

  // Calculate stats from mood data
  const { sessions, wellnessScore, weeklyProgress } = calculateMoodStats(moods);
  const currentStreak = calculateStreak(moods);
  const recentTrend = getRecentMoodTrend(moods);
  const currentMood = getCurrentMood(moods);

  const quickActions = [
    { icon: "emotion-happy-line", title: "Mood Check", color: theme.accent, route: '/daily-mood' },
    { icon: "map-pin-line", title: "Find a Clinic", color: theme.accent, route: '/hotlines' },
    { icon: "line-chart-fill", title: "Mood Insights", color: theme.accent, route: '/monthly-mood' },
    { icon: "phone-fill", title: "Hotlines", color: theme.accent, route: '/hotlines' },
  ];

  const resources = [
    { title: "5min Meditation", subtitle: "Quick relaxation", color: "#E8F5FF" },
    { title: "Anxiety Relief", subtitle: "Coping strategies", color: "#FFF2E8" },
    { title: "Sleep Stories", subtitle: "Better rest", color: "#F0F8E8" },
    { title: "Daily Tips", subtitle: "Mental wellness", color: "#F8E8FF" },
  ];

  const formatDays = (days: string[]) => {
    if(days.length === 7) return 'Everyday';
    if(days.length === 5 && !days.includes('Sat') && !days.includes('Sun')) return 'Weekdays';
    if(days.length === 2 && days.includes('Sat') && days.includes('Sun')) return 'Weekends';
    return(days.join(', '))
  }

  const [scheduledNotifications, setScheduledNotifications] = useState<any[]>([]);

  // Fetch scheduled notifications
  const fetchScheduledNotifications = async () => {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    setScheduledNotifications(scheduled);
  };

  useEffect(() => {
    fetchScheduledNotifications();
    
    // Optionally refresh the list periodically or when the screen focuses
    const interval = setInterval(fetchScheduledNotifications, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="min-h-screen"> 
      <ScrollView style={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <GBackground>
          <View className="min-h-screen items-center w-full gap-4 mb-32">
            {/* Header Section */}
            <View className="rounded-b-[30px] px-6 pb-6 flex-col gap-4 w-full" style={{backgroundColor: mode.main, elevation: 4, shadowColor: 'gray', paddingTop: scale(28)}}>
              <View className="flex-row justify-between">
                <View className="justify-center">
                  <Text className="font-cb" style={{fontSize: FONT.lg, color: theme.accent}}>MY COMPANION</Text>
                  <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: mode.textSecondary}}>A Mobile-Based Psychological Support System</Text>
                </View>
                <View className="flex-row gap-2 items-center">
                  <RemixIcon name="shield-check-fill" size={16} color={theme.accent}/>
                  <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: mode.textSecondary}}>Secure & Private</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-4">
                <View className="h-16 w-16" style={{borderRadius: '100%'}}>
                  <Image source={require('../../assets/images/bot/head-nobg.png')} contentFit="contain" style={{width: '100%', height: '100%', borderRadius: 60}}/> 
                </View>
                <View>
                  <Text className="font-funnel_semi" style={{color: mode.textPrimary}}>Welcome Back!</Text>
                  <Text className="font-funnel_regular" style={{color: mode.textPrimary}}>How are you feeling today?</Text>
                </View>
              </View>
            </View>

            {/* Main Chat Card */}
            <LinearGradient
              colors={theme.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 30 }}
              className="h-72 p-6 w-[95%] flex-row items-center"
            >
              <View className="w-[40%] h-full flex items-center justify-end ">
                <Image
                  source={require('../../assets/images/bot/full-body.png')}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </View>
              <View className="w-[60%] flex-col justify-center items-end gap-4 ">
                <View className="flex-col gap-2"> 
                  <Text className="font-cb text-white leading-7 text-right" style={{fontSize: FONT.xl}}>MEET EUNOIA YOUR BEST COMPANION</Text>
                  <Text className="font-funnel_regular text-right text-white  leading-5 opacity-90" style={{fontSize: FONT.xs}}>
                    Begin your journey to better mental wellness today
                  </Text>
                </View>
                {/* <Button text="Chat Now" style="h-12 w-[8em] bg-[#fff]" fontStyle="text-sm text-black" onPress={() => router.push('/home')}/> */}
              </View>
            </LinearGradient>

            {/* Quick Actions */}
            <View className="w-[95%] px-2">
              <Text className="font-funnel_semi mb-3" style={{fontSize: FONT.md, color: mode.textPrimary}}>Quick Actions</Text>
              <View className="flex-row justify-between">
                {quickActions.map((action, index) => (
                  <TouchableOpacity key={index} onPress={() => router.push(action?.route as any)} className="rounded-3xl p-4 items-center flex-1 mx-1" style={{backgroundColor: mode.card, elevation: 2, shadowColor: 'gray'}} activeOpacity={0.7}>
                    <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{backgroundColor: action.color + '20'}}>
                      <RemixIcon name={action.icon as any} size={scale(18)} color={action.color}/>
                    </View>
                    <Text className="font-funnel_regular text-center" style={{fontSize: FONT.xxs, color: mode.textPrimary}}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Today's Insights */}
            <View className="w-[95%] px-2">
              <Text className="font-funnel_semi mb-3" style={{fontSize: FONT.md, color: mode.textPrimary}}>Today's Insights</Text>
              <View className="rounded-3xl p-5" style={{backgroundColor: mode.card, elevation: 2, shadowColor: 'gray'}}>
                <View className="flex-row items-center gap-3 mb-4">
                  <RemixIcon name="lightbulb-line" size={scale(20)} color={theme.accent}/>
                  <Text className="font-funnel_semi flex-1" style={{fontSize: FONT.sm, color: mode.textPrimary}}>Daily Affirmation</Text>
                </View>
                <Text className="font-funnel_regular italic mb-4" style={{fontSize: FONT.xs, color: mode.textSecondary}}>{affirmation}</Text>
                <View className="flex-row justify-between">
                  <View className="flex-row items-center gap-2">
                    <RemixIcon name="fire-line" size={scale(14)} color={theme.secondary}/>
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: mode.textSecondary}}>{currentStreak}-day streak</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <RemixIcon name="heart-line" size={scale(14)} color={theme.secondary}/>
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: mode.textSecondary}}>Mood: {currentMood}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="w-[95%] px-2">
              <Text className="font-funnel_semi mb-3" style={{fontSize: FONT.md, color: mode.textPrimary}}>Reminder Settings</Text>
              
              {/* Scheduled Notifications List */}
              <View className="rounded-3xl mb-3 overflow-hidden" style={{backgroundColor: mode.card, elevation: 2, shadowColor: 'gray'}}>
                {scheduledNotifications.length !== 0 ? (
                  <>
                    {scheduledNotifications.map((notif, index) => {
                      const trigger = notif.trigger as any;
                      let timeDisplay = '';
                      
                      if (trigger.type === "daily") {
                        const h = trigger.hour || 0;
                        const m = trigger.minute || 0;
                        const period = h >= 12 ? "PM" : "AM";
                        const displayH = h % 12 || 12;
                        timeDisplay = `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
                      }
                      
                      return (
                        <View key={notif.identifier} className="flex-row items-center justify-between p-4 border-b" style={{borderBottomColor: mode.main}}>
                          <View className="flex-row items-center gap-3 flex-1">
                            <RemixIcon name="notification-line" size={scale(20)} color={theme.accent}/>
                            <View className="flex-1">
                              <Text className="font-funnel_semi mb-1" style={{fontSize: FONT.sm, color: mode.textPrimary}}>
                                {notif.content.body.replace(/^Reminder:\s*/i, "")}
                              </Text>
                              <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: mode.textSecondary}}>
                                {timeDisplay} • Daily
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity 
                            activeOpacity={0.7} 
                            onPress={async () => {
                              await Notifications.cancelScheduledNotificationAsync(notif.identifier);
                              fetchScheduledNotifications(); // Refresh the list
                            }}
                          >
                            <RemixIcon name="close-line" size={scale(20)} color={mode.textSecondary}/>
                          </TouchableOpacity>
                        </View>
                      );
                    })}      
                  </>
                ):(
                  <View className="flex-row items-center justify-between p-4 border-b" style={{borderBottomColor: mode.main}}>
                    <View className="flex-row items-center justify-center gap-3 flex-1 py-2">
                      <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: mode.textSecondary}}>
                        There are currently no reminders to show.
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Set Reminder Button */}
              {scheduledNotifications.length >= 5 ? (
                <View className="flex-row items-center justify-between p-4 border-b" style={{borderBottomColor: mode.main}}>
                  <View className="flex-row items-center justify-center gap-3 flex-1 py-2">
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: mode.textSecondary}}>
                      You've reached the maximum limit for reminders (5).
                    </Text>
                  </View>
                </View>
              ):(
                <TouchableOpacity 
                  className="rounded-3xl p-4 flex-row items-center justify-center gap-2" 
                  onPress={() => setReminderOpen(true)} 
                  activeOpacity={0.7} 
                  style={{backgroundColor: theme.primary + '90'}}
                >
                  <RemixIcon name="add-line" size={scale(20)} color={'white'}/>
                  <Text className="font-funnel_semi" style={{fontSize: FONT.sm, color: 'white'}}>Set Reminder</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Progress Overview - Enhanced */}
            <View className="w-[95%] px-2">
              <Text className="font-funnel_semi mb-3" style={{fontSize: FONT.md, color: mode.textPrimary}}>Your Progress</Text>
              <View className="rounded-3xl p-5" style={{elevation: 2, shadowColor: 'gray', backgroundColor: mode.card}}>
                <View className="flex-row justify-between mb-4">
                  <View className="items-center flex-1">
                    <Text className="font-funnel_bold" style={{color: theme.primary, fontSize: FONT.xl}}>{sessions}</Text>
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: mode.textSecondary}}>Entries</Text>
                  </View>
                  <View className="items-center flex-1">
                    <Text className="font-funnel_bold" style={{color: theme.primary, fontSize: FONT.xl}}>{currentStreak}</Text>
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: mode.textSecondary}}>Day Streak</Text>
                  </View>
                  <View className="items-center flex-1">
                    <Text className="font-funnel_bold" style={{color: theme.primary, fontSize: FONT.xl}}>{wellnessScore}%</Text>
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: mode.textSecondary}}>Wellness</Text>
                  </View>
                </View>
                
                {/* Progress Bar */}
                <View className="mb-4">
                  <Text className="font-funnel_regular mb-2" style={{fontSize: FONT.xs, color: mode.textSecondary}}>Weekly Goal Progress</Text>
                  <View className="h-2 rounded-full" style={{backgroundColor: mode.neutral, borderRadius: 50}}>
                    <View className="h-2 rounded-full" style={{backgroundColor: theme.primary, width: `${weeklyProgress}%`}} ></View>
                  </View>
               
                </View>
                {/* Mood Trend Indicator */}
                <View className="flex-row items-center justify-between pt-3 border-t" style={{borderColor: mode.neutral}}>
                  <View className="flex-row items-center gap-2">
                    <RemixIcon 
                      name={recentTrend === 'Great' ? 'emotion-happy-line' : 
                           recentTrend === 'Good' ? 'emotion-normal-line' : 
                           recentTrend === 'Fair' ? 'emotion-unhappy-line' : 'emotion-sad-line'} 
                      size={scale(14)} 
                      color={recentTrend === 'Great' ? '#81C784' : 
                            recentTrend === 'Good' ? '#F48FB1' : 
                            recentTrend === 'Fair' ? '#EF9A9A' : '#E57373'}
                    />
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: mode.textSecondary}}>Recent Mood: {recentTrend}</Text>
                  </View>
                  <TouchableOpacity className="flex-row items-center gap-1" onPress={() => router.push('/weekly-mood')} activeOpacity={0.6}>
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: theme.primary}}>View Details</Text>
                    <RemixIcon name="arrow-right-s-line" size={scale(14)} color={theme.primary}/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>        
          </View>
          <ReminderEntryModal open={reminderOpen} setOpen={setReminderOpen}/>
        </GBackground>
      </ScrollView>

    </View>
  );
}