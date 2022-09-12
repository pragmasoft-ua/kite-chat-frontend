import {nanoid} from 'nanoid/non-secure';

export const randomStringId = (length = 10) => nanoid(length);
