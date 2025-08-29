import { Image } from "expo-image";
import { View } from "react-native";

interface Props {
  height?: string
  width?: string
}

export default function TextLogo({ height, width }: Props) {
  return (
    <View className={`items-center justify-center h-[90px] w-[340px] ${height} ${width}`}>
      <Image
        source={require("../../assets/icons/1.png")}
        contentFit="contain"
        style={{ height: "100%", width: "100%" }}
      />
    </View>
  );
}
