import { COLORS } from "./colors";

export type ThemeMode = keyof typeof COLORS;

export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const RADII = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  circular: 999,
} as const;

export const TYPOGRAPHY = {
  familyPrimary: "System",
  familyDisplay: "System",
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },
  sizes: {
    caption: 12,
    footnote: 13,
    body: 15,
    bodyLarge: 17,
    title: 20,
    titleLarge: 24,
    display: 32,
    hero: 40,
  },
  lineHeights: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.35,
    relaxed: 1.5,
  },
} as const;

export const SHADOWS = {
  soft: {
    shadowColor: "rgba(0,0,0,0.35)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 24,
  },
  lifted: {
    shadowColor: "rgba(0,0,0,0.45)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 48,
    elevation: 36,
  },
} as const;

export const MOTION = {
  durations: {
    instant: 90,
    fast: 180,
    base: 260,
    slow: 360,
  },
  easing: {
    standard: [0.2, 0.8, 0.2, 1],
    exit: [0.4, 0, 1, 1],
    enter: [0, 0.55, 0.45, 1],
  },
} as const;

export const createTheme = (mode: ThemeMode) => ({
  mode,
  colors: COLORS[mode],
  tokens: {
    spacing: SPACING,
    radii: RADII,
    typography: TYPOGRAPHY,
    shadows: SHADOWS,
    motion: MOTION,
  },
});

export type AppTheme = ReturnType<typeof createTheme>;
