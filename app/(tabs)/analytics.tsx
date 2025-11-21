import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "@/constants/colors";
import { TrendingUp, TrendingDown, Flame, Trophy, Calendar } from "lucide-react-native";

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          
          <View style={styles.statsGrid}>
            <StatCard
              icon={<Calendar size={20} color={COLORS.primary} />}
              label="Workouts"
              value="12"
              change="+3"
              isPositive={true}
            />
            <StatCard
              icon={<Trophy size={20} color={COLORS.primary} />}
              label="Total Volume"
              value="28.5k"
              unit="kg"
              change="+12%"
              isPositive={true}
            />
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              icon={<Flame size={20} color={COLORS.primary} />}
              label="Streak"
              value="7"
              unit="days"
              change="+2"
              isPositive={true}
            />
            <StatCard
              icon={<TrendingUp size={20} color={COLORS.primary} />}
              label="Avg Duration"
              value="42"
              unit="min"
              change="-5%"
              isPositive={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Volume Progress</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartPlaceholder}>
              <View style={styles.barChart}>
                {[65, 45, 80, 55, 70, 85, 60].map((height, index) => (
                  <View key={index} style={styles.barContainer}>
                    <View style={[styles.bar, { height: `${height}%` }]} />
                    <Text style={styles.barLabel}>
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Records</Text>
          
          <PRCard
            exercise="Bench Press"
            weight="100 kg"
            date="Dec 22, 2024"
            improvement="+5 kg"
          />
          <PRCard
            exercise="Squat"
            weight="140 kg"
            date="Dec 20, 2024"
            improvement="+10 kg"
          />
          <PRCard
            exercise="Deadlift"
            weight="180 kg"
            date="Dec 18, 2024"
            improvement="+15 kg"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Muscle Groups</Text>
          <View style={styles.muscleGroupCard}>
            <MuscleGroupBar label="Chest" value={85} color={COLORS.primary} />
            <MuscleGroupBar label="Back" value={72} color={COLORS.primary} />
            <MuscleGroupBar label="Legs" value={65} color={COLORS.primary} />
            <MuscleGroupBar label="Shoulders" value={58} color={COLORS.primary} />
            <MuscleGroupBar label="Arms" value={45} color={COLORS.primary} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  change,
  isPositive,
}: {
  icon: React.ReactElement;
  label: string;
  value: string;
  unit?: string;
  change: string;
  isPositive: boolean;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>
      <View style={styles.statContent}>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.statValueRow}>
          <Text style={styles.statValue}>{value}</Text>
          {unit && <Text style={styles.statUnit}>{unit}</Text>}
        </View>
        <View style={styles.statChange}>
          {isPositive ? (
            <TrendingUp size={14} color={COLORS.success} />
          ) : (
            <TrendingDown size={14} color={COLORS.error} />
          )}
          <Text style={[styles.statChangeText, { color: isPositive ? COLORS.success : COLORS.error }]}>
            {change}
          </Text>
        </View>
      </View>
    </View>
  );
}

function PRCard({
  exercise,
  weight,
  date,
  improvement,
}: {
  exercise: string;
  weight: string;
  date: string;
  improvement: string;
}) {
  return (
    <View style={styles.prCard}>
      <View style={styles.prIconContainer}>
        <Trophy size={20} color={COLORS.warning} />
      </View>
      <View style={styles.prInfo}>
        <Text style={styles.prExercise}>{exercise}</Text>
        <Text style={styles.prDate}>{date}</Text>
      </View>
      <View style={styles.prWeightContainer}>
        <Text style={styles.prWeight}>{weight}</Text>
        <Text style={styles.prImprovement}>{improvement}</Text>
      </View>
    </View>
  );
}

function MuscleGroupBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.muscleGroupRow}>
      <Text style={styles.muscleGroupLabel}>{label}</Text>
      <View style={styles.muscleGroupBarContainer}>
        <View style={[styles.muscleGroupBarFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.muscleGroupValue}>{value}%</Text>
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
  section: {
    marginBottom: 24,
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
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
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
  statContent: {
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  statValueRow: {
    flexDirection: "row" as const,
    alignItems: "baseline" as const,
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: COLORS.text,
  },
  statUnit: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500" as const,
  },
  statChange: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    marginTop: 4,
  },
  statChangeText: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  barChart: {
    flexDirection: "row" as const,
    alignItems: "flex-end" as const,
    justifyContent: "space-around" as const,
    width: "100%" as const,
    height: "100%" as const,
  },
  barContainer: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "flex-end" as const,
    height: "100%" as const,
  },
  bar: {
    width: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600" as const,
  },
  prCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  prIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.backgroundTertiary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  prInfo: {
    flex: 1,
  },
  prExercise: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: COLORS.text,
    marginBottom: 2,
  },
  prDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  prWeightContainer: {
    alignItems: "flex-end" as const,
  },
  prWeight: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: COLORS.text,
  },
  prImprovement: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: COLORS.success,
  },
  muscleGroupCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 16,
  },
  muscleGroupRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  muscleGroupLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: COLORS.text,
    width: 80,
  },
  muscleGroupBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: 4,
    overflow: "hidden" as const,
  },
  muscleGroupBarFill: {
    height: "100%" as const,
    borderRadius: 4,
  },
  muscleGroupValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: COLORS.textSecondary,
    width: 40,
    textAlign: "right" as const,
  },
});
