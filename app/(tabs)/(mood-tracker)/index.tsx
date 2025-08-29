import { Redirect } from "expo-router";

export default function MoodIndex() {
  return <Redirect href="/(tabs)/(mood-tracker)/daily-mood" />;
}