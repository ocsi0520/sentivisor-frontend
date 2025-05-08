declare const setTimeout: (
  handler: any,
  timeout?: any,
  ...args: any[]
) => number;
declare const clearTimeout: (id: number | undefined) => void;

type AnyProcess = (...args: any[]) => void;

export const debounce = <T extends AnyProcess>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
