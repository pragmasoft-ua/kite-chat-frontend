enum VibrationPattern {
    LONG_PRESS = 100,
    SHORT_PRESS = 50,
}

type VibrationType = keyof typeof VibrationPattern;

export function vibrate(type: VibrationType) {
    if (navigator.vibrate) {
        navigator.vibrate(VibrationPattern[type]);
    }
}