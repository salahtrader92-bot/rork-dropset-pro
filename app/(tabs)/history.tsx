import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useWorkouts } from "@/providers/WorkoutProvider";
import { formatDuration } from "@/utils/calculations";
import { Workout } from "@/types";
import COLORS from "@/constants/colors";
import { ChevronLeft, Menu, Dumbbell, TrendingUp } from "lucide-react-native";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { workouts } = useWorkouts();

  const groupedWorkouts = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const completed = workouts.filter((w) => w.completedAt);
    const sorted = completed.sort(
      (a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
    );

    const thisWeek = sorted.filter(
      (w) => new Date(w.completedAt!) >= oneWeekAgo
    );
    const lastWeek = sorted.filter(
      (w) => new Date(w.completedAt!) >= twoWeeksAgo && new Date(w.completedAt!) < oneWeekAgo
    );
    const older = sorted.filter(
      (w) => new Date(w.completedAt!) < twoWeeksAgo
    );

    return { thisWeek, lastWeek, older };
  }, [workouts]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Workout History</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Menu size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {groupedWorkouts.thisWeek.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>THIS WEEK</Text>
            {groupedWorkouts.thisWeek.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </View>
        )}

        {groupedWorkouts.lastWeek.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>LAST WEEK</Text>
            {groupedWorkouts.lastWeek.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </View>
        )}

        {groupedWorkouts.older.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>OLDER</Text>
            {groupedWorkouts.older.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </View>
        )}

        {workouts.length === 0 && (
          <View style={styles.emptyState}>
            <Dumbbell size={48} color={COLORS.textTertiary} />
            <Text style={styles.emptyStateText}>No workout history yet</Text>
            <Text style={styles.emptyStateSubtext}>Complete your first workout to see it here</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

interface WorkoutCardProps {
  workout: Workout;
}

function WorkoutCard({ workout }: WorkoutCardProps) {
  const exerciseNames = workout.exercises
    .slice(0, 3)
    .map((ex) => ex.exercise.name)
    .join(", ");
  const moreCount = workout.exercises.length - 3;
  const exercisesText = moreCount > 0 ? `${exerciseNames}... +${moreCount} more` : exerciseNames;

  const date = new Date(workout.completedAt!);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const durationStr = workout.duration ? formatDuration(workout.duration) : "N/A";
  const volumeStr = `${(workout.totalVolume / 1000).toFixed(1)} kg`;

  const hasCardioExercise = workout.exercises.some(
    (ex) => ex.exercise.muscleGroup === "cardio"
  );
  const isCardio = hasCardioExercise;
  
  return (
    <TouchableOpacity style={styles.workoutCard}>
      <View style={styles.workoutIcon}>
        {isCardio ? (
          <TrendingUp size={20} color={COLORS.primary} />
        ) : (
          <Dumbbell size={20} color={COLORS.primary} />
        )}
      </View>
      
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutTitle}>Workout</Text>
        <Text style={styles.workoutExercises} numberOfLines={1}>
          {exercisesText || "No exercises"}
        </Text>
        <Text style={styles.workoutMeta}>
          {dateStr} • {durationStr} • {volumeStr}
        </Text>
      </View>

      <View style={styles.chevronIcon}>
        <ChevronLeft size={20} color={COLORS.textTertiary} style={{ transform: [{ rotate: '180deg' }] }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: COLORS.text,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 20,
    textAlign: "center" as const,
  },
  workoutCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundTertiary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 6,
  },
  workoutExercises: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  workoutMeta: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  chevronIcon: {
    width: 24,
    height: 24,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  emptyState: {
    alignItems: "center" as const,
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center" as const,
  },
});
