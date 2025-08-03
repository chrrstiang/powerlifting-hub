import { Button, H2, ScrollView, XStack, YStack } from "tamagui";
import { Input } from "components/inputParts";
import { useAuth } from "contexts/AuthContext";
import { useState } from "react";

/** The sign up screen for new users
 */
export default function SignUpScreen() {
    const { signUp } = useAuth();
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setLoading(true);
        try {
            await signUp(email, password)
        } catch(error) {
            console.error('Failed to sign up:', error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView>
        <YStack 
        gap="$10"
        m={"$8"}
        mt={"$18"}
        justify="center">
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
                    onChangeText={setEmail}></Input.Area>
                </Input.Box>
            </Input>
            <Input size={"$4"}>
                <Input.Label htmlFor="password">Password</Input.Label>
                <Input.Box>
                    <Input.Area id="password" 
                    placeholder="Enter Password" 
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    ></Input.Area>
                </Input.Box>
            </Input>
            </YStack>
            <YStack gap="$10" verticalAlign={"center"}>
                <Button size={"$6"} onPress={handleSignUp}>
                    { loading? "Signing up" : "Sign up" }
                </Button>
            </YStack>
        </YStack>
        </ScrollView>
    )
}