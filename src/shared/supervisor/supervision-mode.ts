export enum SupervisionMode {
  off,
  collect,
  inform,
  warning,
  strict,
}

export const isValidSupervisionMode = (
  value: unknown
): value is SupervisionMode => {
  if (typeof value !== "number") return false;

  return Object.values(SupervisionMode).includes(value);
};
