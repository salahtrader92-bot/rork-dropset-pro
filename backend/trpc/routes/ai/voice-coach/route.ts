import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";
import { generateText } from "@rork-ai/toolkit-sdk";

export const voiceCoachProcedure = publicProcedure
  .input(
    z.object({
      command: z.string(),
      context: z.object({
        currentExercise: z.string().optional(),
        currentSet: z.number().optional(),
        currentReps: z.number().optional(),
        currentWeight: z.number().optional(),
      }),
      coachStyle: z.enum(["military", "motivational", "calm", "bodybuilding", "humorous"]).optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { command, context, coachStyle = "motivational" } = input;

    const stylePrompts: Record<string, string> = {
      military: "Respond like a strict military drill sergeant",
      motivational: "Respond like an enthusiastic, supportive coach",
      calm: "Respond like a calm, scientific trainer",
      bodybuilding: "Respond like a professional bodybuilding coach",
      humorous: "Respond like a funny, sarcastic gym buddy",
    };

    const prompt = `You are a voice-activated gym coach. ${stylePrompts[coachStyle] || stylePrompts.motivational}.

User command: "${command}"

Current context:
${context.currentExercise ? `Exercise: ${context.currentExercise}` : ""}
${context.currentSet ? `Set: ${context.currentSet}` : ""}
${context.currentReps ? `Reps: ${context.currentReps}` : ""}
${context.currentWeight ? `Weight: ${context.currentWeight}kg` : ""}

Interpret the command and respond with appropriate actions and motivational message.

Format as JSON:
{
  "action": "add_dropset" | "increase_weight" | "replace_exercise" | "start_superset" | "rest" | "unknown",
  "parameters": {"weight": 5} or {"exerciseId": "123"} etc,
  "message": "Your motivational response",
  "success": true
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
        action: "unknown",
        parameters: {},
        message: "I didn't quite catch that. Try again!",
        success: false,
      };
    }
  });
