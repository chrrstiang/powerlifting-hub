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
import { supabase } from "lib/supabase";

type Federation = {
  id: string;
  code: string;
};

type Division = {
  name: string;
};

type WeightClass = {
  name: string;
};

export default function AthleteProfileForm() {
  const { formData, updateFormData } = useForm();
  const [federations, setFederations] = useState<Federation[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [weightClasses, setWeightClasses] = useState<WeightClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    fetchFederations();
  });

  const fetchFederations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("federations")
      .select("id, code");

    if (error || !data) {
      throw new Error(error.message);
    }

    setFederations(data);
    setLoading(false);
  };

  // find divs/wc's, sets canProceed to true
  const handleProceed = async () => {
    setLoading(true);
    const selectedFed = federations.find(
      (f) => f.code === formData.federation.code
    );
    if (selectedFed) {
      const divisions = await fetchDivisions(selectedFed);
      const weightClasses = await fetchWeightClasses(selectedFed);
      setDivisions(divisions);
      setWeightClasses(weightClasses);
    }
    setLoading(false);
  };

  const fetchDivisions = async (selectedFed) => {
    const { data, error } = await supabase
      .from("divisions")
      .select("name")
      .eq("federation-id", selectedFed.id);

    if (error || !data) {
      throw new Error(error.message);
    }

    return data;
  };

  const fetchWeightClasses = async (selectedFed) => {
    const { data, error } = await supabase
      .from("weight_classes")
      .select("name")
      .eq("federation-id", selectedFed.id);
    // also condition by gender

    if (error || !data) {
      throw new Error(error.message);
    }

    return data;
  };

  const handleFederationSelect = async (fedCode) => {
    // Reset dependent fields
    updateFormData({
      federation: fedCode,
      division: "",
      weightClass: "",
    });
  };

  // updates stored form data, and fetches
  const handleDivisionSelect = async (divisionName) => {
    updateFormData({
      division: divisionName,
    });
  };

  const handleWeightClassSelect = (weightClassName) => {
    updateFormData({ weightClass: weightClassName });
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <YStack m={"$8"} justify={"center"} alignItems="center" fullscreen>
        {!formData.federation && !canProceed && (
          <YStack gap="$10">
            <H1 text={"center"} size="$8">
              What federation do you compete in?
            </H1>
            <Form gap="$4">
              <SelectComponent
                value={formData.federation}
                setValue={handleFederationSelect}
                placeholder="IPF, USAPL..."
                values={federations}
              />
              <Button iconAfter={ArrowRight} onPress={handleProceed} mt={"$5"}>
                Next
              </Button>
            </Form>
          </YStack>
        )}

        {formData.federation && canProceed && (
          <YStack gap="$10">
            <H1 text={"center"} size="$8">
              Pick your division
            </H1>
            <Form gap="$4">
              <Label>Division</Label>
              <SelectComponent
                value={formData.division}
                setValue={handleDivisionSelect}
                placeholder="Pick a Division"
                values={federations}
              />
              <Label>Weight Class</Label>
              <SelectComponent
                value={formData.federation}
                setValue={handleFederationSelect}
                placeholder="Pick a weight class"
                values={federations}
              />
              <Button iconAfter={ArrowRight} onPress={handleProceed} mt={"$5"}>
                Next
              </Button>
            </Form>
          </YStack>
        )}
        <YStack gap="$10">
          <H1 text={"center"} size="$8">
            What federation do you compete in?
          </H1>
          <Form gap="$4">
            <SelectComponent
              value={formData.federation}
              setValue={handleFederationSelect}
              placeholder="IPF, USAPL..."
              values={federations}
            />
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

function useForm(): { formData: any; updateFormData: any } {
  throw new Error("Function not implemented.");
}
