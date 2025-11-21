import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAppState } from "@/providers/AppStateProvider";
import { Goal, Units } from "@/types";
import COLORS from "@/constants/colors";
import { Dumbbell } from "lucide-react-native";

export default function OnboardingScreen() {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [selectedGoal, setSelectedGoal] = useState<Goal>("hypertrophy");
  const [selectedUnits, setSelectedUnits] = useState<Units>("kg");
  const { createProfile } = useAppState();

  const handleComplete = () => {
    if (name.trim()) {
      createProfile(name.trim(), selectedGoal, selectedUnits);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundSecondary]}
      style={styles.container}
    >
      <View style={[styles.content, { paddingTop: 80 + insets.top, paddingBottom: 40 + insets.bottom }]}>
        <View style={styles.header}>
          <Dumbbell size={48} color={COLORS.primary} />
          <Text style={styles.title}>DropSet Pro</Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? "Welcome! Let&apos;s get started"
              : step === 2
                ? "What&apos;s your primary goal?"
                : "Choose your units"}
          </Text>
        </View>

        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>What&apos;s your name?</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.textTertiary}
              value={name}
              onChangeText={setName}
              autoFocus
              testID="onboarding-name-input"
            />
            <TouchableOpacity
              style={[styles.button, !name.trim() && styles.buttonDisabled]}
              onPress={() => name.trim() && setStep(2)}
              disabled={!name.trim()}
              testID="onboarding-next-button"
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Primary Goal</Text>
            <View style={styles.optionsContainer}>
              <GoalOption
                title="Strength"
                description="Build max power"
                isSelected={selectedGoal === "strength"}
                onPress={() => setSelectedGoal("strength")}
                testID="goal-strength"
              />
              <GoalOption
                title="Hypertrophy"
                description="Maximize muscle"
                isSelected={selectedGoal === "hypertrophy"}
                onPress={() => setSelectedGoal("hypertrophy")}
                testID="goal-hypertrophy"
              />
              <GoalOption
                title="Endurance"
                description="Boost stamina"
                isSelected={selectedGoal === "endurance"}
                onPress={() => setSelectedGoal("endurance")}
                testID="goal-endurance"
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setStep(1)}
                testID="onboarding-back-button"
              >
                <Text style={styles.buttonSecondaryText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={() => setStep(3)}
                testID="onboarding-goal-next-button"
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Weight Units</Text>
            <View style={styles.optionsContainer}>
              <UnitsOption
                title="Kilograms"
                unit="kg"
                isSelected={selectedUnits === "kg"}
                onPress={() => setSelectedUnits("kg")}
                testID="units-kg"
              />
              <UnitsOption
                title="Pounds"
                unit="lbs"
                isSelected={selectedUnits === "lbs"}
                onPress={() => setSelectedUnits("lbs")}
                testID="units-lbs"
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setStep(2)}
                testID="onboarding-units-back-button"
              >
                <Text style={styles.buttonSecondaryText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleComplete}
                testID="onboarding-complete-button"
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
          <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
          <View style={[styles.progressDot, step >= 3 && styles.progressDotActive]} />
        </View>
      </View>
    </LinearGradient>
  );
}

function GoalOption({
  title,
  description,
  isSelected,
  onPress,
  testID,
}: {
  title: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.option, isSelected && styles.optionSelected]}
      onPress={onPress}
      testID={testID}
    >
      <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
        {title}
      </Text>
      <Text style={[styles.optionDescription, isSelected && styles.optionDescriptionSelected]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

function UnitsOption({
  title,
  unit,
  isSelected,
  onPress,
  testID,
}: {
  title: string;
  unit: string;
  isSelected: boolean;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.option, isSelected && styles.optionSelected]}
      onPress={onPress}
      testID={testID}
    >
      <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
        {title}
      </Text>
      <Text style={[styles.optionUnit, isSelected && styles.optionUnitSelected]}>
        {unit}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center" as const,
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center" as const,
  },
  stepContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    color: COLORS.text,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.cardElevated,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: COLORS.primary,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  optionDescriptionSelected: {
    color: COLORS.textSecondary,
  },
  optionUnit: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500" as const,
  },
  optionUnitSelected: {
    color: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: "center" as const,
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPrimary: {
    flex: 1,
  },
  buttonSecondary: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    alignItems: "center" as const,
    marginTop: 24,
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  buttonRow: {
    flexDirection: "row" as const,
    gap: 12,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "700" as const,
  },
  buttonSecondaryText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700" as const,
  },
  progressContainer: {
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    gap: 8,
    marginTop: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
});
