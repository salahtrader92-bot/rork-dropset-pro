export function calculateOneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

export function calculateVolume(weight: number, reps: number): number {
  return weight * reps;
}

export function suggestDropsetWeights(
  currentWeight: number,
  units: "kg" | "lbs"
): number[] {
  const firstDrop = Math.round(currentWeight * 0.8);
  const secondDrop = Math.round(currentWeight * 0.6);
  
  const roundTo = units === "kg" ? 2.5 : 5;
  
  return [
    Math.round(firstDrop / roundTo) * roundTo,
    Math.round(secondDrop / roundTo) * roundTo,
  ];
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export function formatDate(date: string): string {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (d.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (d.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  
  return d.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric",
    year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
