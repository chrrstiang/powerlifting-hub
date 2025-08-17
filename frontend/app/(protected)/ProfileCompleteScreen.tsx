import { Button, YStack, H1, Form, Label, Select, Adapt, Sheet } from "tamagui";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "@tamagui/lucide-icons";
import { Input } from "components/inputParts";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { SelectComponent } from "components/selectComponent";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "contexts/AuthContext";

export const NAME_KEY = "user_profile_name";
export const USERNAME_KEY = "user_profile_username";
export const GENDER_KEY = "user_profile_gender";
export const DATE_OF_BIRTH_KEY = "user_profile_date_of_birth";

export default function CompleteProfileForm() {
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const { logout } = useAuth();

  useEffect(() => {
    console.log(`Updated gender to ${gender}`);
  }, [gender]);

  // store info for submit later on
  const handleNext = async () => {
    try {
      if (!name || !username || !gender || !dob) {
        throw new Error("Please make sure all fields are filled out.");
      }
      await SecureStore.setItemAsync(NAME_KEY, name);
      await SecureStore.setItemAsync(USERNAME_KEY, username);
      await SecureStore.setItemAsync(GENDER_KEY, gender);
      await SecureStore.setItemAsync(DATE_OF_BIRTH_KEY, dob);

      router.replace("/(protected)/SelectRoleScreen");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <YStack m={"$8"} justify={"center"} alignItems="center" fullscreen>
        <YStack gap="$10">
          <H1 text={"center"} size="$8">
            Complete your profile
          </H1>
          <Form gap="$4">
            <Input size={"$4"}>
              <Input.Label htmlFor="name">Full Name</Input.Label>
              <Input.Box>
                <Input.Area
                  id="name"
                  placeholder="Christian Garcia"
                  value={name}
                  onChangeText={setName}
                />
              </Input.Box>
            </Input>
            <Input size={"$4"}>
              <Input.Label htmlFor="username">Username</Input.Label>
              <Input.Box>
                <Input.Area
                  id="username"
                  placeholder="chrrstian_"
                  value={username}
                  onChangeText={setUsername}
                />
              </Input.Box>
            </Input>
            <YStack>
              <Label htmlFor="gender">Gender</Label>
              <SelectComponent
                value={gender}
                setValue={setGender}
                placeholder="Select a gender"
                values={["Male", "Female", "Gender-fluid"]}
              />
            </YStack>
            <Input size={"$4"}>
              <Input.Label htmlFor="date_of_birth">Date of Birth</Input.Label>
              <Input.Box>
                <Input.Area
                  id="date_of_birth"
                  placeholder="MM-DD-YYYY"
                  value={dob}
                  onChangeText={setDob}
                />
              </Input.Box>
            </Input>
            <Button iconAfter={ArrowRight} onPress={handleNext} mt={"$5"}>
              Next
            </Button>
          </Form>
        </YStack>
      </YStack>
    </TouchableWithoutFeedback>
  );
}
