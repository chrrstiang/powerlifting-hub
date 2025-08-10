import { Redirect, Stack } from 'expo-router'
import { useTheme } from 'tamagui'
import { useAuth } from 'contexts/AuthContext'
import { useEffect, useState } from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export default function ProtectedLayout() {

  console.log("Protected layout")

  const { isAuthenticated, checkAuthState } = useAuth();
  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuthState();
      setLoading(false);
    };
    verifyAuth();
  }, []);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    console.log('🙁 Not authenticated, going to auth route...')
    return(
      <Redirect href="/SignUpScreen" />
    )
  }

  console.log('🤩 Authenticated, going to tabs route...')

  return (
    <Stack>
        <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false
        }} />
        <Stack.Screen
          name="modal"
          options={{
            title: 'Tamagui + Expo',
            presentation: 'modal',
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
      </Stack>
  )
}
