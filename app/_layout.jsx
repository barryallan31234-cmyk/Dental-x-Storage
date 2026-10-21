import { Stack } from "expo-router";
import { Platform, View } from "react-native";

export default function RootLayout() {
  const stack = (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );

  if (Platform.OS !== "web") {
    return stack;
  }

  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#E5E7EB" }}>
      <View style={{ flex: 1, width: "100%", maxWidth: 480, backgroundColor: "#FFFFFF" }}>
        {stack}
      </View>
    </View>
  );
}