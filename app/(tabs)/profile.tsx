import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppState } from "@/providers/AppStateProvider";
import COLORS from "@/constants/colors";
import { 
  User, Mail, Ruler, Flag, Calendar, 
  Bell, Link2, HelpCircle, Shield, ChevronRight, ChevronLeft
} from "lucide-react-native";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useAppState();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/200?img=47" }}
              style={styles.avatar}
            />
            <View style={styles.editAvatarButton}>
              <User size={16} color={COLORS.background} />
            </View>
          </View>
          <Text style={styles.profileName}>{profile?.name || "Alex Morgan"}</Text>
          <Text style={styles.profileUsername}>@alexmorgan</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>128</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>16 days</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>

          <View style={styles.levelCard}>
            <Text style={styles.levelValue}>Lv. 12</Text>
            <Text style={styles.levelLabel}>Level</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon={<User size={20} color={COLORS.text} />}
              label="Name"
              value={profile?.name || "Alex Morgan"}
              onPress={() => {}}
            />
            <MenuItem
              icon={<Mail size={20} color={COLORS.text} />}
              label="Email"
              value="alex.morgan@example.com"
              onPress={() => {}}
            />
            <MenuItem
              icon={<Ruler size={20} color={COLORS.text} />}
              label="Height & Weight"
              value="175 cm / 72 kg"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitness Goals</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon={<Flag size={20} color={COLORS.text} />}
              label="Primary Goal"
              value={profile?.goal || "Muscle Gain"}
              onPress={() => {}}
            />
            <MenuItem
              icon={<Calendar size={20} color={COLORS.text} />}
              label="Weekly Goal"
              value="4 workouts / week"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuCard}>
            <SettingItem
              icon={<Bell size={20} color={COLORS.text} />}
              label="Units"
              rightContent={
                <View style={styles.unitsToggle}>
                  <Text style={[styles.unitOption, styles.unitOptionActive]}>kg / cm</Text>
                  <Text style={styles.unitOption}>lbs / ft</Text>
                </View>
              }
            />
            <MenuItem
              icon={<Bell size={20} color={COLORS.text} />}
              label="Notifications"
              value="Workout Reminders"
              onPress={() => {}}
            />
            <MenuItem
              icon={<Link2 size={20} color={COLORS.text} />}
              label="Connected Accounts"
              value="Apple Health"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon={<HelpCircle size={20} color={COLORS.text} />}
              label="Help & Support"
              onPress={() => {}}
            />
            <MenuItem
              icon={<Shield size={20} color={COLORS.text} />}
              label="Privacy Policy"
              onPress={() => {}}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function MenuItem({
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
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>{icon}</View>
      <View style={styles.menuContent}>
        <Text style={styles.menuLabel}>{label}</Text>
        {value && <Text style={styles.menuValue}>{value}</Text>}
      </View>
      <ChevronRight size={20} color={COLORS.textTertiary} />
    </TouchableOpacity>
  );
}

function SettingItem({
  icon,
  label,
  rightContent,
}: {
  icon: React.ReactElement;
  label: string;
  rightContent: React.ReactElement;
}) {
  return (
    <View style={styles.menuItem}>
      <View style={styles.menuIcon}>{icon}</View>
      <View style={styles.menuContent}>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      {rightContent}
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  profileSection: {
    alignItems: "center" as const,
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative" as const,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  editAvatarButton: {
    position: "absolute" as const,
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 16,
    width: "100%" as const,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500" as const,
  },
  levelCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: "100%" as const,
  },
  levelValue: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  levelLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500" as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: COLORS.text,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: "hidden" as const,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundTertiary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  menuValue: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: COLORS.text,
  },
  unitsToggle: {
    flexDirection: "row" as const,
    backgroundColor: COLORS.backgroundTertiary,
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  unitOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 13,
    fontWeight: "600" as const,
    color: COLORS.textSecondary,
  },
  unitOptionActive: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
  },
  logoutButton: {
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    borderRadius: 16,
    padding: 18,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: COLORS.error,
    marginTop: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: COLORS.error,
  },
});
