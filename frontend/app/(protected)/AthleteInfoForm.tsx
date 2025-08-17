import { Button, YStack, H1, Form, Label, Spinner } from "tamagui";
import { ArrowRight } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { SelectComponent } from "components/selectComponent";
import { supabase } from "lib/supabase";
import { useForm } from "contexts/FormContext";
import * as SecureStore from "expo-secure-store";
import {
  NAME_KEY,
  USERNAME_KEY,
  GENDER_KEY,
  DATE_OF_BIRTH_KEY,
} from "./ProfileCompleteScreen";
import { ACCESS_TOKEN_KEY, useAuth } from "contexts/AuthContext";

export type Federation = {
  id: string;
  code: string;
};

export type Division = {
  name: string;
};

export type WeightClass = {
  name: string;
};

export default function AthleteProfileForm() {
  const { formData, updateFormData } = useForm();
  const { getValidAccessToken } = useAuth();
  const [federations, setFederations] = useState<Federation[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [weightClasses, setWeightClasses] = useState<WeightClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [federationCodes, setFederationCodes] = useState<string[]>([]);

  useEffect(() => {
    fetchFederations();
    updateFormData({
      federation: null,
    });
  }, []);

  useEffect(() => {
    console.timeLog(`Updated form data to ${formData}`);
  }, [formData]);

  const fetchFederations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("federations")
      .select("id, code");

    if (error || !data) {
      throw new Error(error.message);
    }

    setFederations(data);
    setFederationCodes(data.map((f) => f.code));
    setLoading(false);
  };

  // find divs/wc's, sets canProceed to true
  const handleProceed = async () => {
    setLoading(true);
    const selectedFed = federations.find(
      (f) => f.code === formData.federation?.code
    );
    if (selectedFed) {
      const divisions = await fetchDivisions(selectedFed);
      const weightClasses = await fetchWeightClasses(selectedFed);
      console.log(`Found these divisions: ${divisions}`);
      console.log(`Found these weight classes: ${weightClasses}`);
      setDivisions(divisions);
      setWeightClasses(weightClasses);
      setCanProceed(true);
    }
    setLoading(false);
  };

  const fetchDivisions = async (selectedFed: Federation) => {
    const { data, error } = await supabase
      .from("divisions")
      .select("name")
      .eq("federation_id", selectedFed.id);

    if (error || !data) {
      throw new Error(error.message);
    }

    return data;
  };

  const fetchWeightClasses = async (selectedFed: Federation) => {
    const { data, error } = await supabase
      .from("weight_classes")
      .select("name")
      .eq("federation_id", selectedFed.id);
    // also condition by gender

    if (error || !data) {
      throw new Error(error.message);
    }

    return data;
  };

  const handleFederationSelect = async (fed: Federation) => {
    // Reset dependent fields
    updateFormData({
      federation: fed,
      division: null,
      weight_class: null,
    });

    console.log(`Set form data fed to ${fed.code}`);
  };

  // updates stored form data, and fetches
  const handleDivisionSelect = async (division: Division) => {
    updateFormData({
      division: division,
    });
  };

  const handleWeightClassSelect = (weight_class: WeightClass) => {
    updateFormData({ weight_class: weight_class });
  };

  const handleBack = (resetFields) => {
    updateFormData(resetFields);
    // Clear dependent arrays
    if (resetFields.federation === "") {
      setDivisions([]);
      setWeightClasses([]);
    } else if (resetFields.division === "") {
      setWeightClasses([]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const name = await SecureStore.getItemAsync(NAME_KEY);
      const username = await SecureStore.getItemAsync(USERNAME_KEY);
      const gender = await SecureStore.getItemAsync(GENDER_KEY);
      const date_of_birth = await SecureStore.getItemAsync(DATE_OF_BIRTH_KEY);
      const federation = formData.federation?.code;
      const weight_class = formData.weight_class?.name;
      const division = formData.division?.name;
      const token = await getValidAccessToken();

      if (!token) {
        throw new Error("Could nto get a valid access token...😭");
      }

      const response = await fetch("http://10.0.0.8:3000/athlete/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          username,
          gender,
          date_of_birth,
          federation,
          weight_class: weight_class ?? null,
          division: division ?? null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to complete profile: ${data.message}`);
      }

      console.log("Successful profile creation, onto tabs 😃");
      router.replace("/(protected)/(tabs)");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const currentFederation = formData.federation as Federation | null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <YStack m={"$8"} justify={"center"} alignItems="center" fullscreen>
        {(!formData.federation || !canProceed) && (
          <YStack gap="$8">
            <H1 size="$8">What federation do you compete?</H1>
            <SelectComponent<Federation>
              value={currentFederation}
              setValue={handleFederationSelect}
              placeholder="IPF, USAPL..."
              values={federations}
              displayKey="code"
            />
            {loading ? (
              <Button iconAfter={Spinner} onPress={handleProceed} mt={"$5"}>
                Next
              </Button>
            ) : (
              <Button iconAfter={ArrowRight} onPress={handleProceed} mt={"$5"}>
                Next
              </Button>
            )}
          </YStack>
        )}

        {formData.federation && canProceed && (
          <YStack gap="$8">
            <H1 text={"center"} size="$8">
              Pick your division & weight class
            </H1>
            <Form gap="$4">
              {/*For some reason, the first select component of this parent NEVER opens
                so I just added an extra one. I'll find a fix eventually.*/}
              <YStack style={{ opacity: 0 }} height={"$0"}>
                <SelectComponent<Division>
                  value={null}
                  setValue={handleDivisionSelect}
                  placeholder="Extra"
                  values={divisions}
                  displayKey="name"
                />
              </YStack>
              <Label>Division</Label>
              <SelectComponent<Division>
                value={formData.division || null}
                setValue={handleDivisionSelect}
                placeholder="Pick a Division"
                values={divisions}
                displayKey="name"
              />
              <Label>Weight Class</Label>
              <SelectComponent
                value={formData.weight_class || null}
                setValue={handleWeightClassSelect}
                placeholder="Pick a weight class"
                values={weightClasses}
                displayKey="name"
              />
              {loading ? (
                <Button iconAfter={Spinner} onPress={handleSubmit} mt={"$5"}>
                  Submit
                </Button>
              ) : (
                <Button iconAfter={ArrowRight} onPress={handleSubmit} mt={"$5"}>
                  Submit
                </Button>
              )}
            </Form>
          </YStack>
        )}
      </YStack>
    </TouchableWithoutFeedback>
  );
}
