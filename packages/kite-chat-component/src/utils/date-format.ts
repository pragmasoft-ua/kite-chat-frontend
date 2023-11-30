import {formatShortDate} from '@romanenko.pavlo/simple-timestamp';

const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function formatDate(date: Date) {
    return formatShortDate(date, 'en-US', TIMEZONE);
}