import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppState } from "@/providers/AppStateProvider";
import COLORS from "@/constants/colors";
import { User, Scale, Target, Bell, Globe, Shield, ChevronRight } from "lucide-react-native";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useAppState();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <User size={32} color={COLORS.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.name || "User"}</Text>
            <Text style={styles.profileEmail}>Member since Dec 2024</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={<Scale size={20} color={COLORS.primary} />}
              label="Weight"
              value={profile?.weight ? `${profile.weight}` : "—"}
              unit={profile?.units || "kg"}
            />
            <StatCard
              icon={<Target size={20} color={COLORS.primary} />}
              label="Goal"
              value={profile?.goal || "—"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon={<Bell size={20} color={COLORS.text} />}
              label="Notifications"
              value="Enabled"
              onPress={() => {}}
            />
            <SettingItem
              icon={<Globe size={20} color={COLORS.text} />}
              label="Language"
              value="English"
              onPress={() => {}}
            />
            <SettingItem
              icon={<Shield size={20} color={COLORS.text} />}
              label="Privacy"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>DropSet Pro v1.0.0</Text>
            <Text style={styles.aboutSubtext}>Built with Expo & React Native</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactElement;
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{value}</Text>
        {unit && <Text style={styles.statUnit}>{unit}</Text>}
      </View>
    </View>
  );
}

function SettingItem({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ReactElement;
  label: string;
  value?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>{icon}</View>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        <ChevronRight size={20} color={COLORS.textTertiary} />
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
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.backgroundTertiary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
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
  statLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 8,
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
  settingsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: "hidden" as const,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.backgroundTertiary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600" as const,
    color: COLORS.text,
  },
  settingRight: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  aboutCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center" as const,
  },
  aboutText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  aboutSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: COLORS.error,
    marginTop: 8,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: COLORS.error,
  },
});
