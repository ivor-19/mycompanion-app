// Option 2: Updated PageLayout
import { useColorModeStore } from "@/stores/colorModeStore";
import { View } from "react-native";
import { scale } from "react-native-size-matters";
import CustomHeader from "../CustomHeader";

interface Props {
  headerTitle?: string
  children?: React.ReactNode
}

export default function PageLayout({ headerTitle, children }: Props) {
  const { mode } = useColorModeStore()

  return(
    <View className="flex-1" style={{backgroundColor: mode.main}}>
      <View style={{ flex: 1, paddingTop: scale(24)}}>
        {headerTitle &&
          <CustomHeader title={headerTitle}/>
        }
        <View style={{ minHeight: '100%' }}>
          {children}
        </View>
       
      </View>
    </View>
  )
}