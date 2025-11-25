import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useWorkouts } from "@/providers/WorkoutProvider";
import { calculateOneRepMax } from "@/utils/calculations";
import COLORS from "@/constants/colors";
import { ChevronLeft, Share2, Calendar, Dumbbell, ChevronDown } from "lucide-react-native";
import Svg, { Path } from "react-native-svg";

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { workouts, personalRecords } = useWorkouts();
  const [selectedTab, setSelectedTab] = useState<"Overview" | "Strength" | "Volume" | "Consistency">("Overview");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Last 30 Days");
  const [selectedFilter, setSelectedFilter] = useState<string>("All Exercises");

  const tabs = ["Overview", "Strength", "Volume", "Consistency"];

  const analytics = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentWorkouts = workouts.filter(
      (w) => w.completedAt && new Date(w.completedAt) >= thirtyDaysAgo
    );

    const totalVolume = recentWorkouts.reduce((sum, w) => sum + w.totalVolume, 0);

    const workoutDates = recentWorkouts.map((w) =>
      new Date(w.completedAt!).toDateString()
    );
    const uniqueDates = new Set(workoutDates);
    const sortedDates = Array.from(uniqueDates).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    let longestStreak = 0;
    let currentStreak = 0;
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const dayDiff = Math.floor(
          (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, currentStreak);
    }

    const topPR = Object.values(personalRecords).sort(
      (a, b) => b.oneRepMax - a.oneRepMax
    )[0];

    return {
      totalWorkouts: recentWorkouts.length,
      longestStreak,
      totalVolume,
      topPR,
    };
  }, [workouts, personalRecords]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Performance Analytics</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.tabActive,
              ]}
              onPress={() => setSelectedTab(tab as any)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filtersRow}>
          <TouchableOpacity style={styles.filterButton}>
            <Calendar size={16} color={COLORS.text} />
            <Text style={styles.filterText}>{selectedPeriod}</Text>
            <ChevronDown size={16} color={COLORS.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton}>
            <Dumbbell size={16} color={COLORS.text} />
            <Text style={styles.filterText}>{selectedFilter}</Text>
            <ChevronDown size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Workouts</Text>
            <Text style={styles.statValue}>{analytics.totalWorkouts}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Longest Streak</Text>
            <Text style={styles.statValue}>{analytics.longestStreak} Days</Text>
          </View>
        </View>

        <View style={styles.volumeCard}>
          <Text style={styles.volumeLabel}>Total Volume Lifted</Text>
          <Text style={styles.volumeValue}>
            {(analytics.totalVolume / 1000).toFixed(1)} kg
          </Text>
        </View>

        {analytics.topPR && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Top Personal Record</Text>
              <View style={styles.prBadge}>
                <Text style={styles.prBadgeText}>🏆 Best PR</Text>
              </View>
            </View>
            
            <Text style={styles.exerciseName}>Exercise ID: {analytics.topPR.exerciseId}</Text>
            <Text style={styles.prValue}>
              {analytics.topPR.weight} kg × {analytics.topPR.reps} reps
            </Text>
            
            <View style={styles.prChange}>
              <Text style={styles.prChangeLabel}>Est. 1RM</Text>
              <Text style={styles.prChangeValue}>
                {analytics.topPR.oneRepMax.toFixed(1)} kg
              </Text>
            </View>

            <View style={styles.chartContainer}>
              <Svg width="100%" height="160" viewBox="0 0 440 160">
                <Path
                  d="M 20 120 Q 50 80, 90 90 T 160 70 T 240 85 T 310 45 T 400 65"
                  stroke={COLORS.primary}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </Svg>
              <View style={styles.chartLabels}>
                <Text style={styles.chartLabel}>4 Wks Ago</Text>
                <Text style={styles.chartLabel}>2 Wks Ago</Text>
                <Text style={styles.chartLabel}>Today</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.consistencyCard}>
          <Text style={styles.consistencyTitle}>Workout Consistency</Text>
          
          <View style={styles.weekDays}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          <View style={styles.consistencyGrid}>
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (34 - i));
              const dateStr = date.toDateString();
              
              const dayWorkouts = workouts.filter(
                (w) => w.completedAt && new Date(w.completedAt).toDateString() === dateStr
              );
              
              const hasWorkout = dayWorkouts.length > 0;
              const totalVolume = dayWorkouts.reduce((sum, w) => sum + w.totalVolume, 0);
              const intensity = hasWorkout
                ? totalVolume > 15000
                  ? 'high'
                  : totalVolume > 8000
                  ? 'medium'
                  : 'low'
                : 'none';
              
              return (
                <View
                  key={i}
                  style={[
                    styles.consistencyCell,
                    intensity === 'high' && styles.consistencyCellHigh,
                    intensity === 'medium' && styles.consistencyCellMedium,
                    intensity === 'low' && styles.consistencyCellLow,
                  ]}
                />
              );
            })}
          </View>
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  filtersRow: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600" as const,
    color: COLORS.text,
  },
  statsGrid: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500" as const,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: COLORS.text,
  },
  volumeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  volumeLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500" as const,
    marginBottom: 8,
  },
  volumeValue: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: COLORS.text,
  },
  progressCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: COLORS.text,
  },
  prBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  prBadgeText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: COLORS.primary,
  },
  exerciseName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500" as const,
    marginBottom: 8,
  },
  prValue: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 8,
  },
  prChange: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 20,
  },
  prChangeLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500" as const,
  },
  prChangeValue: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: COLORS.primary,
  },
  chartContainer: {
    marginTop: 8,
  },
  chartLabels: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500" as const,
  },
  consistencyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  consistencyTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: COLORS.text,
    marginBottom: 16,
  },
  weekDays: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 12,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: COLORS.textSecondary,
    width: 32,
    textAlign: "center" as const,
  },
  consistencyGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 4,
  },
  consistencyCell: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: COLORS.backgroundTertiary,
  },
  consistencyCellLow: {
    backgroundColor: "rgba(0, 255, 135, 0.2)",
  },
  consistencyCellMedium: {
    backgroundColor: "rgba(0, 255, 135, 0.5)",
  },
  consistencyCellHigh: {
    backgroundColor: COLORS.primary,
  },
});
