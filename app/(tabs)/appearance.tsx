import GBackground from '@/components/custom/GBackground'
import PageLayout from '@/components/custom/layout/PageLayout'
import { FONT } from '@/lib/scale'
import { useColorModeStore } from '@/stores/colorModeStore'
import { useThemeStore } from '@/stores/themeStore'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { scale } from 'react-native-size-matters'

export default function Appearance() {
  const { theme, setTheme } = useThemeStore()
  const { mode, setMode } = useColorModeStore()

  const appearances = [
    {name: 'softPink', color: '#FF90BC', title: 'Rose (Default)'},
    {name: 'softRed', color: '#FF6F6F', title: 'Red'},
    {name: 'softBlue', color: '#6EC1E4', title: 'Blue'},
    {name: 'softOrange', color: '#FFB774', title: 'Orange'},
    {name: 'softPurple', color: '#BAA6E3', title: 'Purple'},
    {name: 'softGreen', color: '#81C784', title: 'Green'},
    {name: 'softGray', color: '#BDBDBD', title: 'Gray'},
    {name: 'softTeal', color: '#80CBC4', title: 'Teal'},
    {name: 'softPeach', color: '#FFBC9A', title: 'Peach'},
  ]

  return (
   <PageLayout headerTitle="Appearance">
      <GBackground>
        <View className="min-h-screen items-center w-full gap-4 mb-32">
          <View className="w-[95%] px-2 mt-4" style={{gap: 20}}>
            <View className="rounded-3xl p-5" style={{elevation: 2, shadowColor: 'gray', backgroundColor: mode.card, borderColor: mode.neutral, borderWidth: 1}}>
              <View className='flex-row items-center justify-between'>
                <Text className="font-funnel_semi mb-3" style={{fontSize: FONT.sm, color: mode.textPrimary}}>Color</Text>
                <Text className="font-funnel_regular mb-3" style={{fontSize: FONT.xs, color: mode.textPrimary}}>
                  {appearances.find(a => a.name === theme.name)?.title || 'Rose (Default)'}
                </Text>
              </View>
              <View className='flex-row flex-wrap gap-4 w-full items-center justify-center'>
                {appearances.map((appearance, index) => {
                  const isSelected = theme.name === appearance.name
                  return(
                    <View key={index} className='items-center justify-center' style={{borderRadius: 50, height: scale(50), width: scale(50), borderWidth: isSelected ? 2 : 0, borderColor: '#dedede'}}>
                      <TouchableOpacity onPress={() => setTheme(appearance.name)} style={{backgroundColor: appearance.color,borderRadius: 50, height: scale(40), width: scale(40)}} activeOpacity={0.6}></TouchableOpacity>
                    </View>
                  )
                })}               
              </View>
            </View>
            <View className="rounded-3xl p-5" style={{elevation: 2, shadowColor: 'gray', backgroundColor: mode.card, borderColor: mode.neutral, borderWidth: 1}}>
              <View className='flex-row items-center justify-between'>
                <Text className="font-funnel_semi mb-3" style={{fontSize: FONT.sm, color: mode.textPrimary}}>Mode</Text>
                <Text className="font-funnel_regular mb-3" style={{fontSize: FONT.xs, color: mode.textPrimary}}>
                  {mode.name === 'light' ? 'Light' : 'Dark'}
                </Text>
              </View>
              <View className='flex-row flex-wrap gap-4 w-full items-center justify-center'>
                <View className='items-center justify-center' style={{borderRadius: 50, height: scale(50), width: scale(50), borderWidth: mode.name === 'light' ? 2 : 0, borderColor: '#dedede'}}>
                  <TouchableOpacity onPress={() => setMode('light')} style={{backgroundColor: 'white',borderRadius: 50, height: scale(40), width: scale(40)}} activeOpacity={0.6}></TouchableOpacity>
                </View>
                <View className='items-center justify-center' style={{borderRadius: 50, height: scale(50), width: scale(50), borderWidth: mode.name === 'dark' ? 2 : 0, borderColor: '#dedede'}}>
                  <TouchableOpacity onPress={() => setMode('dark')} style={{backgroundColor: 'black',borderRadius: 50, height: scale(40), width: scale(40)}} activeOpacity={0.6}></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </GBackground>
    </PageLayout>
  )
}