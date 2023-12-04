import {formatShortDate} from '@romanenko-dev/simple-timestamp/utils';

const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function formatDate(date: Date) {
    return formatShortDate(date, 'en-US', TIMEZONE);
}