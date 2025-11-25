import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";

const GAMIFICATION_KEY = "@dropset_pro:gamification";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  type: "reps" | "weight" | "workouts" | "streak";
  reward: string;
  expiresAt: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface MuscleXP {
  muscleGroup: string;
  xp: number;
  level: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string;
  totalWorkouts: number;
  gymLocations: {
    lat: number;
    lng: number;
    date: string;
  }[];
}

export interface GamificationState {
  challenges: Challenge[];
  achievements: Achievement[];
  muscleXP: MuscleXP[];
  streak: StreakData;
  totalPoints: number;
}

const DEFAULT_STATE: GamificationState = {
  challenges: [],
  achievements: [],
  muscleXP: [
    { muscleGroup: "Chest", xp: 0, level: 1 },
    { muscleGroup: "Back", xp: 0, level: 1 },
    { muscleGroup: "Shoulders", xp: 0, level: 1 },
    { muscleGroup: "Biceps", xp: 0, level: 1 },
    { muscleGroup: "Triceps", xp: 0, level: 1 },
    { muscleGroup: "Quadriceps", xp: 0, level: 1 },
    { muscleGroup: "Hamstrings", xp: 0, level: 1 },
    { muscleGroup: "Glutes", xp: 0, level: 1 },
    { muscleGroup: "Calves", xp: 0, level: 1 },
    { muscleGroup: "Abs", xp: 0, level: 1 },
  ],
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastWorkoutDate: "",
    totalWorkouts: 0,
    gymLocations: [],
  },
  totalPoints: 0,
};

export const [GamificationProvider, useGamification] = createContextHook(() => {
  const [state, setState] = useState<GamificationState>(DEFAULT_STATE);

  const stateQuery = useQuery({
    queryKey: ["gamification"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(GAMIFICATION_KEY);
      return stored ? (JSON.parse(stored) as GamificationState) : DEFAULT_STATE;
    },
  });

  const saveStateMutation = useMutation({
    mutationFn: async (newState: GamificationState) => {
      await AsyncStorage.setItem(GAMIFICATION_KEY, JSON.stringify(newState));
      return newState;
    },
    onSuccess: (data) => {
      setState(data);
    },
  });

  const { mutate: mutateState } = saveStateMutation;

  useEffect(() => {
    if (stateQuery.data) {
      setState(stateQuery.data);
    }
  }, [stateQuery.data]);

  const addMuscleXP = useCallback(
    (muscleGroup: string, xp: number) => {
      const updated = { ...state };
      const muscle = updated.muscleXP.find((m) => m.muscleGroup === muscleGroup);
      if (muscle) {
        muscle.xp += xp;
        muscle.level = Math.floor(muscle.xp / 100) + 1;
      }
      mutateState(updated);
    },
    [state, mutateState]
  );

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastDate = state.streak.lastWorkoutDate.split("T")[0];

    const updated = { ...state };
    
    if (lastDate === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastDate === yesterdayStr || !state.streak.lastWorkoutDate) {
      updated.streak.currentStreak += 1;
    } else {
      updated.streak.currentStreak = 1;
    }

    updated.streak.longestStreak = Math.max(
      updated.streak.longestStreak,
      updated.streak.currentStreak
    );
    updated.streak.lastWorkoutDate = new Date().toISOString();
    updated.streak.totalWorkouts += 1;

    mutateState(updated);
  }, [state, mutateState]);

  const addGymLocation = useCallback(
    (lat: number, lng: number) => {
      const updated = { ...state };
      updated.streak.gymLocations.push({
        lat,
        lng,
        date: new Date().toISOString(),
      });
      mutateState(updated);
    },
    [state, mutateState]
  );

  const generateWeeklyChallenges = useCallback(() => {
    const newChallenges: Challenge[] = [
      {
        id: "challenge_1",
        title: "Weekly Warrior",
        description: "Complete 5 workouts this week",
        target: 5,
        current: 0,
        type: "workouts",
        reward: "100 XP",
        expiresAt: getNextWeekEnd(),
        completed: false,
      },
      {
        id: "challenge_2",
        title: "Rep Master",
        description: "Complete 200 reps this week",
        target: 200,
        current: 0,
        type: "reps",
        reward: "50 XP",
        expiresAt: getNextWeekEnd(),
        completed: false,
      },
      {
        id: "challenge_3",
        title: "Streak Keeper",
        description: "Maintain a 3-day streak",
        target: 3,
        current: state.streak.currentStreak,
        type: "streak",
        reward: "75 XP",
        expiresAt: getNextWeekEnd(),
        completed: false,
      },
    ];

    const updated = { ...state, challenges: newChallenges };
    mutateState(updated);
  }, [state, mutateState]);

  const updateChallenge = useCallback(
    (challengeId: string, progress: number) => {
      const updated = { ...state };
      const challenge = updated.challenges.find((c) => c.id === challengeId);
      if (challenge && !challenge.completed) {
        challenge.current = Math.min(challenge.target, challenge.current + progress);
        if (challenge.current >= challenge.target) {
          challenge.completed = true;
          updated.totalPoints += parseInt(challenge.reward.split(" ")[0]);
        }
      }
      mutateState(updated);
    },
    [state, mutateState]
  );

  const unlockAchievement = useCallback(
    (achievementId: string) => {
      const updated = { ...state };
      const achievement = updated.achievements.find((a) => a.id === achievementId);
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString();
      }
      mutateState(updated);
    },
    [state, mutateState]
  );

  return useMemo(
    () => ({
      ...state,
      isLoading: stateQuery.isLoading,
      addMuscleXP,
      updateStreak,
      addGymLocation,
      generateWeeklyChallenges,
      updateChallenge,
      unlockAchievement,
    }),
    [
      state,
      stateQuery.isLoading,
      addMuscleXP,
      updateStreak,
      addGymLocation,
      generateWeeklyChallenges,
      updateChallenge,
      unlockAchievement,
    ]
  );
});

function getNextWeekEnd(): string {
  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + (7 - now.getDay()));
  return nextWeek.toISOString();
}
