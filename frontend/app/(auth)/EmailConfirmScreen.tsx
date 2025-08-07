import { useAuth } from "contexts/AuthContext";
import { router } from "expo-router";
import { useEffect } from "react";
import { Button, H3, YStack } from "tamagui";

export default function ConfirmEmailScreen() {
    const { isAuthenticated } = useAuth();

    // listens for update to authentication state and redirects user to app
    useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(protected)/(tabs)');
    }
  }, [isAuthenticated]);

    const handleLinkResend = async () => {
        return;
    }

    return(
        <YStack
        gap="$10"
        m={"$8"}
        mt={"$18"}
        justify="center">
            <H3>
                An email was sent to "email". Please confirm.
            </H3>
            <Button onPress={handleLinkResend}>
                Resend Email
            </Button>
        </YStack>
    )
}