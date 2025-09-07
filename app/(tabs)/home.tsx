import Button from "@/components/custom/Button";
import GBackground from "@/components/custom/GBackground";
import { getRandomAffirmation } from "@/helper/affirmation";
import { FONT } from "@/lib/scale";
import { useMoodStore } from "@/stores/moodStore";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const { moods } = useMoodStore();
  const affirmation = getRandomAffirmation()

  // Calculate stats from mood data
  const { sessions, wellnessScore, weeklyProgress } = calculateMoodStats(moods);
  const currentStreak = calculateStreak(moods);
  const recentTrend = getRecentMoodTrend(moods);
  const currentMood = getCurrentMood(moods);

  const quickActions = [
    { icon: "emotion-happy-line", title: "Mood Check", color: "#FF6B9D", route: '/daily-mood' },
    { icon: "map-pin-line", title: "Find a Clinic", color: "#4ECDC4", route: '/hotlines' },
    { icon: "line-chart-fill", title: "Mood Insights", color: "#FFB347", route: '/monthly-mood' },
  ];

  const resources = [
    { title: "5min Meditation", subtitle: "Quick relaxation", color: "#E8F5FF" },
    { title: "Anxiety Relief", subtitle: "Coping strategies", color: "#FFF2E8" },
    { title: "Sleep Stories", subtitle: "Better rest", color: "#F0F8E8" },
    { title: "Daily Tips", subtitle: "Mental wellness", color: "#F8E8FF" },
  ];

  return (
    <SafeAreaView className="min-h-screen bg-white"> 
      <ScrollView style={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <GBackground>
          <View className="min-h-screen items-center w-full gap-4 mb-32">
            {/* Header Section */}
            <View className="bg-white rounded-b-[30px] pt-4 px-6 pb-6 flex-col gap-4 w-full" style={{elevation: 4, shadowColor: 'gray'}}>
              <View className="flex-row justify-between">
                <View className="justify-center">
                  <Text className="font-funnel_bold" style={{fontSize: FONT.lg}}>My Companion</Text>
                  <Text className="font-funnel_regular" style={{fontSize: FONT.xxs}}>A Mobile-Based Psychological Support System</Text>
                </View>
                <View className="flex-row gap-2 items-center">
                  <RemixIcon name="shield-check-fill" size={16} color="#6ed0d0"/>
                  <Text className="font-funnel_regular" style={{fontSize: FONT.xxs}}>Secure & Private</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-4">
                <View className="h-16 w-16" style={{borderRadius: '100%'}}>
                  <Image source={require('../../assets/images/bot/head-nobg.png')} contentFit="contain" style={{width: '100%', height: '100%', borderRadius: 60}}/> 
                </View>
                <View>
                  <Text className="font-funnel_semi">Welcome Back!</Text>
                  <Text className="font-funnel_regular">How are you feeling today?</Text>
                </View>
              </View>
            </View>

            {/* Main Chat Card */}
            <LinearGradient
              colors={['#ffc2d1', '#FF90BC']}
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
                  <Text className="font-cb text-white leading-7 text-right" style={{fontSize: FONT.xl}}>A SAFE SPACE FOR YOUR THOUGHTS</Text>
                  <Text className="font-funnel_regular text-right text-white  leading-5 opacity-90" style={{fontSize: FONT.xs}}>
                    Begin your journey to better mental wellness today
                  </Text>
                </View>
                <Button text="Chat Now" style="h-12 w-[8em] bg-[#fff]" fontStyle="text-sm text-black" onPress={() => router.push('/home')}/>
              </View>
            </LinearGradient>

            {/* Quick Actions */}
            <View className="w-[95%] px-2">
              <Text className="font-funnel_semi mb-3" style={{fontSize: FONT.md}}>Quick Actions</Text>
              <View className="flex-row justify-between">
                {quickActions.map((action, index) => (
                  <TouchableOpacity key={index} onPress={() => router.push(action?.route as any)} className="bg-white rounded-3xl p-4 items-center flex-1 mx-1" style={{elevation: 2, shadowColor: 'gray'}} activeOpacity={0.7}>
                    <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{backgroundColor: action.color + '20'}}>
                      <RemixIcon name={action.icon as any} size={scale(18)} color={action.color}/>
                    </View>
                    <Text className="font-funnel_regular text-center" style={{fontSize: FONT.xxs}}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Today's Insights */}
            <View className="w-[95%] px-2">
              <Text className="font-funnel_semi mb-3" style={{fontSize: FONT.md}}>Today's Insights</Text>
              <View className="bg-white rounded-3xl p-5" style={{elevation: 2, shadowColor: 'gray'}}>
                <View className="flex-row items-center gap-3 mb-4">
                  <RemixIcon name="lightbulb-line" size={scale(20)} color="#FFB347"/>
                  <Text className="font-funnel_semi flex-1" style={{fontSize: FONT.sm}}>Daily Affirmation</Text>
                </View>
                <Text className="font-funnel_regular italic mb-4" style={{fontSize: FONT.xs, color: '#666'}}>{affirmation}</Text>
                <View className="flex-row justify-between">
                  <View className="flex-row items-center gap-2">
                    <RemixIcon name="fire-line" size={scale(14)} color="#FF6B9D"/>
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs}}>{currentStreak}-day streak</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <RemixIcon name="heart-line" size={scale(14)} color="#6ED0D0"/>
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs}}>Mood: {currentMood}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Progress Overview - Enhanced */}
            <View className="w-[95%] px-2">
              <Text className="font-funnel_semi mb-3" style={{fontSize: FONT.md}}>Your Progress</Text>
              <View className="bg-white rounded-3xl p-5" style={{elevation: 2, shadowColor: 'gray'}}>
                <View className="flex-row justify-between mb-4">
                  <View className="items-center flex-1">
                    <Text className="font-funnel_bold" style={{color: '#FF6B9D', fontSize: FONT.xl}}>{sessions}</Text>
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: '#666'}}>Entries</Text>
                  </View>
                  <View className="items-center flex-1">
                    <Text className="font-funnel_bold" style={{color: '#6ED0D0', fontSize: FONT.xl}}>{currentStreak}</Text>
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: '#666'}}>Day Streak</Text>
                  </View>
                  <View className="items-center flex-1">
                    <Text className="font-funnel_bold" style={{color: '#FFB347', fontSize: FONT.xl}}>{wellnessScore}%</Text>
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: '#666'}}>Wellness</Text>
                  </View>
                </View>
                
                {/* Progress Bar */}
                <View className="mb-4">
                  <Text className="font-funnel_regular mb-2" style={{fontSize: FONT.xs}}>Weekly Goal Progress</Text>
                  <View className="h-2 bg-gray-200 rounded-full">
                    <View className="h-2 rounded-full" style={{backgroundColor: '#6ED0D0', width: `${weeklyProgress}%`}} ></View>
                  </View>
               
                </View>

                {/* Mood Trend Indicator */}
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                  <View className="flex-row items-center gap-2">
                    <RemixIcon 
                      name={recentTrend === 'Great' ? 'emotion-happy-line' : 
                           recentTrend === 'Good' ? 'emotion-normal-line' : 
                           recentTrend === 'Fair' ? 'emotion-unhappy-line' : 'emotion-sad-line'} 
                      size={scale(14)} 
                      color={recentTrend === 'Great' ? '#4ADE80' : 
                            recentTrend === 'Good' ? '#6ED0D0' : 
                            recentTrend === 'Fair' ? '#FFB347' : '#FF6B9D'}
                    />
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs}}>Recent Mood: {recentTrend}</Text>
                  </View>
                  <TouchableOpacity className="flex-row items-center gap-1" onPress={() => router.push('/weekly-mood')} activeOpacity={0.6}>
                    <Text className="font-funnel_regular" style={{fontSize: FONT.xxs, color: '#6ED0D0'}}>View Details</Text>
                    <RemixIcon name="arrow-right-s-line" size={scale(14)} color="#6ED0D0"/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
          </View>
          
        
        
        </GBackground>
      </ScrollView>
    </SafeAreaView>
  );
}