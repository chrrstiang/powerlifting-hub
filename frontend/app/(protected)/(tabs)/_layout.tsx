import { Link, router, Tabs } from 'expo-router'
import { Button, useTheme } from 'tamagui'
import { Home, PersonStanding, ChartBar } from '@tamagui/lucide-icons'
import { useAuth } from 'contexts/AuthContext'

export default function TabLayout() {
  const theme = useTheme()
  const { logout } = useAuth();

  const handleLogout = async () => {
    console.log('Attempting to logout')
    await logout();
    router.replace('/SignUpScreen')
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home tab',
          tabBarIcon: ({ color }) => <Home color={color as any} />,
          headerRight: () => (
              <Button mr="$4" bg="$green8" color="$green12" onPress={handleLogout}>
                Logout
              </Button>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Program',
          tabBarIcon: ({ color }) => <ChartBar color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <PersonStanding color={color as any} />,
        }}
      />
    </Tabs>
  )
}
