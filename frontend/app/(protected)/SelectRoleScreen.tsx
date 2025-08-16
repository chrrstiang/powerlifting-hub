import { Link } from "expo-router";
import { Button, H3, XStack, YStack, Text, H2, H1 } from "tamagui";
import { Dumbbell, PersonStanding } from "@tamagui/lucide-icons";

export default function SelectRoleScreen() {
  return (
    <YStack m={"$4"} justifyContent="center" alignItems="center" fullscreen>
      <YStack gap="$10">
        <H1 text={"center"} size="$8">
          I am a...
        </H1>
        <XStack gap="$8">
          <Link href="/(protected)/AthleteInfoForm">
            <YStack
              alignItems={"center"}
              gap={"$4"}
              paddingVertical={"$4"}
              paddingHorizontal={"$8"}
              bg="red"
              borderRadius={"$6"}
            >
              <Dumbbell size={"$6"} />
              <H2 text="center" size="$6">
                Athlete
              </H2>
            </YStack>
          </Link>
          <Link href="/(protected)/CoachInfoForm">
            <YStack
              alignItems={"center"}
              gap={"$4"}
              paddingVertical={"$4"}
              paddingHorizontal={"$8"}
              bg="blue"
              borderRadius={"$6"}
            >
              <PersonStanding size={"$6"} />
              <H2 text="center" size="$6">
                Coach
              </H2>
            </YStack>
          </Link>
        </XStack>
      </YStack>
    </YStack>
  );
}
