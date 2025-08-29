// Option 2: Updated PageLayout
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../CustomHeader";

interface Props {
  headerTitle?: string
  children?: React.ReactNode
}

export default function PageLayout({ headerTitle, children }: Props) {
  return(
    <SafeAreaView className="flex-1 bg-white">
      <View style={{ flex: 1 }}>
        {headerTitle &&
          <CustomHeader title={headerTitle}/>
        }
        <View style={{ flex: 1 }}>
          {children}
        </View>
       
      </View>
    </SafeAreaView>
  )
}