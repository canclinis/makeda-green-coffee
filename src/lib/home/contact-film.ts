export const CONTACT_FILM_FADE_IN_SEC = 2;
export const CONTACT_FILM_FADE_OUT_SEC = 2;

/** Volume 0–1 from timeline position (fade in at start, fade out before end). */
export function contactFilmVolume(
  currentTime: number,
  duration: number,
  fadeInSec = CONTACT_FILM_FADE_IN_SEC,
  fadeOutSec = CONTACT_FILM_FADE_OUT_SEC
): number {
  if (!Number.isFinite(duration) || duration <= 0) return 1;
  if (currentTime <= 0) return 0;
  if (currentTime < fadeInSec) return currentTime / fadeInSec;
  const tail = duration - currentTime;
  if (tail < fadeOutSec) return Math.max(0, tail / fadeOutSec);
  return 1;
}
