import {urlAlphabet, customAlphabet} from 'nanoid';

// nanoids are used in telegram #hashtag entities which should not contain -(minus) character
const alphabet = urlAlphabet.replace('-', '');

export const randomStringId = customAlphabet(alphabet, 10);
