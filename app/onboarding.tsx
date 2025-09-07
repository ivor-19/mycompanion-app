import Button from '@/components/custom/Button';
import GBackground from '@/components/custom/GBackground';
import { FONT } from '@/lib/scale';
import { secureStorage } from '@/lib/secureStorage';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View
} from 'react-native';
import { scale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

interface OnboardingItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

const onboardingData: OnboardingItem[] = [
   {
    id: 1,
    title: 'My Companion',
    subtitle: 'AI as a First Responder: A Mobile-Based Psychological Support System designed to guide and support you anytime, anywhere.',
    image: require('@/assets/images/illustrations/welcome.png'),
  },
  {
    id: 2,
    title: 'Chatbot Support',
    subtitle: 'Talk to an AI-powered chatbot that listens, understands, and provides supportive responses when you need someone to lean on.',
    image: require('@/assets/images/illustrations/chatbot.png'),
  },
  {
    id: 3,
    title: 'Mood Tracking',
    subtitle: 'Track your mood daily, weekly, and monthly to gain insights into your emotional well-being and personal growth.',
    image: require('@/assets/images/illustrations/moodtracking.png'),
  },
  {
    id: 4,
    title: 'Find Help Nearby',
    subtitle: 'Easily access mental health hotlines and locate the nearest clinics or hospitals through an interactive map.',
    image: require('@/assets/images/illustrations/clinic.png'),
  },
];

interface OnboardingItemProps {
  item: OnboardingItem;
  index: number;
}

const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<OnboardingItem>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleGetStarted = async () => {
    try{
      await secureStorage.setItem("hasOnboarded", "true")
      console.log('hasOnboarded');
      router.replace('/home')
    } catch (error) {
      console.error("Error saving onboarding state", error);
    }
  };

  const renderDots = (): React.ReactElement => {
    return (
      <View className="flex-row justify-center items-center mb-8 ">
        {onboardingData.map((_, index) => (
          <MotiView
            key={index}
            animate={{
              width: index === currentIndex ? 32 : 8,
              opacity: index === currentIndex ? 1 : 0.3,
            }}
            transition={{
              type: 'timing',
              duration: 300,
            }}
            className="h-2 bg-[#FF90BC] rounded-full mx-1"
          />
        ))}
      </View>
    );
  };

  const renderOnboardingItem: ListRenderItem<OnboardingItem> = ({ item, index }) => {
    const isActive = index === currentIndex;
    const isLastSlide = index === onboardingData.length - 1;
    
    return (
      <View 
        style={{ width }}
        className="flex-1 justify-center items-center px-8"
      >
        <AnimatePresence>
          {isActive && (
            <MotiView
              key={`onboarding-${item.id}`}
              from={{
                opacity: 0,
                scale: 0.8,
                translateY: 50,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                translateY: 0,
              }}
              transition={{
                type: 'timing',
                duration: 500,
              }}
              className="items-center flex-1 justify-center gap-20"
            >
              {/* Icon Container with Pulse Animation */}
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 150,
                  delay: 200,
                }}
                className={`w-32 h-32 rounded-full justify-center items-center mb-12 `}
              >
                <MotiView>
                 <Image source={item.image} style={{height: scale(250), width: scale(250)}}/>
                </MotiView>
              </MotiView>
              <View>   
                {/* Title with Slide In Animation */}
                <MotiView
                  from={{ opacity: 0, translateY: 30 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{
                    type: 'timing',
                    duration: 400,
                    delay: 400,
                  }}
                  className="mb-6"
                >
                  <Text className="text-black text-3xl font-funnel_bold text-center leading-tight" style={{fontSize: FONT.xl}}> {item.title} </Text>
                </MotiView>

                {/* Subtitle with Slide In Animation */}
                <MotiView
                  from={{ opacity: 0, translateY: 30 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{
                    type: 'timing',
                    duration: 400,
                    delay: 600,
                  }}
                  className="mb-12"
                >
                  <Text className="text-gray-600 text-lg text-center leading-relaxed px-4 font-funnel_regular" style={{fontSize: FONT.sm}}> {item.subtitle} </Text>
                </MotiView>

                {/* Get Started Button (only on last slide) */}
                {isLastSlide && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: 'spring',
                      damping: 15,
                      stiffness: 150,
                      delay: 800,
                    }}
                  >
                    <MotiView animate={{ scale: [1, 1.05, 1], }} transition={{ type: 'timing', duration: 2000, loop: true, }} >
                      <Button text='Get Started' onPress={handleGetStarted} style='bg-[#FF90BC] p-4 w-full' fontStyle='font-funnel_semi text-white'/>
                    </MotiView>
                  </MotiView>
                )}
              </View>

            </MotiView>
          )}
        </AnimatePresence>
      </View>
    );
  };

  const currentItem = onboardingData[currentIndex];

  return (
    <GBackground>
      <View className="min-h-screen">      
        {/* Background with Color Transition */}
        <MotiView
          // animate={{
          //   backgroundColor: currentItem.backgroundColor
          // }}
          transition={{
            type: 'timing',
            duration: 500,
          }}
          className="flex-1 "
        >
          
          {/* Header with Skip Button */}
          <View className="flex-row justify-between items-center px-6 pt-4 pb-8">
            <View className="w-16" />
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                damping: 15,
                stiffness: 150,
                delay: 100,
              }}
            >
            
            </MotiView>
          </View>

          {/* Content with FlatList */}
          <View className="flex-1">
            <FlatList<OnboardingItem>
              ref={flatListRef}
              data={onboardingData}
              renderItem={renderOnboardingItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              onScroll={handleScroll}
              scrollEventThrottle={16}
            />
          </View>

          {/* Dots Indicator at Bottom */}
          <MotiView from={{ opacity: 0, translateY: 50 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 300, }} className="px-8 pb-8" >
            {renderDots()}
          </MotiView>
        </MotiView>
      </View>
    </GBackground>
  );
};

export default OnboardingScreen;