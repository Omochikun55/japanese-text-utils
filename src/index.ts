/**
 * @omochikun/japanese-text-utils
 * Utilities for Japanese text processing
 */

/**
 * Character type detection
 */

/** Check if character is hiragana */
export function isHiragana(char: string): boolean {
  if (!char || char.length === 0) return false;
  const code = char.charCodeAt(0);
  return code >= 0x3040 && code <= 0x309f;
}

/** Check if character is katakana */
export function isKatakana(char: string): boolean {
  if (!char || char.length === 0) return false;
  const code = char.charCodeAt(0);
  return code >= 0x30a0 && code <= 0x30ff;
}

/** Check if character is kanji */
export function isKanji(char: string): boolean {
  if (!char || char.length === 0) return false;
  const code = char.charCodeAt(0);
  return (
    (code >= 0x4e00 && code <= 0x9faf) || // CJK Unified Ideographs
    (code >= 0x3400 && code <= 0x4dbf) || // CJK Extension A
    (code >= 0x20000 && code <= 0x2a6df) // CJK Extension B
  );
}

/** Check if character is full-width */
export function isFullWidth(char: string): boolean {
  if (!char || char.length === 0) return false;
  const code = char.charCodeAt(0);
  return code > 0xff;
}

/** Check if character is half-width */
export function isHalfWidth(char: string): boolean {
  if (!char || char.length === 0) return false;
  return !isFullWidth(char);
}

/** Check if entire string is hiragana */
export function isAllHiragana(text: string): boolean {
  if (!text || text.length === 0) return false;
  return [...text].every(isHiragana);
}

/** Check if entire string is katakana */
export function isAllKatakana(text: string): boolean {
  if (!text || text.length === 0) return false;
  return [...text].every(isKatakana);
}

/** Check if entire string is kanji */
export function isAllKanji(text: string): boolean {
  if (!text || text.length === 0) return false;
  return [...text].every(isKanji);
}

/**
 * Character conversion
 */

/** Convert hiragana to katakana */
export function hiraganaToKatakana(text: string): string {
  return text.replace(/[\u3041-\u3096]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) + 0x60);
  });
}

/** Convert katakana to hiragana */
export function katakanaToHiragana(text: string): string {
  return text.replace(/[\u30a1-\u30f6]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0x60);
  });
}

/** Convert half-width katakana to full-width katakana */
export function halfToFullKatakana(text: string): string {
  const halfToFull: { [key: string]: string } = {
    'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
    'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
    'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
    'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
    'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
    'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
    'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
    'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
    'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
    'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
    'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
    'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ', 'ｯ': 'ッ',
    'ｰ': 'ー', '｡': '。', '｢': '「', '｣': '」', '､': '、', '･': '・',
    'ﾞ': '゛', 'ﾟ': '゜'
  };

  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    // Handle dakuten (゛) and handakuten (゜)
    if (nextChar === 'ﾞ' || nextChar === 'ﾟ') {
      const base = halfToFull[char] || char;
      if (nextChar === 'ﾞ') {
        result += addDakuten(base);
      } else {
        result += addHandakuten(base);
      }
      i++; // Skip the next character
    } else {
      result += halfToFull[char] || char;
    }
  }

  return result;
}

/** Add dakuten to character */
function addDakuten(char: string): string {
  const dakutenMap: { [key: string]: string } = {
    'カ': 'ガ', 'キ': 'ギ', 'ク': 'グ', 'ケ': 'ゲ', 'コ': 'ゴ',
    'サ': 'ザ', 'シ': 'ジ', 'ス': 'ズ', 'セ': 'ゼ', 'ソ': 'ゾ',
    'タ': 'ダ', 'チ': 'ヂ', 'ツ': 'ヅ', 'テ': 'デ', 'ト': 'ド',
    'ハ': 'バ', 'ヒ': 'ビ', 'フ': 'ブ', 'ヘ': 'ベ', 'ホ': 'ボ'
  };
  return dakutenMap[char] || char;
}

/** Add handakuten to character */
function addHandakuten(char: string): string {
  const handakutenMap: { [key: string]: string } = {
    'ハ': 'パ', 'ヒ': 'ピ', 'フ': 'プ', 'ヘ': 'ペ', 'ホ': 'ポ'
  };
  return handakutenMap[char] || char;
}

/** Convert full-width alphanumeric to half-width */
export function fullToHalfAlphanumeric(text: string): string {
  return text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0xfee0);
  });
}

/** Convert half-width alphanumeric to full-width */
export function halfToFullAlphanumeric(text: string): string {
  return text.replace(/[A-Za-z0-9]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) + 0xfee0);
  });
}

/**
 * Text analysis
 */

/** Count characters with full-width = 2, half-width = 1 */
export function getDisplayWidth(text: string): number {
  return [...text].reduce((width, char) => {
    return width + (isFullWidth(char) ? 2 : 1);
  }, 0);
}

/** Get character type statistics */
export function getCharacterStats(text: string) {
  const chars = [...text];
  return {
    total: chars.length,
    hiragana: chars.filter(isHiragana).length,
    katakana: chars.filter(isKatakana).length,
    kanji: chars.filter(isKanji).length,
    fullWidth: chars.filter(isFullWidth).length,
    halfWidth: chars.filter(isHalfWidth).length,
    displayWidth: getDisplayWidth(text),
  };
}

/** Extract hiragana characters from text */
export function extractHiragana(text: string): string {
  return [...text].filter(isHiragana).join('');
}

/** Extract katakana characters from text */
export function extractKatakana(text: string): string {
  return [...text].filter(isKatakana).join('');
}

/** Extract kanji characters from text */
export function extractKanji(text: string): string {
  return [...text].filter(isKanji).join('');
}

/**
 * Utility functions
 */

/** Remove all whitespace including full-width spaces */
export function removeAllWhitespace(text: string): string {
  return text.replace(/[\s\u3000]/g, '');
}

/** Normalize whitespace (replace full-width spaces with half-width) */
export function normalizeWhitespace(text: string): string {
  return text.replace(/\u3000/g, ' ');
}

/** Trim including full-width spaces */
export function trimJapanese(text: string): string {
  return text.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
}
