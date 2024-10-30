export const getSessionStorageKey = (email: string): string =>
  `emailRequestTimestamp_${email}`;

export const calculateRemainingTime = (
  savedTimestamp: number,
  totalDuration: number = 180
): number => {
  const timePassed = Math.floor((Date.now() - savedTimestamp) / 1000);
  return totalDuration - timePassed;
};
