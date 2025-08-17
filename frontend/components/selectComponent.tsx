import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { Adapt, Select, Sheet, YStack } from "tamagui";

type SelectComponentProps<T> = {
  value: T | null;
  setValue: (val: T) => void;
  placeholder?: string;
  values: T[];
  width?: number;
  id?: string;
  displayKey?: keyof T;
};

export function SelectComponent<T extends string | Record<string, any>>({
  value,
  setValue,
  placeholder,
  values,
  width = 300,
  id = "select-component",
  displayKey,
}: SelectComponentProps<T>) {
  return (
    <Select
      id={id}
      value={
        value && typeof value === "object" && displayKey
          ? String(value[displayKey])
          : String(value ?? "")
      }
      onValueChange={(selectedValue) => {
        if (displayKey) {
          // find the object that matches the chosen key
          const obj = values.find(
            (v) =>
              typeof v === "object" &&
              v !== null &&
              String(v[displayKey]) === selectedValue
          );
          if (obj) {
            setValue(obj as T);
            return;
          }
        }
        setValue(selectedValue as T); // for plain strings
      }}
      disablePreventBodyScroll
    >
      <Select.Trigger width={width} iconAfter={ChevronDown}>
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>

      <Adapt when="maxMd" platform="touch">
        <Sheet modal dismissOnSnapToBottom animation="medium">
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            backgroundColor="$shadowColor"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
        </Select.ScrollUpButton>

        <Select.Viewport minWidth={200}>
          <Select.Group>
            {values.map((val, index) => {
              const itemDisplay =
                displayKey && typeof val === "object" && val !== null
                  ? String(val[displayKey])
                  : String(val);

              return (
                <Select.Item
                  key={`${id}-${itemDisplay}-${index}`}
                  index={index}
                  value={itemDisplay}
                >
                  <Select.ItemText>{itemDisplay}</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              );
            })}
          </Select.Group>
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}
