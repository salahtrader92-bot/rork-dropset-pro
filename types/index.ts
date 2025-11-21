export type Units = "kg" | "lbs";

export type Goal = "strength" | "hypertrophy" | "endurance";

export type MuscleGroup = 
  | "chest" 
  | "back" 
  | "shoulders" 
  | "biceps" 
  | "triceps" 
  | "quadriceps" 
  | "hamstrings" 
  | "glutes" 
  | "calves" 
  | "abs" 
  | "arms" 
  | "legs" 
  | "core" 
  | "cardio";

export type Equipment = 
  | "barbell" 
  | "dumbbell" 
  | "machine" 
  | "cable" 
  | "bodyweight" 
  | "band" 
  | "kettlebell" 
  | "bench" 
  | "other";

export interface UserProfile {
  id: string;
  name: string;
  goal: Goal;
  units: Units;
  height?: number;
  weight?: number;
  createdAt: string;
}

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment;
  difficulty?: Difficulty;
  description?: string;
  instructions?: string;
  photo?: string;
  tags?: string[];
  isCustom: boolean;
  createdBy?: string;
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  rpe?: number;
  restSeconds?: number;
  isDropset: boolean;
  isWarmup: boolean;
  notes?: string;
  completedAt: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  order: number;
  isSupersetWith?: string;
}

export interface Workout {
  id: string;
  userId: string;
  date: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  exercises: WorkoutExercise[];
  notes?: string;
  totalVolume: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: string;
    restSeconds: number;
  }[];
  isBuiltIn: boolean;
  userId?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  weight: number;
  reps: number;
  oneRepMax: number;
  achievedAt: string;
}

export interface WeeklyVolume {
  weekStart: string;
  totalVolume: number;
  workoutCount: number;
}
