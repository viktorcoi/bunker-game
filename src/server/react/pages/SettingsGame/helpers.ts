export const changeSecondsForMinutes = (
    minutes: number,
    seconds: number,
    maxMinutes: number,
    minSeconds: number,
) => {
    if (minutes === maxMinutes && seconds > 0) return 0;
    if (minutes === 0 && seconds < minSeconds) return minSeconds;

    return seconds;
};
