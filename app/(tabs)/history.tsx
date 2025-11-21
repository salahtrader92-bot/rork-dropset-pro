import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "@/constants/colors";
import { ChevronLeft, ChevronRight, Dumbbell } from "lucide-react-native";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    return { daysInMonth, startDay };
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const { daysInMonth, startDay } = getDaysInMonth(selectedDate);
  const currentMonth = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const workoutDates = [3, 5, 8, 12, 15, 19, 22, 26];
  
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => navigateMonth("prev")} style={styles.monthButton}>
              <ChevronLeft size={20} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.monthText}>{currentMonth}</Text>
            <TouchableOpacity onPress={() => navigateMonth("next")} style={styles.monthButton}>
              <ChevronRight size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={index} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((day, index) => {
              const hasWorkout = day && workoutDates.includes(day);
              const isToday = day === new Date().getDate() && 
                selectedDate.getMonth() === new Date().getMonth() &&
                selectedDate.getFullYear() === new Date().getFullYear();

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    hasWorkout && styles.dayCellWithWorkout,
                    isToday && styles.dayCellToday,
                  ]}
                  disabled={!day}
                >
                  {day && (
                    <>
                      <Text style={[
                        styles.dayText,
                        hasWorkout && styles.dayTextWithWorkout,
                        isToday && styles.dayTextToday,
                      ]}>
                        {day}
                      </Text>
                      {hasWorkout && <View style={styles.workoutDot} />}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          
          <WorkoutHistoryCard
            date="Today, 2:30 PM"
            duration="45m"
            exercises={5}
            sets={15}
            volume="2,450 kg"
          />
          <WorkoutHistoryCard
            date="Yesterday, 6:00 PM"
            duration="38m"
            exercises={4}
            sets={12}
            volume="1,890 kg"
          />
          <WorkoutHistoryCard
            date="Dec 20, 9:00 AM"
            duration="52m"
            exercises={6}
            sets={18}
            volume="2,780 kg"
          />
        </View>
      </ScrollView>
    </View>
  );
}

function WorkoutHistoryCard({
  date,
  duration,
  exercises,
  sets,
  volume,
}: {
  date: string;
  duration: string;
  exercises: number;
  sets: number;
  volume: string;
}) {
  return (
    <TouchableOpacity style={styles.workoutCard}>
      <View style={styles.workoutIconContainer}>
        <Dumbbell size={20} color={COLORS.primary} />
      </View>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutDate}>{date}</Text>
        <View style={styles.workoutStats}>
          <Text style={styles.workoutStat}>{exercises} exercises</Text>
          <Text style={styles.workoutStatDot}>·</Text>
          <Text style={styles.workoutStat}>{sets} sets</Text>
          <Text style={styles.workoutStatDot}>·</Text>
          <Text style={styles.workoutStat}>{duration}</Text>
        </View>
      </View>
      <View style={styles.workoutVolumeContainer}>
        <Text style={styles.workoutVolume}>{volume}</Text>
        <Text style={styles.workoutVolumeLabel}>volume</Text>
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  title: {
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
  calendarCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  calendarHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 20,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: COLORS.text,
  },
  weekDays: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    marginBottom: 12,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: COLORS.textTertiary,
    textAlign: "center" as const,
    width: 40,
  },
  daysGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
  },
  dayCell: {
    width: "14.28%" as const,
    aspectRatio: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginBottom: 4,
  },
  dayCellWithWorkout: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500" as const,
  },
  dayTextWithWorkout: {
    color: COLORS.primary,
    fontWeight: "700" as const,
  },
  dayTextToday: {
    fontWeight: "700" as const,
  },
  workoutDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    position: "absolute" as const,
    bottom: 4,
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
  workoutCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  workoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.backgroundTertiary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutDate: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  workoutStats: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  workoutStat: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  workoutStatDot: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
  workoutVolumeContainer: {
    alignItems: "flex-end" as const,
  },
  workoutVolume: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: COLORS.text,
  },
  workoutVolumeLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
});
