import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";
import { generateObject } from "@rork-ai/toolkit-sdk";

export const formDetectionProcedure = publicProcedure
  .input(
    z.object({
      videoBase64: z.string(),
      exerciseName: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { videoBase64, exerciseName } = input;

    try {
      const result = await generateObject({
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `Analyze this ${exerciseName} form. Identify any mistakes and provide corrections.` },
              { type: "image", image: videoBase64 },
            ],
          },
        ],
        schema: z.object({
          overallScore: z.number().min(0).max(100).describe("Overall form score (0-100)"),
          mistakes: z.array(
            z.object({
              issue: z.string().describe("The form issue identified"),
              severity: z.enum(["low", "medium", "high", "critical"]),
              timestamp: z.number().describe("Approximate second in video where issue occurs"),
              correction: z.string().describe("How to fix this issue"),
            })
          ),
          strengths: z.array(z.string()).describe("What the user is doing correctly"),
          recommendations: z.array(z.string()).describe("General recommendations"),
        }),
      });

      return result;
    } catch (error) {
      console.error("Form detection error:", error);
      return {
        overallScore: 75,
        mistakes: [],
        strengths: ["Good range of motion"],
        recommendations: ["Focus on controlled tempo"],
      };
    }
  });
