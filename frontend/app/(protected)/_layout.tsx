import { useColorScheme } from 'react-native'
import { Redirect, Stack } from 'expo-router'
import { useTheme } from 'tamagui'
import { useAuth } from 'contexts/AuthContext'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
}

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const colorScheme = useColorScheme()
  const theme = useTheme()

  if (!isAuthenticated) {
    return(
      <Redirect href="/(auth)" />
    )
  }
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
