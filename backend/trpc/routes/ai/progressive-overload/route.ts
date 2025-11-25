import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";
import { generateText } from "@rork-ai/toolkit-sdk";

export const progressiveOverloadProcedure = publicProcedure
  .input(
    z.object({
      exerciseId: z.string(),
      exerciseName: z.string(),
      recentSets: z.array(
        z.object({
          weight: z.number(),
          reps: z.number(),
          rpe: z.number().optional(),
          date: z.string(),
        })
      ),
      sleepQuality: z.number().min(1).max(10).optional(),
      stressLevel: z.number().min(1).max(10).optional(),
      recoveryScore: z.number().min(1).max(10).optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { exerciseName, recentSets, sleepQuality, stressLevel, recoveryScore } = input;

    const setsSummary = recentSets
      .map((set: { weight: number; reps: number; rpe?: number }) => `${set.weight}kg x ${set.reps} reps${set.rpe ? ` @ RPE ${set.rpe}` : ""}`)
      .join("\n");

    const prompt = `You are a strength training expert. Analyze this training data and predict the optimal weight for the next workout.

Exercise: ${exerciseName}

Recent sets:
${setsSummary}

${sleepQuality ? `Sleep quality (1-10): ${sleepQuality}` : ""}
${stressLevel ? `Stress level (1-10): ${stressLevel}` : ""}
${recoveryScore ? `Recovery score (1-10): ${recoveryScore}` : ""}

Provide:
1. Recommended weight for next workout
2. Recommended reps
3. Confidence level (0-100%)
4. Reasoning
5. Alternative options (lighter/heavier)

Format as JSON:
{
  "recommendedWeight": 80,
  "recommendedReps": 8,
  "confidence": 85,
  "reasoning": "Your explanation",
  "alternatives": {
    "lighter": {"weight": 75, "reps": 10},
    "heavier": {"weight": 85, "reps": 6}
  }
}`;

    const response = await generateText({ messages: [{ role: "user", content: prompt }] });

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      const prediction = JSON.parse(jsonMatch[0]);
      return prediction;
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      const lastSet = recentSets[recentSets.length - 1];
      return {
        recommendedWeight: lastSet.weight + 2.5,
        recommendedReps: lastSet.reps,
        confidence: 70,
        reasoning: "Based on linear progression",
        alternatives: {
          lighter: { weight: lastSet.weight, reps: lastSet.reps + 2 },
          heavier: { weight: lastSet.weight + 5, reps: lastSet.reps - 2 },
        },
      };
    }
  });
