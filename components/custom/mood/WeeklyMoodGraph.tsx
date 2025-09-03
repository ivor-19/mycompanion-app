import { FONT } from '@/lib/scale';
import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

type MoodsData = {
  moodText: string;
  date: string;
  day: string;
  time: string;
  note: string;
};

interface WeeklyMoodGraphProps {
  moodsData?: MoodsData[];
}

const WeeklyMoodGraph: React.FC<WeeklyMoodGraphProps> = ({ moodsData }) => {
  const screenWidth = Dimensions.get('window').width;
  
  // Calculate date range for the current week
  const getCurrentWeekData = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate Monday of current week
    const monday = new Date(today);
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Handle Sunday as last day of week
    monday.setDate(today.getDate() - daysFromMonday);
    
    // Calculate Sunday of current week
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const formatDate = (date: Date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}`;
    };
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    
    return {
      dateRange: `${formatDate(monday)} - ${formatDate(sunday)}`,
      weekDates
    };
  };
  
  const { dateRange, weekDates } = getCurrentWeekData();
  
  const moodColors = { Happy: '#4CAF50', Excited: '#FF9800',  Neutral: '#9E9E9E', Anxious: '#FFC107', Sad: '#2196F3', Angry: '#F44336',};

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const moodTypes = ['Happy', 'Excited', 'Neutral', 'Anxious', 'Sad', 'Angry'];
  
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateString = (dateStr: string): string => {
    try {
      const parts = dateStr.trim().split(' ');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const monthName = parts[1];
        const year = parseInt(parts[2]);
        
        const months = { 'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5, 'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11 };
        
        const monthIndex = months[monthName as keyof typeof months];
        if (monthIndex !== undefined) {
          const date = new Date(year, monthIndex, day);
          return formatDateToString(date);
        }
      }
      
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return formatDateToString(date);
      }
      
      console.log('Date parsing failed for:', dateStr);
      return dateStr; 
    } catch (error) {
      console.log('Date parsing error for:', dateStr, error);
      return dateStr;
    }
  };

  // Process data to count moods per day
  const processMoodCounts = () => {
    const weekData = daysOfWeek.map((dayLabel, index) => {
      const currentDate = weekDates[index];
      const dateString = formatDateToString(currentDate);
      
      // Find moods for this specific date
      const dayMoods = moodsData?.filter(mood => {
        const moodDateNormalized = parseDateString(mood.date);
        // console.log(`Comparing: ${moodDateNormalized} === ${dateString}`, moodDateNormalized === dateString);
        return moodDateNormalized === dateString;
      });
      
      // console.log(`${dayLabel} (${dateString}): Found ${dayMoods?.length || 0} moods`);
      
      const moodCounts: { [key: string]: number } = {};
      moodTypes.forEach(mood => {
        moodCounts[mood] = 0;
      });
      
      dayMoods?.forEach(mood => {
        if (moodCounts.hasOwnProperty(mood.moodText)) {
          moodCounts[mood.moodText]++;
        }
      });
      
      const totalCount = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
      
      let mostFrequentMood = 'Neutral';
      let maxCount = 0;
      Object.entries(moodCounts).forEach(([mood, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostFrequentMood = mood;
        }
      });
      
      return {
        value: totalCount,
        label: dayLabel,
        frontColor: totalCount > 0 ? moodColors[mostFrequentMood as keyof typeof moodColors] : '#E0E0E0',
        moodCounts,
        totalCount,
        date: dateString,
        fullDayName: fullDayNames[index]
      };
    });
    
    return weekData;
  };

  const chartData = processMoodCounts();
  const maxCount = Math.max(...chartData.map(d => d.totalCount), 1);

  return (
    <View className='bg-white m-4 p-4 overflow-hidden border-2 border-gray-100 rounded-2xl gap-2'>
      <View className=''>
        <Text className='font-funnel_semi text-center' style={{fontSize: FONT.md}}>Weekly Mood Count</Text>
        <Text className='font-funnel_semi text-center text-blue-800' style={{fontSize: FONT.xs}}>{dateRange}</Text>
        <Text className='font-funnel_regular text-center mb-4' style={{fontSize: FONT.xs}}>Total mood entries per day</Text>
      </View>
      
      <View className='bg-[#f8f9fa] p-4 rounded-xl'>
        <BarChart
          data={chartData}
          width={screenWidth - 80}
          height={200}
          barWidth={30}
          spacing={25}
          roundedTop={false}
          roundedBottom={false}
          hideRules={true}
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{fontSize: FONT.xxs}}
          xAxisLabelTextStyle={{fontSize: FONT.xxs}}
          noOfSections={maxCount}
          maxValue={maxCount}
          isAnimated={false}
          showValuesAsTopLabel={true}
          topLabelTextStyle={{fontSize: FONT.xxs, color: 'black'}}
          backgroundColor={'transparent'}
        />
      </View>
      
      {/* Summary Stats */}
      <View className='bg-[#f8f9fa] p-4 rounded-xl'>
        <Text className='font-funnel_semi' style={{fontSize: FONT.xs}}>Week Summary:</Text>
        <Text className='font-funnel_regular' style={{fontSize: FONT.xs}}>Total entries: {chartData.reduce((sum, day) => sum + day.totalCount, 0)}</Text>
        <Text className='font-funnel_regular' style={{fontSize: FONT.xs}}>Most active day: {chartData.reduce((max, day) => day.totalCount > max.totalCount ? day : max).label}</Text>
      </View>
      
      {/* Detailed breakdown */}
      <View className='bg-[#f8f9fa] p-4 gap-2 rounded-2xl'>
        <Text className='font-funnel_semi' style={{fontSize: FONT.xs}}>Daily Breakdown:</Text>
        {chartData.map((dayData, index) => (
          dayData.totalCount > 0 && (
            <View key={index} className='my-2'>
              <Text className='font-funnel_semi' style={{fontSize: FONT.xs}}>{dayData.fullDayName}:</Text>
              <View className='flex-row gap-2'>
                {Object.entries(dayData.moodCounts)
                  .filter(([_, count]) => count > 0)
                  .map(([mood, count]) => (
                    <View key={mood} className='flex-row items-center gap-1'>
                      <View className='h-2 w-2 rounded-full' style={[, { backgroundColor: moodColors[mood as keyof typeof moodColors] }]} />
                      <Text className='font-funnel_regular' style={{fontSize: FONT.xxs}}>{mood} ({count})</Text>
                    </View>
                  ))}
              </View>
            </View>
          )
        ))}
      </View>
      
      {/* Mood Legend */}
      <View className='bg-[#f8f9fa] p-4 rounded-2xl gap-2'>
        <Text className='font-funnel_semi' style={{fontSize: FONT.xs}}>Mood Colors:</Text>
        <View className='flex-wrap flex-row justify-between'>
          {Object.entries(moodColors).map(([mood, color]) => (
            <View key={mood} className='flex-row gap-1 items-center w-[30%]'>
              <View className='h-2 w-2 rounded-full' style={[{ backgroundColor: color }]} />
              <Text className='font-funnel_regular' style={{fontSize: FONT.xxs}}>{mood}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default WeeklyMoodGraph;