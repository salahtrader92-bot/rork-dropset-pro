import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useWorkouts } from "@/providers/WorkoutProvider";
import { useAppState } from "@/providers/AppStateProvider";
import { EXERCISES } from "@/constants/exercises";
import { WorkoutSet, Exercise } from "@/types";
import { generateId, suggestDropsetWeights, formatDuration } from "@/utils/calculations";
import COLORS from "@/constants/colors";
import { Plus, X, Check, ChevronDown, Trash2, Search } from "lucide-react-native";
import * as Haptics from "expo-haptics";

export default function WorkoutSessionScreen() {
  const router = useRouter();
  const { profile } = useAppState();
  const { activeWorkout, addExercise, addSet, updateSet, removeSet, completeWorkout, cancelWorkout } = useWorkouts();
  const [isAddingExercise, setIsAddingExercise] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    if (!activeWorkout) {
      router.back();
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (new Date().getTime() - new Date(activeWorkout.startedAt).getTime()) / 1000
      );
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout, router]);

  const handleAddExercise = (exercise: Exercise) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const workoutExercise = {
      id: generateId(),
      exerciseId: exercise.id,
      exercise,
      sets: [],
      order: activeWorkout?.exercises.length || 0,
    };
    addExercise(workoutExercise);
    setIsAddingExercise(false);
  };

  const handleCompleteWorkout = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    completeWorkout();
    router.back();
  };

  const handleCancelWorkout = () => {
    cancelWorkout();
    router.back();
  };

  if (!activeWorkout) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Workout",
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.text,
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleCancelWorkout}
              style={styles.headerButton}
              testID="cancel-workout-button"
            >
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleCompleteWorkout}
              style={styles.headerButton}
              testID="complete-workout-button"
            >
              <Check size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Duration</Text>
          <Text style={styles.timerText}>{formatDuration(elapsedTime)}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeWorkout.exercises.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No exercises yet</Text>
              <Text style={styles.emptyStateSubtext}>Add an exercise to start tracking</Text>
            </View>
          )}

          {activeWorkout.exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              units={profile?.units || "kg"}
              onAddSet={(set) => addSet(ex.id, set)}
              onUpdateSet={(setId, updates) => updateSet(ex.id, setId, updates)}
              onRemoveSet={(setId) => removeSet(ex.id, setId)}
            />
          ))}

          <TouchableOpacity
            style={styles.addExerciseButton}
            onPress={() => setIsAddingExercise(true)}
            testID="add-exercise-button"
          >
            <Plus size={20} color={COLORS.text} />
            <Text style={styles.addExerciseText}>Add Exercise</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={isAddingExercise}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsAddingExercise(false)}
        >
          <ExercisePicker
            onSelect={handleAddExercise}
            onClose={() => setIsAddingExercise(false)}
          />
        </Modal>
      </View>
    </>
  );
}

interface ExerciseCardProps {
  exercise: {
    id: string;
    exercise: Exercise;
    sets: WorkoutSet[];
  };
  units: "kg" | "lbs";
  onAddSet: (set: WorkoutSet) => void;
  onUpdateSet: (setId: string, updates: Partial<WorkoutSet>) => void;
  onRemoveSet: (setId: string) => void;
}

