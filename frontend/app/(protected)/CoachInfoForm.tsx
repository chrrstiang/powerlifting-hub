import { Link } from "expo-router";
import { Button, H3, XStack, YStack, Text, H2, H1 } from "tamagui";
import { Dumbbell, PersonStanding } from "@tamagui/lucide-icons";

export default function CoachProfileForm() {
  return (
    <YStack m={"$4"} justifyContent="center" alignItems="center" fullscreen>
      <YStack gap="$10">
        <H1 text={"center"} size="$8">
          Coach Page
        </H1>
      </YStack>
    </YStack>
  );
}
