import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a `[debounced, cancel]` tuple. Each call to `debounced` resets a
 * timer; the callback runs only after `delay` ms have elapsed with no new
 * calls. `cancel` discards any pending invocation.
 *
 * The latest `callback` is always used at fire time (kept in a ref), so callers
 * don't need to memoize it and stale closures are avoided. Any pending call is
 * cancelled on unmount.
 */
export function useDebouncedCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  delay: number,
): [debounced: (...args: A) => void, cancel: () => void] {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the ref pointing at the most recent callback without resetting the timer.
  useEffect(() => {
    callbackRef.current = callback;
  });

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cancel any pending invocation when the component unmounts.
  useEffect(() => cancel, [cancel]);

  const debounced = useCallback(
    (...args: A) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay],
  );

  return [debounced, cancel];
}
