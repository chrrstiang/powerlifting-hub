import { Redirect, Stack } from "expo-router";
import { useTheme } from "tamagui";
import { useAuth } from "contexts/AuthContext";
import { useEffect, useState } from "react";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function ProtectedLayout() {
  const theme = useTheme();

  const completedProfile = false;

  console.log("🤩 Made it to protected route!");

  return (
    <Stack initialRouteName="ProfileCompleteScreen">
      <Stack.Screen
        name="ProfileCompleteScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Protected guard={completedProfile}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
      <Stack.Screen
        name="modal"
        options={{
          title: "Tamagui + Expo",
          presentation: "modal",
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
          contentStyle: {
            backgroundColor: theme.background.val,
          },
        }}
      />
    </Stack>
  );
}
