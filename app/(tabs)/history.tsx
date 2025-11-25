import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "@/constants/colors";
import { ChevronLeft, Menu, Dumbbell, TrendingUp } from "lucide-react-native";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  const workouts = [
    {
      id: 1,
      title: "Push Day",
      exercises: "Bench Press, Squat, Overhead Press...",
      date: "Jan 28, 2024",
      duration: "45 min",
      volume: "12,500 lbs",
      section: "THIS WEEK"
    },
    {
      id: 2,
      title: "Full Body Strength",
      exercises: "Deadlift, Pull-ups, Leg Press...",
      date: "Jan 26, 2024",
      duration: "60 min",
      volume: "15,200 lbs",
      section: "THIS WEEK"
    },
    {
      id: 3,
      title: "Leg Day",
      exercises: "Squats, Lunges, Calf Raises...",
      date: "Jan 24, 2024",
      duration: "55 min",
      volume: "18,000 lbs",
      section: "THIS WEEK"
    },
    {
      id: 4,
      title: "Cardio & Core",
      exercises: "Treadmill Run, Planks, Crunches...",
      date: "Jan 22, 2024",
      duration: "30 min",
      volume: "3.5 mi",
      section: "LAST WEEK"
    },
    {
      id: 5,
      title: "Pull Day",
      exercises: "Pull-ups, Barbell Rows, Bicep Curls...",
      date: "Jan 20, 2024",
      duration: "50 min",
      volume: "11,800 lbs",
      section: "LAST WEEK"
    },
  ];

  const thisWeekWorkouts = workouts.filter(w => w.section === "THIS WEEK");
  const lastWeekWorkouts = workouts.filter(w => w.section === "LAST WEEK");

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
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
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>THIS WEEK</Text>
          {thisWeekWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>LAST WEEK</Text>
          {lastWeekWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

interface WorkoutCardProps {
  workout: {
    id: number;
    title: string;
    exercises: string;
    date: string;
    duration: string;
    volume: string;
  };
}

function WorkoutCard({ workout }: WorkoutCardProps) {
  const isCardio = workout.title.includes("Cardio");
  
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
        <Text style={styles.workoutTitle}>{workout.title}</Text>
        <Text style={styles.workoutExercises} numberOfLines={1}>
          {workout.exercises}
        </Text>
        <Text style={styles.workoutMeta}>
          {workout.date} • {workout.duration} • {workout.volume}
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
});
