import { getEmojiByMood } from "@/helper/moodEmoji";
import { FONT } from "@/lib/scale";
import { useColorModeStore } from "@/stores/colorModeStore";
import { useThemeStore } from "@/stores/themeStore";
import { Image } from "expo-image";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { scale } from "react-native-size-matters";
import DeleteModal from "../modal/DeleteModal";
import { MoodBadge } from "./MoodBadge";
import ViewMoodEntryModal from "./ViewMoodEntryModal";

type MoodsData = {
  id: string
  moodText: string;
  date: string;
  day: string;
  time: string;
  note: string;
  images?: string[];
};

interface Props {
  moodData: MoodsData;
}

export default function MoodCard({ moodData }: Props) {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { theme } = useThemeStore()
  const { mode } = useColorModeStore()

  return (
    <>
      <TouchableOpacity activeOpacity={0.85} onPress={() => setOpen(true)} className="rounded-2xl shadow-sm mb-3" style={{backgroundColor: mode.main, borderWidth: 1, borderColor: mode.neutral}}>
        <View className="flex-row items-start p-4">
          <View className="h-12 w-12 rounded-full items-center justify-center mr-3" style={{backgroundColor: mode.neutral}}>
            <Image source={getEmojiByMood(moodData.moodText)} contentFit="contain" style={{ height: scale(30), width: scale(30) }} />
          </View>

          <View className="flex-1">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="font-funnel_semi" style={{ fontSize: FONT.xs, color: mode.textPrimary }} >
                {moodData.date} 
              </Text>
              {(moodData.images ?? []).length > 0 && (
                <Text className="font-funnel_regular " style={{ fontSize: FONT.xxs, color: mode.textSecondary }} >
                  {(moodData.images ?? []).length} Photo/s
                </Text>
              )}
            </View>

            {moodData.note ? (
              <Text className="font-funnel_regular  mb-2 italic" style={{ fontSize: FONT.xxs, color: mode.textSecondary }} numberOfLines={2} >
                {moodData.note}
              </Text>
            ) : (
              <Text className="italic " style={{ fontSize: FONT.xxs, color: mode.textSecondary }} > No note added </Text>
            )}

            <MoodBadge mood={moodData.moodText} />
          </View>

          {/* Delete Button */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => setOpenDelete(true)} className="ml-3 rounded-lg p-2 " style={{backgroundColor: theme.secondary + '50'}}>
            <RemixIcon name="delete-bin-fill" size={scale(14)} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <ViewMoodEntryModal open={open} setOpen={setOpen} moodData={moodData} />
      <DeleteModal open={openDelete} setOpen={setOpenDelete} moodsData={moodData}/>
    </>
  );
}
