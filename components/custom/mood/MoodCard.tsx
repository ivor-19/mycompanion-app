import { getEmojiByMood } from "@/helper/moodEmoji";
import { FONT } from "@/lib/scale";
import { Image } from "expo-image";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { MoodBadge } from "./MoodBadge";
import ViewMoodEntryModal from "./ViewMoodEntryModal";

type MoodsData = {
  moodText: string;
  date: string;
  day: string;
  time: string;
  note: string;
  images?: string[];
};

interface Props {
  moodData: MoodsData;
  handleDeleteMood: () => void;
}

export default function MoodCard({ moodData, handleDeleteMood }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setOpen(true)}
        className="rounded-2xl bg-white shadow-sm border border-gray-100 mb-3"
      >
        {/* Container */}
        <View className="flex-row items-start p-4">
          {/* Mood Emoji */}
          <View className="h-12 w-12 rounded-full items-center justify-center bg-gray-50 mr-3">
            <Image
              source={getEmojiByMood(moodData.moodText)}
              contentFit="contain"
              style={{ height: 36, width: 36 }}
            />
          </View>

          {/* Mood Info */}
          <View className="flex-1">
            {/* Date + Photos */}
            <View className="flex-row justify-between items-center mb-1">
              <Text
                className="font-funnel_semi text-gray-800"
                style={{ fontSize: FONT.xs }}
              >
                {moodData.date} 
              </Text>
              {(moodData.images ?? []).length > 0 && (
                <Text
                  className="font-funnel_regular text-gray-500"
                  style={{ fontSize: FONT.xxs }}
                >
                  {(moodData.images ?? []).length} Photo/s
                </Text>
              )}
            </View>

            {/* Note */}
            {moodData.note ? (
              <Text
                className="font-funnel_regular text-gray-700 mb-2"
                style={{ fontSize: FONT.xxs }}
                numberOfLines={2}
              >
                {moodData.note}
              </Text>
            ) : (
              <Text
                className="italic text-gray-400"
                style={{ fontSize: FONT.xxs }}
              >
                No note added
              </Text>
            )}

            {/* Mood Badge */}
            <MoodBadge mood={moodData.moodText} />
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleDeleteMood}
            className="ml-3"
          >
            <RemixIcon name="delete-bin-fill" size={20} color="#ff0066" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <ViewMoodEntryModal open={open} setOpen={setOpen} moodData={moodData} />
    </>
  );
}
