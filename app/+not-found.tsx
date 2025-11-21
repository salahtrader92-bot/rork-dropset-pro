import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import COLORS from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn&apos;t exist.</Text>

        <Link href="/(tabs)/workout" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: COLORS.text,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: COLORS.primary,
  },
});
