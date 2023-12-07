export function formatNumberWithAbbreviation(number: number): string {
    let result: string;

    switch (true) {
        case number < 1000:
            result = number.toString();
            break;
        case number < 1000000:
            result = (number / 1000) + 'k';
            break;
        case number < 1000000000:
            result = (number / 1000000) + 'm';
            break;
        default:
            result = (number / 1000000000) + 'b';
            break;
    }

    return result;
}