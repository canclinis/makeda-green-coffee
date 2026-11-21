/**
 * A flag that turns on and clears itself after `ms`, e.g. to show a button's success state
 * for a moment after something was saved.
 */
export function transientFlag(ms = 2500) {
  let active = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  return {
    get active() {
      return active;
    },
    flash() {
      clearTimeout(timer);
      active = true;
      timer = setTimeout(() => (active = false), ms);
    },
    clear() {
      clearTimeout(timer);
      active = false;
    }
  };
}
