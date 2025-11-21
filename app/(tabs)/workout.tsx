import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAppState } from "@/providers/AppStateProvider";
import { useWorkouts } from "@/providers/WorkoutProvider";
import COLORS from "@/constants/colors";
import { Plus, Dumbbell, TrendingUp, CalendarDays, Clock, Search } from "lucide-react-native";
import { EXERCISES } from "@/constants/exercises";
import { Exercise, WorkoutExercise } from "@/types";
import { generateId } from "@/utils/calculations";

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useAppState();
  const { activeWorkout, startWorkout, addExercise } = useWorkouts();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("All");

  const handleStartWorkout = () => {
    if (profile) {
      startWorkout(profile.id);
      router.push("/workout-session" as never);
    }
  };

  const handleAddExercise = (exercise: Exercise) => {
    if (!profile) return;
    
    if (!activeWorkout) {
      startWorkout(profile.id);
    }
    
    const workoutExercise: WorkoutExercise = {
      id: generateId(),
      exerciseId: exercise.id,
      exercise,
      sets: [],
      order: activeWorkout ? activeWorkout.exercises.length : 0,
    };
    
    addExercise(workoutExercise);
    router.push("/workout-session" as never);
  };

  const muscleGroups = ["All", "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quadriceps", "Hamstrings", "Glutes", "Calves", "Abs"];

  const filteredExercises = EXERCISES.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === "All" || exercise.muscleGroup.toLowerCase() === selectedMuscle.toLowerCase();
    return matchesSearch && matchesMuscle;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
          <Text style={styles.greeting}>Today</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeWorkout && (
          <TouchableOpacity
            style={styles.activeWorkoutCard}
            onPress={() => router.push("/workout-session" as never)}
            testID="continue-workout-button"
          >
            <View style={styles.activeWorkoutHeader}>
              <View style={styles.activeWorkoutBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.activeWorkoutBadgeText}>In Progress</Text>
              </View>
            </View>
            <Text style={styles.activeWorkoutTitle}>Continue Workout</Text>
            <View style={styles.activeWorkoutStats}>
              <View style={styles.activeWorkoutStat}>
                <Clock size={16} color={COLORS.textSecondary} />
                <Text style={styles.activeWorkoutStatText}>
                  {Math.floor((Date.now() - new Date(activeWorkout.startedAt).getTime()) / 60000)}m
                </Text>
              </View>
              <View style={styles.activeWorkoutStat}>
                <Dumbbell size={16} color={COLORS.textSecondary} />
                <Text style={styles.activeWorkoutStatText}>
                  {activeWorkout.exercises.length} exercises
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color={COLORS.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor={COLORS.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.muscleFilterContainer}
          contentContainerStyle={styles.muscleFilterContent}
        >
          {muscleGroups.map((muscle) => (
            <TouchableOpacity
              key={muscle}
              style={[
                styles.muscleFilterChip,
                selectedMuscle === muscle && styles.muscleFilterChipActive,
              ]}
              onPress={() => setSelectedMuscle(muscle)}
            >
              <Text
                style={[
                  styles.muscleFilterText,
                  selectedMuscle === muscle && styles.muscleFilterTextActive,
                ]}
              >
                {muscle}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <Text style={styles.exerciseCount}>{filteredExercises.length}</Text>
          </View>
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ExerciseCard exercise={item} onAdd={() => handleAddExercise(item)} />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function ExerciseCard({ exercise, onAdd }: { exercise: Exercise; onAdd: () => void }) {
  return (
    <View style={styles.exerciseCard}>
      <Image source={{ uri: exercise.photo }} style={styles.exerciseImage} />
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName} numberOfLines={1}>
          {exercise.name}
        </Text>
        <View style={styles.exerciseMeta}>
          <View style={styles.exerciseMetaBadge}>
            <Text style={styles.exerciseMetaText}>
              {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)}
            </Text>
          </View>
          <View style={styles.exerciseMetaBadge}>
            <Text style={styles.exerciseMetaText}>
              {exercise.equipment.charAt(0).toUpperCase() + exercise.equipment.slice(1)}
            </Text>
          </View>
          {exercise.difficulty && (
            <View style={[
              styles.exerciseMetaBadge,
              exercise.difficulty === "beginner" && styles.difficultyBeginner,
              exercise.difficulty === "intermediate" && styles.difficultyIntermediate,
              exercise.difficulty === "advanced" && styles.difficultyAdvanced,
            ]}>
              <Text style={[
                styles.exerciseMetaText,
                exercise.difficulty === "beginner" && styles.difficultyBeginnerText,
                exercise.difficulty === "intermediate" && styles.difficultyIntermediateText,
                exercise.difficulty === "advanced" && styles.difficultyAdvancedText,
              ]}>
                {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Plus size={20} color={COLORS.primary} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  date: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500" as const,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  startWorkoutCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  startWorkoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundTertiary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 16,
  },
  startWorkoutText: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: COLORS.text,
  },
  activeWorkoutCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  activeWorkoutHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  activeWorkoutBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  activeWorkoutBadgeText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: COLORS.primary,
  },
  activeWorkoutTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 12,
  },
  activeWorkoutStats: {
    flexDirection: "row" as const,
    gap: 16,
  },
  activeWorkoutStat: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  activeWorkoutStatText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500" as const,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row" as const,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.backgroundTertiary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 12,
  },
  searchSection: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500" as const,
  },
  muscleFilterContainer: {
    marginBottom: 20,
  },
  muscleFilterContent: {
    gap: 8,
    paddingRight: 20,
  },
  muscleFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  muscleFilterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  muscleFilterText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: COLORS.textSecondary,
  },
  muscleFilterTextActive: {
    color: "#000",
  },
  sectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 12,
  },
  exerciseCount: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: COLORS.textTertiary,
  },
  exerciseCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundTertiary,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: COLORS.text,
    marginBottom: 6,
  },
  exerciseMeta: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 6,
  },
  exerciseMetaBadge: {
    backgroundColor: COLORS.backgroundTertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  exerciseMetaText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: COLORS.textSecondary,
  },
  difficultyBeginner: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
  },
  difficultyBeginnerText: {
    color: "#22c55e",
  },
  difficultyIntermediate: {
    backgroundColor: "rgba(234, 179, 8, 0.1)",
  },
  difficultyIntermediateText: {
    color: "#eab308",
  },
  difficultyAdvanced: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  difficultyAdvancedText: {
    color: "#ef4444",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundTertiary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginLeft: 12,
  },
});
