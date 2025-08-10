import 'tamagui-web.css'

import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Provider } from 'components/Provider'
import { useAuth } from 'contexts/AuthContext'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>
}

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  console.log("Root layout")

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  )
}

function RootLayoutNav() {
  const { checkAuthState, isAuthenticated, isLoading } = useAuth()
  const colorScheme = useColorScheme()

  useEffect(() => {
    const verify = async () => {
      await checkAuthState();
    }
    verify();
  }, [])

  if (isLoading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen
        name="(protected)"
        options={{
          headerShown: false
        }} />
        </Stack.Protected>
        <Stack.Screen name="SignUpScreen" />
      </Stack>
    </ThemeProvider>
  )
}
