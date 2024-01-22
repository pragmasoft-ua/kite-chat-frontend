import type MarkdownIt from 'markdown-it';

type StateInline = InstanceType<MarkdownIt["inline"]["State"]>;
type Delimiter = StateInline["delimiters"][0];

enum EmphasisStyle {
  bold = 'bold',
  italic = 'italic',
  underline = 'underline',
  strikethrough = 'strikethrough',
  spoiler = 'spoiler',
}

type Link = 'link';
type Quote = 'quote';

export type TextStyle = keyof typeof EmphasisStyle | Link | Quote;

const TERMINATOR_RE = /[\n!#$%&*+\-:<=>@[\\\]^_`{}~|]/;
const EMPHASIS_ARRAY = [
  { code: 0x2A /* * */, tagName: 'strong', count: 1, style: EmphasisStyle.bold },
  { code: 0x5F /* _ */, tagName: 'em', count: 1, style: EmphasisStyle.italic },
  { code: 0x5F /* _ */, tagName: 'u', count: 2, style: EmphasisStyle.underline },
  { code: 0x7E /* ~ */, tagName: 's', count: 1, style: EmphasisStyle.strikethrough },
  { code: 0x7C /* | */, tagName: 'details', count: 2, style: EmphasisStyle.spoiler },
];

// It costs 10% of performance, but allows extend terminators list
function text(state: StateInline, silent: boolean) {
  const pos = state.pos,
      idx = state.src.slice(pos).search(TERMINATOR_RE);

  // first char is terminator -> empty text
  if (idx === 0) { return false; }

  // no terminator -> text till end of string
  if (idx < 0) {
    if (!silent) { state.pending += state.src.slice(pos); }
    state.pos = state.src.length;
    return true;
  }

  if (!silent) { state.pending += state.src.slice(pos, pos + idx); }

  state.pos += idx;

  return true;
}

// Insert each marker as a separate text token, and add it to delimiter list
//
function tokenize(state: StateInline, silent: boolean) {
  const start = state.pos
  const marker = state.src.charCodeAt(start)

  if (silent) { return false }

  if (!EMPHASIS_ARRAY.map((({code}) => code)).includes(marker)) { return false }

  const scanned = state.scanDelims(state.pos, marker === 0x2A)

  for (let i = 0; i < scanned.length; i++) {
    const token = state.push('text', '', 0)
    token.content = String.fromCharCode(marker)

    state.delimiters.push({
      // Char code of the starting marker (number).
      //
      marker,

      // Total length of these series of delimiters.
      //
      length: scanned.length,

      // A position of the token this delimiter corresponds to.
      //
      token: state.tokens.length - 1,

      // If this delimiter is matched as a valid opener, `end` will be
      // equal to its position, otherwise it's `-1`.
      //
      end: -1,

      // Boolean flags that determine if this delimiter could open or close
      // an emphasis.
      //
      open: scanned.can_open,
      close: scanned.can_close
    } as Delimiter)
  }

  state.pos += scanned.length

  return true
}

function postProcess(state: StateInline, delimiters: Delimiter[]) {
  const max = delimiters.length;

  for (let i = max - 1; i >= 0; i--) {
    const startDelim = delimiters[i];

    if (startDelim.end === -1) {
      continue;
    }

    const endDelim = delimiters[startDelim.end];

    const ch = String.fromCharCode(startDelim.marker);

    const isAdjacent = i > 0 &&
      delimiters[i - 1].end === startDelim.end + 1 &&
      // check that first two markers match and adjacent
      delimiters[i - 1].marker === startDelim.marker &&
      delimiters[i - 1].token === startDelim.token - 1 &&
      // check that last two markers are adjacent (we can safely assume they match)
      delimiters[startDelim.end + 1].token === endDelim.token + 1;

    const emphasis = EMPHASIS_ARRAY.find(({code, count}) => code === startDelim.marker && count === startDelim.length) as typeof EMPHASIS_ARRAY[0];
    
    const tagName = emphasis.tagName;
    const markup = ch.repeat(emphasis.count);

    state.tokens[startDelim.token].type = `${tagName}_open`;
    state.tokens[endDelim.token].type = `${tagName}_close`;
    state.tokens[startDelim.token].tag = tagName;
    state.tokens[endDelim.token].tag = tagName;
    state.tokens[startDelim.token].markup = markup;
    state.tokens[endDelim.token].markup = markup;
    state.tokens[startDelim.token].nesting = 1;
    state.tokens[endDelim.token].nesting = -1;
    state.tokens[startDelim.token].content = '';
    state.tokens[endDelim.token].content = '';

    if (isAdjacent) {
      for(let j = 1; j < emphasis.count; j++) {
        state.tokens[delimiters[i - j].token].content = '';
        state.tokens[delimiters[startDelim.end + j].token].content = '';
      }
      i -= emphasis.count;
    }
  }
}

// Walk through delimiter list and replace text tokens with tags
//
function emphasis_post_process(state: StateInline) {
  const tokens_meta = state.tokens_meta
  const max = state.tokens_meta.length

  postProcess(state, state.delimiters)

  for (let curr = 0; curr < max; curr++) {
    const meta = tokens_meta[curr];
    if (meta && meta.delimiters) {
      postProcess(state, meta.delimiters)
    }
  }
}

export function markdownV2(md: MarkdownIt) {
  md.inline.ruler.at('text', text);
  md.inline.ruler.at('emphasis', tokenize);
  md.inline.ruler2.at('emphasis', emphasis_post_process as (state: StateInline) => boolean);

  md.renderer.rules['details_open'] = (tokens, idx) => {
    const token = tokens[idx];
    const nextToken = tokens[idx + 1];
    return `<${token.tag}><summary>${'*'.repeat(nextToken.content.length)}</summary>`;
  };
}

export function formatText(inputString: string, style: TextStyle) {
  switch (style) {
    case 'link':
      return `[${inputString}](https://)`;
    case 'quote':
      return `>${inputString}\n\n`;
    default: {
      const emphasis = EMPHASIS_ARRAY.find((item) => item.style === style);
      if (emphasis) {
        const { code, count } = emphasis;
        const markup = String.fromCharCode(code).repeat(count);
        return `${markup}${inputString}${markup}`;
      } else {
        return inputString;
      }
    }
  }
}
