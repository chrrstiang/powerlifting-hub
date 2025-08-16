import { Button, YStack, H1, Form, Label, Select, Adapt, Sheet } from "tamagui";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "@tamagui/lucide-icons";
import { Input } from "components/inputParts";
import { useState } from "react";
import { router } from "expo-router";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { SelectComponent } from "components/selectComponent";

export default function AthleteProfileForm() {
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");

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
            <Button
              iconAfter={ArrowRight}
              onPress={() => router.push("/(protected)/SelectRoleScreen")}
              mt={"$5"}
            >
              Next
            </Button>
          </Form>
        </YStack>
      </YStack>
    </TouchableWithoutFeedback>
  );
}
