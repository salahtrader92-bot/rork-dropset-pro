import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAppState } from "@/providers/AppStateProvider";
import { useWorkouts } from "@/providers/WorkoutProvider";
import darkColors from "@/constants/colors";
import { Menu, User, Play, Users2, Sparkles } from "lucide-react-native";
import { EXERCISES } from "@/constants/exercises";
import { Exercise, WorkoutExercise } from "@/types";
import { generateId } from "@/utils/calculations";
import { LinearGradient } from "expo-linear-gradient";

const COLORS = darkColors;

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

  const filteredExercises = EXERCISES.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === "All" || exercise.muscleGroup.toLowerCase() === selectedMuscle.toLowerCase();
    return matchesSearch && matchesMuscle;
  }).slice(0, 6);

  const handleOpenPartnerSync = () => {
    console.log("Navigating to Partner Sync Mode preview");
    setSearchQuery("");
    setSelectedMuscle("All");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Menu size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push("/(tabs)/profile" as never)}
        >
          <User size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Hello, {profile?.name?.split(" ")[0] || "Alex"}!</Text>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Weekly Progress</Text>
          <Text style={styles.progressSubtitle}>3 of 5 Workouts Done</Text>
          <Text style={styles.progressDays}>2 Days Remaining</Text>
          
          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>Weekly Goal</Text>
            <Text style={styles.goalPercentage}>60%</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressBarFill, { width: "60%" }]} />
          </View>
        </View>

        <View style={styles.workoutCard}>
          <View style={styles.workoutImageContainer}>
            <LinearGradient
              colors={['rgba(26, 75, 65, 0.8)', 'rgba(26, 75, 65, 0.3)']}
              style={styles.workoutGradient}
            >
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />
              <View style={styles.decorativeCircle3} />
            </LinearGradient>
          </View>
          
          <View style={styles.workoutContent}>
            <Text style={styles.workoutLabel}>Today’s Workout</Text>
            <Text style={styles.workoutTitle}>Push Day A</Text>
            <Text style={styles.workoutExercises}>
              Bench Press, Overhead Press, Tricep Pushdown...
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartWorkout}
          >
            <Play size={16} color={COLORS.background} fill={COLORS.background} />
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.newOptionSection}>
          <LinearGradient
            colors={["#0b1c18", "#132f27", "#1f473b"]}
            style={styles.partnerCard}
            testID="partner-sync-card"
          >
            <View style={styles.partnerHeaderRow}>
              <View style={styles.partnerBadge}>
                <Sparkles size={14} color={COLORS.primary} />
                <Text style={styles.partnerBadgeText}>New Option</Text>
              </View>
              <Text style={styles.partnerBetaPill}>Beta</Text>
            </View>
            <View style={styles.partnerTitleRow}>
              <Users2 size={24} color={COLORS.background} />
              <View style={styles.partnerTitleContent}>
                <Text style={styles.partnerHeadline}>Partner Sync Mode</Text>
                <Text style={styles.partnerSubline}>
                  Link with a friend for mirrored pacing, live cues, and adaptive intensity suggestions.
                </Text>
              </View>
            </View>
            <View style={styles.partnerChipsRow}>
              <Text style={styles.partnerChip}>Live stats</Text>
              <Text style={styles.partnerChip}>Rep mirroring</Text>
              <Text style={styles.partnerChip}>AI cues</Text>
            </View>
            <TouchableOpacity
              testID="enable-partner-sync"
              style={styles.partnerButton}
              onPress={handleOpenPartnerSync}
            >
              <Text style={styles.partnerButtonText}>Enable Partner Sync</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Exercises</Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.exercisesRow}
          >
            {filteredExercises.slice(0, 4).map((exercise) => (
              <TouchableOpacity 
                key={exercise.id} 
                style={styles.exercisePreviewCard}
                onPress={() => handleAddExercise(exercise)}
              >
                <Image 
                  source={{ uri: exercise.photo }} 
                  style={styles.exercisePreviewImage}
                />
                <View style={styles.exercisePreviewOverlay}>
                  <Text style={styles.exercisePreviewName} numberOfLines={2}>
                    {exercise.name}
                  </Text>
                  <Text style={styles.exercisePreviewMeta}>
                    3 sets, 8-12 reps
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 16,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
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
  greeting: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 24,
  },
  progressCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 8,
  },
  progressSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  progressDays: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  goalRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: COLORS.text,
  },
  goalPercentage: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: COLORS.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: 4,
    overflow: "hidden" as const,
  },
  progressBarFill: {
    height: "100%" as const,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  workoutCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    overflow: "hidden" as const,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  workoutImageContainer: {
    height: 200,
    position: "relative" as const,
  },
  workoutGradient: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  decorativeCircle1: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(76, 120, 100, 0.4)",
    position: "absolute" as const,
    top: 40,
    left: 60,
  },
  decorativeCircle2: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(100, 150, 130, 0.3)",
    position: "absolute" as const,
    bottom: 60,
    right: 80,
  },
  decorativeCircle3: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(120, 170, 145, 0.25)",
    position: "absolute" as const,
    bottom: 30,
    right: 30,
  },
  workoutContent: {
    padding: 20,
    paddingBottom: 16,
  },
  workoutLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500" as const,
    marginBottom: 4,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 8,
  },
  workoutExercises: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  startButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: COLORS.background,
  },
  newOptionSection: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: "hidden" as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 16,
  },
  exercisesRow: {
    gap: 16,
    paddingRight: 20,
  },
  exercisePreviewCard: {
    width: 160,
    height: 220,
    borderRadius: 16,
    overflow: "hidden" as const,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  exercisePreviewImage: {
    width: "100%" as const,
    height: "100%" as const,
    backgroundColor: COLORS.backgroundTertiary,
  },
  partnerCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 16,
  },
  partnerHeaderRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  partnerBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  partnerBadgeText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: "600" as const,
  },
  partnerBetaPill: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700" as const,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  },
  partnerTitleRow: {
    flexDirection: "row" as const,
    gap: 16,
  },
  partnerTitleContent: {
    flex: 1,
  },
  partnerHeadline: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: COLORS.background,
    marginBottom: 6,
  },
  partnerSubline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 20,
  },
  partnerChipsRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  partnerChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    color: COLORS.background,
    fontSize: 12,
    fontWeight: "600" as const,
  },
  partnerButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center" as const,
  },
  partnerButtonText: {
    color: COLORS.card,
    fontSize: 15,
    fontWeight: "700" as const,
  },
  exercisePreviewOverlay: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "rgba(10, 22, 18, 0.9)",
  },
  exercisePreviewName: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  exercisePreviewMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});
