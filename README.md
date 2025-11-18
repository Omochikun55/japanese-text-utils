# @omochikun/japanese-text-utils

**Utilities for Japanese text processing: hiragana/katakana conversion, character type detection, and text analysis**

[![npm version](https://img.shields.io/npm/v/@omochikun/japanese-text-utils.svg)](https://www.npmjs.com/package/@omochikun/japanese-text-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

A lightweight, zero-dependency TypeScript library for Japanese text processing including character type detection, kana conversion, and text analysis.

## ✨ Features

- 🔤 **Character Type Detection** - Identify hiragana, katakana, kanji, full-width/half-width
- 🔄 **Kana Conversion** - Convert between hiragana ↔ katakana, half-width ↔ full-width
- 📊 **Text Analysis** - Character statistics, display width calculation, text extraction
- 🧹 **Text Normalization** - Whitespace handling, trimming with full-width support
- 📦 **Zero Dependencies** - Lightweight and fast
- 🔧 **TypeScript First** - Full type safety and IntelliSense support
- 🧪 **Well Tested** - 50 unit tests with 100% coverage

## 📦 Installation

```bash
npm install @omochikun/japanese-text-utils
```

## 🚀 Quick Start

```typescript
import {
  hiraganaToKatakana,
  isHiragana,
  getCharacterStats
} from '@omochikun/japanese-text-utils';

// Convert hiragana to katakana
hiraganaToKatakana('にほんご'); // 'ニホンゴ'

// Check character type
isHiragana('あ'); // true
isHiragana('ア'); // false

// Get text statistics
getCharacterStats('あアA漢');
// {
//   total: 4,
//   hiragana: 1,
//   katakana: 1,
//   kanji: 1,
//   fullWidth: 3,
//   halfWidth: 1,
//   displayWidth: 7
// }
```

## 📖 API Reference

### Character Type Detection

#### `isHiragana(char: string): boolean`

Check if a character is hiragana.

```typescript
isHiragana('あ'); // true
isHiragana('ア'); // false
```

#### `isKatakana(char: string): boolean`

Check if a character is katakana.

```typescript
isKatakana('ア'); // true
isKatakana('あ'); // false
```

#### `isKanji(char: string): boolean`

Check if a character is kanji.

```typescript
isKanji('漢'); // true
isKanji('あ'); // false
```

#### `isFullWidth(char: string): boolean`

Check if a character is full-width.

```typescript
isFullWidth('Ａ'); // true
isFullWidth('A'); // false
```

#### `isHalfWidth(char: string): boolean`

Check if a character is half-width.

```typescript
isHalfWidth('A'); // true
isHalfWidth('Ａ'); // false
```

#### `isAllHiragana(text: string): boolean`

Check if entire string is hiragana only.

```typescript
isAllHiragana('ひらがな'); // true
isAllHiragana('ひらがなABC'); // false
```

#### `isAllKatakana(text: string): boolean`

Check if entire string is katakana only.

```typescript
isAllKatakana('カタカナ'); // true
```

#### `isAllKanji(text: string): boolean`

Check if entire string is kanji only.

```typescript
isAllKanji('漢字'); // true
```

---

### Character Conversion

#### `hiraganaToKatakana(text: string): string`

Convert hiragana to katakana.

```typescript
hiraganaToKatakana('あいうえお'); // 'アイウエオ'
hiraganaToKatakana('ひらがな'); // 'ヒラガナ'
```

#### `katakanaToHiragana(text: string): string`

Convert katakana to hiragana.

```typescript
katakanaToHiragana('アイウエオ'); // 'あいうえお'
katakanaToHiragana('カタカナ'); // 'かたかな'
```

#### `halfToFullKatakana(text: string): string`

Convert half-width katakana to full-width (handles dakuten/handakuten).

```typescript
halfToFullKatakana('ｱｲｳｴｵ'); // 'アイウエオ'
halfToFullKatakana('ｶﾞｷﾞｸﾞ'); // 'ガギグ' (dakuten)
halfToFullKatakana('ﾊﾟﾋﾟﾌﾟ'); // 'パピプ' (handakuten)
```

#### `fullToHalfAlphanumeric(text: string): string`

Convert full-width alphanumeric to half-width.

```typescript
fullToHalfAlphanumeric('ＡＢＣ１２３'); // 'ABC123'
```

#### `halfToFullAlphanumeric(text: string): string`

Convert half-width alphanumeric to full-width.

```typescript
halfToFullAlphanumeric('ABC123'); // 'ＡＢＣ１２３'
```

---

### Text Analysis

#### `getDisplayWidth(text: string): number`

Calculate display width (full-width = 2, half-width = 1).

```typescript
getDisplayWidth('ABC'); // 3
getDisplayWidth('あいう'); // 6
getDisplayWidth('Aあ'); // 3
```

#### `getCharacterStats(text: string)`

Get comprehensive character statistics.

```typescript
getCharacterStats('あアA漢');
// {
//   total: 4,
//   hiragana: 1,
//   katakana: 1,
//   kanji: 1,
//   fullWidth: 3,
//   halfWidth: 1,
//   displayWidth: 7
// }
```

#### `extractHiragana(text: string): string`

Extract only hiragana characters.

```typescript
extractHiragana('あアA漢いう'); // 'あいう'
```

#### `extractKatakana(text: string): string`

Extract only katakana characters.

```typescript
extractKatakana('あアA漢イウ'); // 'アイウ'
```

#### `extractKanji(text: string): string`

Extract only kanji characters.

```typescript
extractKanji('あア漢字A'); // '漢字'
```

---

### Utility Functions

#### `removeAllWhitespace(text: string): string`

Remove all whitespace including full-width spaces.

```typescript
removeAllWhitespace('a b c'); // 'abc'
removeAllWhitespace('あ　い　う'); // 'あいう'
```

#### `normalizeWhitespace(text: string): string`

Convert full-width spaces to half-width.

```typescript
normalizeWhitespace('あ　い　う'); // 'あ い う'
```

#### `trimJapanese(text: string): string`

Trim including full-width spaces.

```typescript
trimJapanese('　　あいう　　'); // 'あいう'
trimJapanese(' 　abc　 '); // 'abc'
```

---

## 💡 Usage Examples

### Example 1: Input Normalization

```typescript
import { fullToHalfAlphanumeric, trimJapanese } from '@omochikun/japanese-text-utils';

function normalizeUserInput(input: string): string {
  return fullToHalfAlphanumeric(trimJapanese(input));
}

normalizeUserInput('　ＡＢＣ１２３　'); // 'ABC123'
```

### Example 2: Furigana Reading Conversion

```typescript
import { hiraganaToKatakana } from '@omochikun/japanese-text-utils';

function convertReading(hiraganaReading: string): string {
  return hiraganaToKatakana(hiraganaReading);
}

convertReading('にほんご'); // 'ニホンゴ'
```

### Example 3: Validate Japanese Text

```typescript
import { getCharacterStats } from '@omochikun/japanese-text-utils';

function isJapaneseOnly(text: string): boolean {
  const stats = getCharacterStats(text);
  return stats.hiragana + stats.katakana + stats.kanji === stats.total;
}

isJapaneseOnly('日本語テキスト'); // true
isJapaneseOnly('日本語ABC'); // false
```

### Example 4: Character Count for Display

```typescript
import { getDisplayWidth } from '@omochikun/japanese-text-utils';

function validateLength(text: string, maxWidth: number): boolean {
  return getDisplayWidth(text) <= maxWidth;
}

validateLength('あいう', 6); // true (3 × 2 = 6)
validateLength('あいう', 5); // false (3 × 2 = 6 > 5)
```

### Example 5: Extract Japanese Characters

```typescript
import { extractKanji, extractHiragana, extractKatakana } from '@omochikun/japanese-text-utils';

function separateCharacterTypes(text: string) {
  return {
    kanji: extractKanji(text),
    hiragana: extractHiragana(text),
    katakana: extractKatakana(text),
  };
}

separateCharacterTypes('漢字ひらがなカタカナABC');
// {
//   kanji: '漢字',
//   hiragana: 'ひらがな',
//   katakana: 'カタカナ'
// }
```

### Example 6: Form Validation

```typescript
import { isAllHiragana, isAllKatakana } from '@omochikun/japanese-text-utils';

function validateFurigana(furigana: string): boolean {
  return isAllHiragana(furigana);
}

function validateKatakanaName(name: string): boolean {
  return isAllKatakana(name);
}

validateFurigana('にほんご'); // true
validateFurigana('ニホンゴ'); // false

validateKatakanaName('タナカ'); // true
```

### Example 7: Half-width Katakana Normalization

```typescript
import { halfToFullKatakana } from '@omochikun/japanese-text-utils';

// Convert legacy half-width katakana to modern full-width
function normalizeLegacyText(text: string): string {
  return halfToFullKatakana(text);
}

normalizeLegacyText('ｶﾀｶﾅ'); // 'カタカナ'
normalizeLegacyText('ﾊﾟｿｺﾝ'); // 'パソコン'
```

---

## 🧪 Testing

This package is thoroughly tested with 50 unit tests covering:

- Character type detection
- Conversion accuracy
- Edge cases (empty strings, mixed content)
- Real-world use cases

Run tests:

```bash
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Setup

```bash
# Clone repository
git clone https://github.com/Omochikun55/japanese-text-utils.git
cd japanese-text-utils

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- [GitHub Repository](https://github.com/Omochikun55/japanese-text-utils)
- [npm Package](https://www.npmjs.com/package/@omochikun/japanese-text-utils)
- [Issues](https://github.com/Omochikun55/japanese-text-utils/issues)

---

## 🙏 Acknowledgments

Created with ❤️ for developers working with Japanese text.

**🤖 Generated with [Claude Code](https://claude.com/claude-code)**
