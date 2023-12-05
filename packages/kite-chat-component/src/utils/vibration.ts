export enum VibrationPattern {
    LONG_PRESS = 100,
    SHORT_PRESS = 50,
}

export function vibrate(pattern: VibrationPattern) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}