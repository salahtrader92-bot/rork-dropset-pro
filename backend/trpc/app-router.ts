import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { exerciseReplacerProcedure } from "./routes/ai/exercise-replacer/route";
import { progressiveOverloadProcedure } from "./routes/ai/progressive-overload/route";
import { weakPointBuilderProcedure } from "./routes/ai/weak-point-builder/route";
import { voiceCoachProcedure } from "./routes/ai/voice-coach/route";
import { formDetectionProcedure } from "./routes/ai/form-detection/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  ai: createTRPCRouter({
    exerciseReplacer: exerciseReplacerProcedure,
    progressiveOverload: progressiveOverloadProcedure,
    weakPointBuilder: weakPointBuilderProcedure,
    voiceCoach: voiceCoachProcedure,
    formDetection: formDetectionProcedure,
  }),
});

export type AppRouter = typeof appRouter;
