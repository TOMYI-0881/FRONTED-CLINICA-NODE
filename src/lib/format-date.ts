export function toApiDate(date: Date): string {
  // 'YYYY-MM-DD' en UTC, formato que espera el backend para ?date=
  return date.toISOString().slice(0, 10);
}

export function todayApiDate(): string {
  return toApiDate(new Date());
}

export function formatTimeLocal(isoUtc: string): string {
  return new Date(isoUtc).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTimeLocal(isoUtc: string): string {
  return new Date(isoUtc).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatDateLocal(isoUtc: string): string {
  return new Date(isoUtc).toLocaleDateString([], {
    dateStyle: "medium",
  });
}
