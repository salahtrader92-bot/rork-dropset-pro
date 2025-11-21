import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppStateProvider, useAppState } from "@/providers/AppStateProvider";
import { WorkoutProvider } from "@/providers/WorkoutProvider";
import * as SystemUI from "expo-system-ui";
import COLORS from "@/constants/colors";

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync(COLORS.background);

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isOnboarded, isLoading } = useAppState();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inOnboarding = segments[0] === "onboarding";

    if (!isOnboarded && !inOnboarding) {
      router.replace("/onboarding");
    } else if (isOnboarded && inOnboarding) {
      router.replace("/workout");
    }
  }, [isOnboarded, isLoading, segments, router]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.text,
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppStateProvider>
          <WorkoutProvider>
            <RootLayoutNav />
          </WorkoutProvider>
        </AppStateProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
