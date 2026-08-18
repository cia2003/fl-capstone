export function formatRuntime(minutes: string | number) {
  const value = Number(minutes);
  return Number.isFinite(value) && value > 0 ? `${value} min` : "Runtime unavailable";
}

export function formatReleaseDate(date: string) {
  const year = new Date(date).getUTCFullYear();
  return Number.isFinite(year) ? String(year) : "Release date unavailable";
}
