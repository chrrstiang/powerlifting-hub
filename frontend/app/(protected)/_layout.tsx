import { Redirect, router, Stack } from "expo-router";
import { FormProvider } from "contexts/FormContext";
import { supabase } from "lib/supabase";
import { ID_KEY } from "contexts/AuthContext";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function ProtectedLayout() {
  const [completedProfile, setCompletedProfile] = useState(false);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    const id = await SecureStore.getItemAsync(ID_KEY);
    const { data, error } = await supabase
      .from("users")
      .select("name, username, gender, date_of_birth")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error("Could not find user info.");
    }

    if (
      data.name == null ||
      data.username == null ||
      data.gender == null ||
      data.date_of_birth == null
    ) {
      console.error("Profile is not completed. Redirecting to completion form");
    }

    setCompletedProfile(true);
  };

  console.log("🤩 Made it to protected route!");

  return (
    <FormProvider>
      <Stack>
        <Stack.Protected guard={!completedProfile}>
          <Stack.Screen
            name="ProfileCompleteScreen"
            options={{
              headerShown: false,
            }}
          />
        </Stack.Protected>
        <Stack.Protected guard={completedProfile}>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack.Protected>
      </Stack>
    </FormProvider>
  );
}
