import {
  isHiragana,
  isKatakana,
  isKanji,
  isFullWidth,
  isHalfWidth,
  isAllHiragana,
  isAllKatakana,
  isAllKanji,
  hiraganaToKatakana,
  katakanaToHiragana,
  halfToFullKatakana,
  fullToHalfAlphanumeric,
  halfToFullAlphanumeric,
  getDisplayWidth,
  getCharacterStats,
  extractHiragana,
  extractKatakana,
  extractKanji,
  removeAllWhitespace,
  normalizeWhitespace,
  trimJapanese,
} from './index';

describe('japanese-text-utils', () => {
  describe('Character type detection', () => {
    describe('isHiragana', () => {
      it('should detect hiragana characters', () => {
        expect(isHiragana('あ')).toBe(true);
        expect(isHiragana('ひ')).toBe(true);
        expect(isHiragana('ん')).toBe(true);
      });

      it('should reject non-hiragana characters', () => {
        expect(isHiragana('ア')).toBe(false);
        expect(isHiragana('漢')).toBe(false);
        expect(isHiragana('A')).toBe(false);
      });

      it('should handle empty string', () => {
        expect(isHiragana('')).toBe(false);
      });
    });

    describe('isKatakana', () => {
      it('should detect katakana characters', () => {
        expect(isKatakana('ア')).toBe(true);
        expect(isKatakana('ヒ')).toBe(true);
        expect(isKatakana('ン')).toBe(true);
      });

      it('should reject non-katakana characters', () => {
        expect(isKatakana('あ')).toBe(false);
        expect(isKatakana('漢')).toBe(false);
        expect(isKatakana('A')).toBe(false);
      });
    });

    describe('isKanji', () => {
      it('should detect kanji characters', () => {
        expect(isKanji('漢')).toBe(true);
        expect(isKanji('字')).toBe(true);
        expect(isKanji('日')).toBe(true);
      });

      it('should reject non-kanji characters', () => {
        expect(isKanji('あ')).toBe(false);
        expect(isKanji('ア')).toBe(false);
        expect(isKanji('A')).toBe(false);
      });
    });

    describe('isFullWidth', () => {
      it('should detect full-width characters', () => {
        expect(isFullWidth('あ')).toBe(true);
        expect(isFullWidth('Ａ')).toBe(true);
        expect(isFullWidth('１')).toBe(true);
      });

      it('should reject half-width characters', () => {
        expect(isFullWidth('A')).toBe(false);
        expect(isFullWidth('1')).toBe(false);
      });
    });

    describe('isHalfWidth', () => {
      it('should detect half-width characters', () => {
        expect(isHalfWidth('A')).toBe(true);
        expect(isHalfWidth('1')).toBe(true);
      });

      it('should reject full-width characters', () => {
        expect(isHalfWidth('あ')).toBe(false);
        expect(isHalfWidth('Ａ')).toBe(false);
      });
    });

    describe('isAllHiragana', () => {
      it('should detect all-hiragana strings', () => {
        expect(isAllHiragana('あいうえお')).toBe(true);
        expect(isAllHiragana('ひらがな')).toBe(true);
      });

      it('should reject mixed strings', () => {
        expect(isAllHiragana('あアい')).toBe(false);
        expect(isAllHiragana('あいうA')).toBe(false);
      });

      it('should handle empty string', () => {
        expect(isAllHiragana('')).toBe(false);
      });
    });

    describe('isAllKatakana', () => {
      it('should detect all-katakana strings', () => {
        expect(isAllKatakana('アイウエオ')).toBe(true);
        expect(isAllKatakana('カタカナ')).toBe(true);
      });

      it('should reject mixed strings', () => {
        expect(isAllKatakana('アあイ')).toBe(false);
      });
    });

    describe('isAllKanji', () => {
      it('should detect all-kanji strings', () => {
        expect(isAllKanji('漢字')).toBe(true);
        expect(isAllKanji('日本語')).toBe(true);
      });

      it('should reject mixed strings', () => {
        expect(isAllKanji('漢字abc')).toBe(false);
      });
    });
  });

  describe('Character conversion', () => {
    describe('hiraganaToKatakana', () => {
      it('should convert hiragana to katakana', () => {
        expect(hiraganaToKatakana('あいうえお')).toBe('アイウエオ');
        expect(hiraganaToKatakana('ひらがな')).toBe('ヒラガナ');
      });

      it('should preserve non-hiragana characters', () => {
        expect(hiraganaToKatakana('あいうABC')).toBe('アイウABC');
      });

      it('should handle empty string', () => {
        expect(hiraganaToKatakana('')).toBe('');
      });
    });

    describe('katakanaToHiragana', () => {
      it('should convert katakana to hiragana', () => {
        expect(katakanaToHiragana('アイウエオ')).toBe('あいうえお');
        expect(katakanaToHiragana('カタカナ')).toBe('かたかな');
      });

      it('should preserve non-katakana characters', () => {
        expect(katakanaToHiragana('アイウABC')).toBe('あいうABC');
      });
    });

    describe('halfToFullKatakana', () => {
      it('should convert half-width katakana to full-width', () => {
        expect(halfToFullKatakana('ｱｲｳｴｵ')).toBe('アイウエオ');
        expect(halfToFullKatakana('ｶﾀｶﾅ')).toBe('カタカナ');
      });

      it('should handle dakuten', () => {
        expect(halfToFullKatakana('ｶﾞｷﾞｸﾞ')).toBe('ガギグ');
      });

      it('should handle handakuten', () => {
        expect(halfToFullKatakana('ﾊﾟﾋﾟﾌﾟ')).toBe('パピプ');
      });

      it('should preserve non-katakana characters', () => {
        expect(halfToFullKatakana('ｱｲｳABC')).toBe('アイウABC');
      });
    });

    describe('fullToHalfAlphanumeric', () => {
      it('should convert full-width to half-width', () => {
        expect(fullToHalfAlphanumeric('ＡＢＣ')).toBe('ABC');
        expect(fullToHalfAlphanumeric('１２３')).toBe('123');
        expect(fullToHalfAlphanumeric('ａｂｃ')).toBe('abc');
      });

      it('should preserve non-alphanumeric characters', () => {
        expect(fullToHalfAlphanumeric('Ａあア')).toBe('Aあア');
      });
    });

    describe('halfToFullAlphanumeric', () => {
      it('should convert half-width to full-width', () => {
        expect(halfToFullAlphanumeric('ABC')).toBe('ＡＢＣ');
        expect(halfToFullAlphanumeric('123')).toBe('１２３');
        expect(halfToFullAlphanumeric('abc')).toBe('ａｂｃ');
      });

      it('should preserve non-alphanumeric characters', () => {
        expect(halfToFullAlphanumeric('Aあア')).toBe('Ａあア');
      });
    });
  });

  describe('Text analysis', () => {
    describe('getDisplayWidth', () => {
      it('should count full-width as 2, half-width as 1', () => {
        expect(getDisplayWidth('ABC')).toBe(3);
        expect(getDisplayWidth('あいう')).toBe(6);
        expect(getDisplayWidth('Aあ')).toBe(3);
      });

      it('should handle empty string', () => {
        expect(getDisplayWidth('')).toBe(0);
      });
    });

    describe('getCharacterStats', () => {
      it('should return correct statistics', () => {
        const stats = getCharacterStats('あアA漢');
        expect(stats.total).toBe(4);
        expect(stats.hiragana).toBe(1);
        expect(stats.katakana).toBe(1);
        expect(stats.kanji).toBe(1);
        expect(stats.fullWidth).toBe(3);
        expect(stats.halfWidth).toBe(1);
        expect(stats.displayWidth).toBe(7);
      });

      it('should handle empty string', () => {
        const stats = getCharacterStats('');
        expect(stats.total).toBe(0);
        expect(stats.hiragana).toBe(0);
        expect(stats.displayWidth).toBe(0);
      });
    });

    describe('extractHiragana', () => {
      it('should extract only hiragana characters', () => {
        expect(extractHiragana('あアA漢いう')).toBe('あいう');
        expect(extractHiragana('ひらがな123')).toBe('ひらがな');
      });

      it('should handle text with no hiragana', () => {
        expect(extractHiragana('ABC123')).toBe('');
      });
    });

    describe('extractKatakana', () => {
      it('should extract only katakana characters', () => {
        expect(extractKatakana('あアA漢イウ')).toBe('アイウ');
        expect(extractKatakana('カタカナ123')).toBe('カタカナ');
      });
    });

    describe('extractKanji', () => {
      it('should extract only kanji characters', () => {
        expect(extractKanji('あア漢字A')).toBe('漢字');
        expect(extractKanji('日本語123')).toBe('日本語');
      });
    });
  });

  describe('Utility functions', () => {
    describe('removeAllWhitespace', () => {
      it('should remove all whitespace', () => {
        expect(removeAllWhitespace('a b c')).toBe('abc');
        expect(removeAllWhitespace('あ　い　う')).toBe('あいう');
      });

      it('should remove tabs and newlines', () => {
        expect(removeAllWhitespace('a\tb\nc')).toBe('abc');
      });
    });

    describe('normalizeWhitespace', () => {
      it('should convert full-width spaces to half-width', () => {
        expect(normalizeWhitespace('あ　い　う')).toBe('あ い う');
      });

      it('should preserve half-width spaces', () => {
        expect(normalizeWhitespace('a b c')).toBe('a b c');
      });
    });

    describe('trimJapanese', () => {
      it('should trim half-width spaces', () => {
        expect(trimJapanese('  abc  ')).toBe('abc');
      });

      it('should trim full-width spaces', () => {
        expect(trimJapanese('　　あいう　　')).toBe('あいう');
      });

      it('should trim mixed spaces', () => {
        expect(trimJapanese(' 　abc　 ')).toBe('abc');
      });

      it('should preserve internal spaces', () => {
        expect(trimJapanese('  a b c  ')).toBe('a b c');
      });
    });
  });

  describe('Real-world use cases', () => {
    it('should normalize user input', () => {
      const input = '　ＡＢＣ１２３　';
      const normalized = fullToHalfAlphanumeric(trimJapanese(input));
      expect(normalized).toBe('ABC123');
    });

    it('should convert furigana reading', () => {
      const hiragana = 'にほんご';
      const katakana = hiraganaToKatakana(hiragana);
      expect(katakana).toBe('ニホンゴ');
    });

    it('should validate Japanese-only text', () => {
      const text = '日本語テキスト';
      const stats = getCharacterStats(text);
      const isJapanese = stats.hiragana + stats.katakana + stats.kanji === stats.total;
      expect(isJapanese).toBe(true);
    });
  });
});
