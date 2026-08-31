/**
 * Deep-link path fixups for custom-scheme URLs.
 *
 * `samsungindia://join/CONF2610014` is parsed with "join" as the hostname,
 * which expo-router then drops - leaving `/CONF2610014`, which matches no
 * route ("Unmatched Route"). Rebuild it into `/join/CONF2610014` so
 * `app/join/[code].tsx` matches.
 *
 * A JS module expo-router loads at runtime -> ships via `eas update`.
 * Kept dependency-free (no `URL`) since RN's URL polyfill is unreliable.
 */
export function redirectSystemPath({ path }: { path: string; initial: boolean }): string {
  // Accepts any of: samsungindia://join/CODE, samsungindia:///join/CODE,
  // /join/CODE, join/CODE
  const match = path.match(/^(?:[a-z][a-z0-9+.-]*:\/\/)?\/*join\/([^/?#]+)/i);
  if (match) {
    return `/join/${match[1]}`;
  }
  return path;
}
