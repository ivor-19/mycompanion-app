import GBackground from "@/components/custom/GBackground";
import PageLayout from "@/components/custom/layout/PageLayout";
import { useColorModeStore } from "@/stores/colorModeStore";
import { useThemeStore } from "@/stores/themeStore";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RemixIcon from "react-native-remix-icon";
import { scale } from "react-native-size-matters";

const hotlines = [
  {
    name: 'DOH - National Center for Mental Health NCMH',
    note: '📌 24/7 mental health crisis support, suicide prevention, counseling',
    schedule: '24/7',
    numbers: [
      {number: '1153', provider: 'Landline'},
      {number: '0917 899 8727', provider: 'Globe/TM'},
      {number: '0967 351 4518', provider: 'Smart/Sun/TNT'},
    ]
  },
  {
    name: 'Hopeline Philippines (PLDT & Natasha Goulbourn Foundation)',
    note: '📌 Emotional crisis, depression, suicide prevention support',
    schedule: '24/7',
    numbers: [
      {number: '(02) 8804 4673', provider: 'Landline'},
      {number: '0917 558 4673', provider: 'Mobile'},
      {number: '0918 873 4673', provider: 'Mobile'},
    ]
  },
  {
    name: 'Philippine Mental Health Association (PMHA) Crisis Hotline',
    note: '📌 Counseling and mental health support',
    schedule: '24/7',
    numbers: [
      {number: '(02) 8921 4958', provider: 'Landline'},
    ]
  },
  {
    name: 'Department of Health (DOH) Helpline',
    note: '📌 Includes psychosocial and health-related emergencies',
    schedule: '24/7',
    numbers: [
      {number: '155 ', provider: 'Helpline'},
    ]
  },
  {
    name: 'IN TOUCH Community Services',
    note: '📌 Community mental health support',
    schedule: 'Varies',
    numbers: [
      {number: '(02) 8893 1893 ', provider: 'Landline'},
      {number: '0917 863 1136', provider: 'Globe'},
      {number: '0998 841 0053', provider: 'Smart'},
    ]
  },
  {
    name: 'Tawag Paglaum – Centro Bisaya',
    note: '📌 24/7 helpline for individuals struggling with emotional and suicidal crisis',
    schedule: '24/7',
    numbers: [
      {number: '0966 467 9626 ', provider: 'Mobile'},
    ]
  },
  {
    name: 'National Center For Mental Health Crisis Hotline',
    note: '',
    schedule: '24/7',
    numbers: [
      {number: '1800 1888 1553', provider: 'Landline'},
      {number: '0919 057 1553', provider: 'Mobile'},
    ]
  },
  {
    name: 'Philippine Red Cross',
    note: '📌 Emergency response and crisis support',
    schedule: '24/7',
    numbers: [
      {number: '143', provider: 'Emergency'},
    ]
  },
]

export default function Hotlines() {
  const { theme } = useThemeStore()
  const { mode } = useColorModeStore()

  return(
     <PageLayout headerTitle="Mental Health Crisis Hotlines">
      <ScrollView style={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <GBackground>
          <View className="min-h-screen items-center w-full mb-12 p-6 gap-4">
            {hotlines.map((hotline, index) => (
              <View key={index} className="rounded-2xl p-6 gap-4 items-start w-full shadow" style={{backgroundColor: mode.card, borderWidth: 1, borderColor: mode.neutral}}>
                <View className="">
                  <Text className="font-funnel_bold mb-1" style={{fontSize: scale(16), color: mode.textPrimary}}>{hotline.name}</Text> 
                  <Text className="font-funnel_regular" style={{fontSize: scale(11), color: mode.textSecondary}}>{hotline.note}</Text>
                  <View className="flex-row gap-2 items-center">
                    <RemixIcon name="time-line" size={scale(14)} color={mode.textSecondary}/>
                    <Text className="font-funnel_regular" style={{fontSize: scale(11), color: mode.textSecondary}}>{hotline.schedule}</Text>
                  </View>
                </View>
                <View className="gap-2">
                  {hotline.numbers.map((num, index) => (
                    <TouchableOpacity 
                      key={index} 
                      className="rounded-xl flex-row items-center gap-2 p-4 w-full" 
                      style={{backgroundColor: theme.primary + '20'}}
                      activeOpacity={0.7} 
                      onPress={() => {
                        if (num.provider.toLowerCase() !== "landline") {
                          Linking.openURL(`tel:${num.number}`);
                        }
                      }}
                    >
                      <RemixIcon name={num.provider === 'Landline' ? 'phone-fill' : 'smartphone-line'} size={scale(14)} color={theme.accent}/>
                      <Text className="font-funnel_semi flex-1" style={{fontSize: scale(11), color: theme.accent}}>{num.number}</Text>
                      <Text className="font-funnel_semi ]" style={{fontSize: scale(11), color: theme.accent}}>{num.provider}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </GBackground>
      </ScrollView>
     </PageLayout>
  )
}