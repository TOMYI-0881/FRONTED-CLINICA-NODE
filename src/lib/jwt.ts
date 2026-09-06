export function getJwtExpirationMs(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const exp = getJwtExpirationMs(token);
  if (exp === null) return true;
  return Date.now() >= exp;
}
