import tinygradient from "tinygradient";

export function getGradient(
  startColor: string,
  endColor: string,
  gradientNumber: number
) {
  return tinygradient(startColor, endColor).rgb(gradientNumber);
}
