import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";
import { generateText } from "@rork-ai/toolkit-sdk";

export const weakPointBuilderProcedure = publicProcedure
  .input(
    z.object({
      trainingHistory: z.array(
        z.object({
          muscleGroup: z.string(),
          volume: z.number(),
          frequency: z.number(),
          lastTrained: z.string(),
        })
      ),
      userGoal: z.enum(["strength", "hypertrophy", "endurance"]),
    })
  )
  .mutation(async ({ input }) => {
    const { trainingHistory, userGoal } = input;

    const historySummary = trainingHistory
      .map((item: { muscleGroup: string; volume: number; frequency: number }) => `${item.muscleGroup}: ${item.volume}kg volume, ${item.frequency}x/week`)
      .join("\n");

    const prompt = `You are an elite strength coach. Analyze this training history and identify weak points.

Goal: ${userGoal}

Training history (last 4 weeks):
${historySummary}

Identify:
1. Under-trained muscle groups
2. Muscle imbalances
3. Lagging body parts
4. Recommended focus areas

Then create a 4-week program to address these weak points.

Format as JSON:
{
  "weakPoints": [
    {
      "muscleGroup": "Back",
      "issue": "Low training volume",
      "severity": "high"
    }
  ],
  "program": {
    "weeks": 4,
    "focusAreas": ["Back", "Hamstrings"],
    "weeklyPlan": [
      {
        "week": 1,
        "workouts": [
          {
            "day": 1,
            "exercises": ["Pull-ups", "Barbell Rows"],
            "sets": [4, 4],
            "reps": ["8-10", "8-12"]
          }
        ]
      }
    ]
  }
}`;

    const response = await generateText({ messages: [{ role: "user", content: prompt }] });

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      return {
        weakPoints: [
          {
            muscleGroup: "Back",
            issue: "Insufficient training volume",
            severity: "medium",
          },
        ],
        program: {
          weeks: 4,
          focusAreas: ["Back"],
          weeklyPlan: [],
        },
      };
    }
  });
