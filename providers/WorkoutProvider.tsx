import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Workout, WorkoutExercise, WorkoutSet, PersonalRecord } from "@/types";
import { useState, useEffect, useMemo, useCallback } from "react";
import { generateId, calculateOneRepMax, calculateVolume } from "@/utils/calculations";

const WORKOUTS_KEY = "@dropset_pro:workouts";
const ACTIVE_WORKOUT_KEY = "@dropset_pro:active_workout";

export const [WorkoutProvider, useWorkouts] = createContextHook(() => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  const workoutsQuery = useQuery({
    queryKey: ["workouts"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(WORKOUTS_KEY);
      return stored ? (JSON.parse(stored) as Workout[]) : [];
    },
  });

  const activeWorkoutQuery = useQuery({
    queryKey: ["activeWorkout"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(ACTIVE_WORKOUT_KEY);
      return stored ? (JSON.parse(stored) as Workout) : null;
    },
  });

  const saveWorkoutsMutation = useMutation({
    mutationFn: async (newWorkouts: Workout[]) => {
      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(newWorkouts));
      return newWorkouts;
    },
    onSuccess: (data) => {
      setWorkouts(data);
    },
  });

  const saveActiveWorkoutMutation = useMutation({
    mutationFn: async (workout: Workout | null) => {
      if (workout) {
        await AsyncStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(workout));
      } else {
        await AsyncStorage.removeItem(ACTIVE_WORKOUT_KEY);
      }
      return workout;
    },
    onSuccess: (data) => {
      setActiveWorkout(data);
    },
  });

  const { mutate: mutateActiveWorkout } = saveActiveWorkoutMutation;
  const { mutate: mutateWorkouts } = saveWorkoutsMutation;

  useEffect(() => {
    if (workoutsQuery.data) {
      setWorkouts(workoutsQuery.data);
    }
  }, [workoutsQuery.data]);

  useEffect(() => {
    if (activeWorkoutQuery.data) {
      setActiveWorkout(activeWorkoutQuery.data);
    }
  }, [activeWorkoutQuery.data]);

  const startWorkout = useCallback(
    (userId: string) => {
      const newWorkout: Workout = {
        id: generateId(),
        userId,
        date: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        exercises: [],
        totalVolume: 0,
      };
      mutateActiveWorkout(newWorkout);
    },
    [mutateActiveWorkout]
  );

  const addExercise = useCallback(
    (exerciseToAdd: WorkoutExercise) => {
      if (!activeWorkout) return;
      const updated = {
        ...activeWorkout,
        exercises: [...activeWorkout.exercises, exerciseToAdd],
      };
      mutateActiveWorkout(updated);
    },
    [activeWorkout, mutateActiveWorkout]
  );

  const addSet = useCallback(
    (exerciseId: string, set: WorkoutSet) => {
      if (!activeWorkout) return;
      const updated = {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((ex) =>
          ex.id === exerciseId ? { ...ex, sets: [...ex.sets, set] } : ex
        ),
      };
      mutateActiveWorkout(updated);
    },
    [activeWorkout, mutateActiveWorkout]
  );

  const updateSet = useCallback(
    (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
      if (!activeWorkout) return;
      const updated = {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((ex) =>
          ex.id === exerciseId
            ? {
                ...ex,
                sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)),
              }
            : ex
        ),
      };
      mutateActiveWorkout(updated);
    },
    [activeWorkout, mutateActiveWorkout]
  );

  const removeSet = useCallback(
    (exerciseId: string, setId: string) => {
      if (!activeWorkout) return;
      const updated = {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((ex) =>
          ex.id === exerciseId
            ? {
                ...ex,
                sets: ex.sets.filter((s) => s.id !== setId),
              }
            : ex
        ),
      };
      mutateActiveWorkout(updated);
    },
    [activeWorkout, mutateActiveWorkout]
  );

  const completeWorkout = useCallback(() => {
    if (!activeWorkout) return;

    const totalVolume = activeWorkout.exercises.reduce((total, ex) => {
      return (
        total +
        ex.sets.reduce((setTotal, set) => {
          if (set.isWarmup) return setTotal;
          return setTotal + calculateVolume(set.weight, set.reps);
        }, 0)
      );
    }, 0);

    const completedWorkout: Workout = {
      ...activeWorkout,
      completedAt: new Date().toISOString(),
      duration: Math.floor(
        (new Date().getTime() - new Date(activeWorkout.startedAt).getTime()) / 1000
      ),
      totalVolume,
    };

    const updatedWorkouts = [...workouts, completedWorkout];
    mutateWorkouts(updatedWorkouts);
    mutateActiveWorkout(null);
  }, [activeWorkout, workouts, mutateWorkouts, mutateActiveWorkout]);

  const cancelWorkout = useCallback(() => {
    mutateActiveWorkout(null);
  }, [mutateActiveWorkout]);

  const personalRecords = useMemo(() => {
    const records: Record<string, PersonalRecord> = {};

    workouts.forEach((workout) => {
      workout.exercises.forEach((ex) => {
        ex.sets.forEach((set) => {
          if (set.isWarmup) return;

          const oneRepMax = calculateOneRepMax(set.weight, set.reps);
          const existing = records[ex.exerciseId];

          if (!existing || oneRepMax > existing.oneRepMax) {
            records[ex.exerciseId] = {
              exerciseId: ex.exerciseId,
              weight: set.weight,
              reps: set.reps,
              oneRepMax,
              achievedAt: set.completedAt,
            };
          }
        });
      });
    });

    return records;
  }, [workouts]);

  const totalVolume = useMemo(() => {
    return workouts.reduce((total, w) => total + w.totalVolume, 0);
  }, [workouts]);

  return useMemo(
    () => ({
      workouts,
      activeWorkout,
      personalRecords,
      totalVolume,
      isLoading: workoutsQuery.isLoading || activeWorkoutQuery.isLoading,
      startWorkout,
      addExercise,
      addSet,
      updateSet,
      removeSet,
      completeWorkout,
      cancelWorkout,
    }),
    [
      workouts,
      activeWorkout,
      personalRecords,
      totalVolume,
      workoutsQuery.isLoading,
      activeWorkoutQuery.isLoading,
      startWorkout,
      addExercise,
      addSet,
      updateSet,
      removeSet,
      completeWorkout,
      cancelWorkout,
    ]
  );
});

export function useWorkoutHistory(limit?: number) {
  const { workouts } = useWorkouts();
  return useMemo(() => {
    const sorted = [...workouts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }, [workouts, limit]);
}
