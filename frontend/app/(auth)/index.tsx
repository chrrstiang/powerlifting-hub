import { Link } from "expo-router";
import { Button, H1, H2, H4, Paragraph, XStack, YStack } from "tamagui";

/** The initial landing screen of the application, when that the user is not authenticated.
 */
export default function LandingScreen() {
    return (
        <YStack 
        gap="$10"
        m={"$8"}
        mt={"$18"}
        justify="center">
            <XStack>
            <H2>Powerlifting made efficient.</H2>
            </XStack>
            <YStack gap={"$3"}>
                <Paragraph>Programming</Paragraph>
                <Paragraph>Communication</Paragraph>
                <Paragraph>Socialization</Paragraph>
                <Paragraph>Discovery</Paragraph>
            </YStack>
            <YStack gap="$10" verticalAlign={"center"}>
                <Link href="/(auth)/SignInScreen" asChild>
                <Button size={"$6"}>
                    Get started
                </Button>
                </Link>
                <Link href="/(auth)/LoginScreen" asChild>
                <Button size={"$6"} themeInverse>
                    I have an account
                </Button>
                </Link>
            </YStack>
        </YStack>
    )
}