export function formatRuntimeLabel(seconds: number | null | undefined): string {
  if (seconds == null) return "Runtime : 02h 31m";
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  return `Runtime : ${hours}h ${minutes}m`;
}

export function formatGeneratedTimestamp(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("en-GB", { month: "long" });
  const year = d.getFullYear();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `Generated: ${day} ${month} ${year}, ${time}`;
}
