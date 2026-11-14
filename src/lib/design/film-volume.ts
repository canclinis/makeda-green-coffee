export const FILM_FADE_IN_SEC = 2;
export const FILM_FADE_OUT_SEC = 2;

/** Volume 0–1. `heardFor` is how long the soundtrack has been on. */
export function filmVolume(
  currentTime: number,
  duration: number,
  heardFor: number,
  fadeInSec = FILM_FADE_IN_SEC,
  fadeOutSec = FILM_FADE_OUT_SEC
): number {
  const onset = fadeInSec <= 0 ? 1 : Math.min(1, Math.max(0, heardFor / fadeInSec));
  if (fadeOutSec <= 0 || !Number.isFinite(duration) || duration <= 0) return onset;
  const remaining = duration - currentTime;
  if (remaining >= fadeOutSec) return onset;
  return onset * Math.max(0, remaining / fadeOutSec);
}
