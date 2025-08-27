import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return(
    <SafeAreaView>
      <TouchableOpacity onPress={() => router.push('/home')}>
        <Text>GO home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}