function ExerciseCard({ exercise, units, onAddSet, onUpdateSet, onRemoveSet }: ExerciseCardProps) {
  const handleAddSet = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: WorkoutSet = {
      id: generateId(),
      reps: lastSet?.reps || 10,
      weight: lastSet?.weight || 0,
      isDropset: false,
      isWarmup: false,
      completedAt: new Date().toISOString(),
    };
    onAddSet(newSet);
  };

  const handleAddDropset = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const lastSet = exercise.sets[exercise.sets.length - 1];
    if (!lastSet) return;

    const dropWeights = suggestDropsetWeights(lastSet.weight, units);

    dropWeights.forEach((weight) => {
      const dropSet: WorkoutSet = {
        id: generateId(),
        reps: lastSet.reps,
        weight,
        isDropset: true,
        isWarmup: false,
        completedAt: new Date().toISOString(),
      };
      onAddSet(dropSet);
    });
  };

  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View>
          <Text style={styles.exerciseName}>{exercise.exercise.name}</Text>
          <Text style={styles.exerciseInfo}>
            {exercise.exercise.muscleGroup} · {exercise.exercise.equipment}
          </Text>
        </View>
        <View style={styles.setSummary}>
          <Text style={styles.setSummaryText}>{exercise.sets.length}</Text>
          <Text style={styles.setSummaryLabel}>sets</Text>
        </View>
      </View>

      <View style={styles.setsContainer}>
        {exercise.sets.length === 0 && (
          <View style={styles.noSetsState}>
            <Text style={styles.noSetsText}>No sets yet</Text>
          </View>
        )}

        {exercise.sets.map((set, index) => (
          <SetRow
            key={set.id}
            set={set}
            setNumber={index + 1}
            units={units}
            onUpdate={(updates) => onUpdateSet(set.id, updates)}
            onRemove={() => onRemoveSet(set.id)}
          />
        ))}
      </View>

      <View style={styles.addSetButtons}>
        <TouchableOpacity
          style={[styles.addSetButton, styles.addSetButtonPrimary]}
          onPress={handleAddSet}
          testID="add-set-button"
        >
          <Plus size={18} color={COLORS.primary} />
          <Text style={styles.addSetButtonText}>Set</Text>
        </TouchableOpacity>

        {exercise.sets.length > 0 && (
          <TouchableOpacity
            style={[styles.addSetButton, styles.addSetButtonSecondary]}
            onPress={handleAddDropset}
            testID="add-dropset-button"
          >
            <ChevronDown size={18} color={COLORS.textSecondary} />
            <Text style={styles.addSetButtonTextSecondary}>Dropset</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

interface SetRowProps {
  set: WorkoutSet;
  setNumber: number;
  units: string;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onRemove: () => void;
}

function SetRow({ set, setNumber, units, onUpdate, onRemove }: SetRowProps) {
  return (
    <View
      style={[styles.setRow, set.isDropset && styles.setRowDropset, set.isWarmup && styles.setRowWarmup]}
    >
      <View style={styles.setNumberContainer}>
        <Text style={styles.setNumberText}>{setNumber}</Text>
        {(set.isDropset || set.isWarmup) && (
          <View style={styles.setBadge}>
            <Text style={styles.setBadgeText}>{set.isDropset ? "DROP" : "WARM"}</Text>
          </View>
        )}
      </View>

      <View style={styles.setInputs}>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={set.weight.toString()}
            onChangeText={(text) => {
              const weight = parseFloat(text) || 0;
              onUpdate({ weight });
            }}
            placeholder="0"
            placeholderTextColor={COLORS.textTertiary}
            testID="set-weight-input"
          />
          <Text style={styles.inputLabel}>{units}</Text>
        </View>

        <Text style={styles.inputSeparator}>×</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={set.reps.toString()}
            onChangeText={(text) => {
              const reps = parseInt(text) || 0;
              onUpdate({ reps });
            }}
            placeholder="0"
            placeholderTextColor={COLORS.textTertiary}
            testID="set-reps-input"
          />
          <Text style={styles.inputLabel}>reps</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onRemove}
        style={styles.deleteButton}
        testID="delete-set-button"
      >
        <Trash2 size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

function ExercisePicker({
  onSelect,
  onClose,
}: {
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState<string>("");

  const filtered = EXERCISES.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.pickerContainer}>
      <View style={styles.pickerHeader}>
        <Text style={styles.pickerTitle}>Add Exercise</Text>
        <TouchableOpacity onPress={onClose} testID="close-picker-button">
          <X size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={COLORS.textTertiary}
          value={search}
          onChangeText={setSearch}
          testID="exercise-search-input"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseItem}
            onPress={() => onSelect(item)}
            testID={`exercise-item-${item.id}`}
          >
            <View>
              <Text style={styles.exerciseItemName}>{item.name}</Text>
              <Text style={styles.exerciseItemInfo}>
                {item.muscleGroup} · {item.equipment}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.pickerList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerButton: {
    padding: 8,
  },
  timerContainer: {
    backgroundColor: COLORS.card,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: "center" as const,
  },
  timerLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timerText: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    alignItems: "center" as const,
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  exerciseCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  exerciseHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  exerciseInfo: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  setSummary: {
    alignItems: "center" as const,
  },
  setSummaryText: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: COLORS.text,
  },
  setSummaryLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  setsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  noSetsState: {
    paddingVertical: 20,
    alignItems: "center" as const,
  },
  noSetsText: {
    fontSize: 14,
    color: COLORS.textTertiary,
  },
  setRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  setRowDropset: {
    borderLeftColor: COLORS.warning,
    backgroundColor: COLORS.backgroundTertiary,
  },
  setRowWarmup: {
    borderLeftColor: COLORS.textTertiary,
    backgroundColor: COLORS.backgroundTertiary,
  },
  setNumberContainer: {
    width: 44,
    alignItems: "center" as const,
  },
  setNumberText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 2,
  },
  setBadge: {
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  setBadgeText: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
  },
  setInputs: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  inputGroup: {
    alignItems: "center" as const,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "600" as const,
    color: COLORS.text,
    minWidth: 70,
    textAlign: "center" as const,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 4,
    fontWeight: "600" as const,
  },
  inputSeparator: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginHorizontal: 10,
    fontWeight: "600" as const,
  },
  deleteButton: {
    padding: 8,
  },
  addSetButtons: {
    flexDirection: "row" as const,
    gap: 8,
  },
  addSetButton: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
  },
  addSetButtonPrimary: {
    backgroundColor: COLORS.backgroundTertiary,
    borderColor: COLORS.border,
  },
  addSetButtonSecondary: {
    backgroundColor: COLORS.backgroundTertiary,
    borderColor: COLORS.border,
  },
  addSetButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: COLORS.primary,
  },
  addSetButtonTextSecondary: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: COLORS.textSecondary,
  },
  addExerciseButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  addExerciseText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: COLORS.text,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  pickerHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pickerTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  pickerList: {
    paddingHorizontal: 20,
  },
  exerciseItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  exerciseItemName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  exerciseItemInfo: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
