import { getEmojiByMood } from "@/helper/moodEmoji";
import { FONT } from "@/lib/scale";
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

  return (
    <>
      <TouchableOpacity activeOpacity={0.85} onPress={() => setOpen(true)} className="rounded-2xl bg-white shadow-sm border border-gray-100 mb-3" >
        <View className="flex-row items-start p-4">
          <View className="h-12 w-12 rounded-full items-center justify-center bg-gray-50 mr-3">
            <Image source={getEmojiByMood(moodData.moodText)} contentFit="contain" style={{ height: scale(30), width: scale(30) }} />
          </View>

          <View className="flex-1">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="font-funnel_semi text-gray-800" style={{ fontSize: FONT.xs }} >
                {moodData.date} 
              </Text>
              {(moodData.images ?? []).length > 0 && (
                <Text className="font-funnel_regular text-gray-500" style={{ fontSize: FONT.xxs }} >
                  {(moodData.images ?? []).length} Photo/s
                </Text>
              )}
            </View>

            {moodData.note ? (
              <Text className="font-funnel_regular text-gray-700 mb-2 italic" style={{ fontSize: FONT.xxs }} numberOfLines={2} >
                {moodData.note}
              </Text>
            ) : (
              <Text className="italic text-gray-400" style={{ fontSize: FONT.xxs }} > No note added </Text>
            )}

            <MoodBadge mood={moodData.moodText} />
          </View>

          {/* Delete Button */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => setOpenDelete(true)} className="ml-3 bg-red-50 rounded-lg p-2 border-[1px] border-red-100" >
            <RemixIcon name="delete-bin-fill" size={scale(14)} color="#FF90BC" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <ViewMoodEntryModal open={open} setOpen={setOpen} moodData={moodData} />
      <DeleteModal open={openDelete} setOpen={setOpenDelete} moodsData={moodData}/>
    </>
  );
}
