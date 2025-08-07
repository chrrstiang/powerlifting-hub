import { Link, Tabs } from 'expo-router'
import { Button, useTheme } from 'tamagui'
import { Home, PersonStanding, ChartBar } from '@tamagui/lucide-icons'

export default function TabLayout() {
  const theme = useTheme()

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
            <Link href=".." asChild>
              <Button mr="$4" bg="$green8" color="$green12">
                Hello!
              </Button>
            </Link>
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
