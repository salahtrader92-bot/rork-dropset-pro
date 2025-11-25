import { publicProcedure } from "../../create-context";
import { z } from "zod";
import { generateText } from "@rork-ai/toolkit-sdk";

export const exerciseReplacerProcedure = publicProcedure
  .input(
    z.object({
      exerciseName: z.string(),
      targetMuscle: z.string(),
      unavailableEquipment: z.array(z.string()),
      availableEquipment: z.array(z.string()),
      userWeaknesses: z.array(z.string()).optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { exerciseName, targetMuscle, unavailableEquipment, availableEquipment, userWeaknesses } = input;

    const prompt = `You are a fitness expert. Suggest 5 alternative exercises for "${exerciseName}" that targets ${targetMuscle}.

Available equipment: ${availableEquipment.join(", ")}
Unavailable equipment: ${unavailableEquipment.join(", ")}
${userWeaknesses && userWeaknesses.length > 0 ? `User weaknesses: ${userWeaknesses.join(", ")}` : ""}

For each alternative, provide:
1. Exercise name
2. Equipment needed
3. Muscle activation comparison (0-100%)
4. Difficulty level (beginner/intermediate/advanced)
5. Brief instructions

Format your response as JSON array with this structure:
[
  {
    "name": "Exercise Name",
    "equipment": "Equipment type",
    "muscleActivation": 95,
    "difficulty": "intermediate",
    "instructions": "Brief instructions"
  }
]`;

    const response = await generateText({ messages: [{ role: "user", content: prompt }] });

    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No JSON array found in response");
      }
      const alternatives = JSON.parse(jsonMatch[0]);
      return { alternatives };
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      return {
        alternatives: [
          {
            name: "Dumbbell Press",
            equipment: "dumbbell",
            muscleActivation: 90,
            difficulty: "intermediate",
            instructions: "Press dumbbells overhead from shoulder height",
          },
        ],
      };
    }
  });
