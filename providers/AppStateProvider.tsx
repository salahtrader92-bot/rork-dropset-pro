import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { UserProfile } from "@/types";
import { useState, useEffect, useMemo, useCallback } from "react";
import { generateId } from "@/utils/calculations";

const USER_PROFILE_KEY = "@dropset_pro:user_profile";

export const [AppStateProvider, useAppState] = createContextHook(() => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);

  const profileQuery = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        return parsed;
      }
      return null;
    },
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (newProfile: UserProfile) => {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
      return newProfile;
    },
    onSuccess: (data) => {
      setProfile(data);
      setIsOnboarded(true);
    },
  });

  const { mutate: mutateProfile } = saveProfileMutation;

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
      setIsOnboarded(true);
    } else if (profileQuery.isSuccess && !profileQuery.data) {
      setIsOnboarded(false);
    }
  }, [profileQuery.data, profileQuery.isSuccess]);

  const createProfile = useCallback(
    (
      name: string,
      goal: UserProfile["goal"],
      units: UserProfile["units"]
    ) => {
      const newProfile: UserProfile = {
        id: generateId(),
        name,
        goal,
        units,
        createdAt: new Date().toISOString(),
      };
      mutateProfile(newProfile);
    },
    [mutateProfile]
  );

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      if (!profile) return;
      const updated = { ...profile, ...updates };
      mutateProfile(updated);
    },
    [profile, mutateProfile]
  );

  return useMemo(
    () => ({
      profile,
      isOnboarded,
      isLoading: profileQuery.isLoading,
      createProfile,
      updateProfile,
    }),
    [profile, isOnboarded, profileQuery.isLoading, createProfile, updateProfile]
  );
});
