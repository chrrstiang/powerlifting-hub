import { Button, H2, ScrollView, XStack, YStack } from "tamagui";
import { Input } from "components/inputParts";
import { useAuth } from "contexts/AuthContext";
import { useState } from "react";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router } from "expo-router";

/** The sign up screen for new users
 */
export default function SignUpScreen() {
  const { sendMagicLink, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // signs user up & updates authentication state
  const handleSignUp = async () => {
    setLoading(true);
    try {
      await sendMagicLink(email);

      // assumes that signUp returns OK response,
      // error is handled in the signUp method
      router.replace("/ConfirmEmailScreen");
    } catch (error) {
      console.error("Failed to sign up:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <YStack gap="$10" m={"$8"} mt={"$18"} justify="center">
        <XStack>
          <H2>Sign up.</H2>
        </XStack>
        <YStack gap={"$3"}>
          <Input size={"$4"}>
            <Input.Label htmlFor="email">Email</Input.Label>
            <Input.Box>
              <Input.Area
                id="email"
                placeholder="email@email.com"
                value={email}
                onChangeText={setEmail}
              />
            </Input.Box>
          </Input>
        </YStack>
        <YStack gap="$10" verticalAlign={"center"}>
          <Button size={"$6"} onPress={handleSignUp}>
            {loading ? "Signing up" : "Sign up"}
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
