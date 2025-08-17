// FormContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Division,
  Federation,
  WeightClass,
} from "app/(protected)/AthleteInfoForm";

// Types
type UserType = "athlete" | "coach" | "";

interface FormData {
  // Basic user info
  name: string;
  username: string;
  email: string;
  gender: string;
  date_of_birth: string;
  userType: UserType;

  // Athlete-specific fields
  federation: Federation | null;
  division?: Division | null;
  weight_class?: WeightClass | null;

  // Coach-specific fields
  certifications?: string[];
  degrees?: string[];
  experience?: string;
}

interface FormContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

// Initial form state
const initialFormData: FormData = {
  name: "",
  username: "",
  email: "",
  gender: "",
  date_of_birth: "",
  userType: "",
  federation: null,
  division: null,
  weight_class: null,
  certifications: [],
  degrees: [],
  experience: "",
};

// Storage key
const FORM_STORAGE_KEY = "@powerlifting_form_data";

const FormContext = createContext<FormContextType | null>(null);

// Form Provider Component
export function FormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Load saved form data on mount
  useEffect(() => {
    loadFormData();
  }, []);

  // Auto-save form data whenever it changes
  useEffect(() => {
    saveFormData();
  }, [formData]);

  const loadFormData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(FORM_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      }
    } catch (error) {
      console.error("Error loading form data:", error);
    }
  };

  const saveFormData = async () => {
    try {
      await AsyncStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const contextValue: FormContextType = {
    formData,
    updateFormData,
  };

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
}

// Custom hook
export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
