/**
 * Japanese text formatting utilities
 * Practical formatting functions for display, export, etc.
 */

import {
  hiraganaToKatakana,
  katakanaToHiragana,
  fullToHalfAlphanumeric,
  halfToFullAlphanumeric,
  trimJapanese,
} from '../index';

/**
 * Format Japanese name for display (family name + given name)
 */
export function formatJapaneseName(
  familyName: string,
  givenName: string,
  format: 'full' | 'family-first' | 'given-first' = 'family-first'
): string {
  switch (format) {
    case 'full':
      return `${familyName} ${givenName}`;
    case 'family-first':
      return `${familyName} ${givenName}`;
    case 'given-first':
      return `${givenName} ${familyName}`;
    default:
      return `${familyName} ${givenName}`;
  }
}

/**
 * Format postal code (XXX-XXXX)
 */
export function formatPostalCode(postalCode: string): string {
  const cleaned = postalCode.replace(/[-\s]/g, '');
  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  return postalCode;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(
  phoneNumber: string,
  type: 'mobile' | 'landline' | 'auto' = 'auto'
): string {
  const cleaned = phoneNumber.replace(/[-\s()]/g, '');

  if (type === 'mobile' || (type === 'auto' && /^0[789]0/.test(cleaned))) {
    // Mobile: 090-XXXX-XXXX
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
  }

  if (type === 'landline' || (type === 'auto' && /^0\d/.test(cleaned))) {
    // Landline: Various formats based on area code
    if (cleaned.length === 10) {
      // 0X-XXXX-XXXX or 0XX-XXX-XXXX
      if (['03', '04', '06'].includes(cleaned.slice(0, 2))) {
        return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
      } else {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
    }
  }

  return phoneNumber;
}

/**
 * Format currency (Japanese Yen)
 */
export function formatCurrency(amount: number, useSymbol: boolean = true): string {
  const formatted = amount.toLocaleString('ja-JP');
  return useSymbol ? `¥${formatted}` : formatted;
}

/**
 * Format date in Japanese format (YYYY年MM月DD日)
 */
export function formatJapaneseDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * Format Japanese era date (Reiwa, Heisei, etc.)
 */
export function formatEraDate(date: Date): string {
  const year = date.getFullYear();

  if (year >= 2019) {
    const eraYear = year - 2018;
    return `令和${eraYear}年`;
  } else if (year >= 1989) {
    const eraYear = year - 1988;
    return `平成${eraYear}年`;
  } else if (year >= 1926) {
    const eraYear = year - 1925;
    return `昭和${eraYear}年`;
  }

  return `${year}年`;
}

/**
 * Normalize text for search/comparison (convert to hiragana, remove spaces)
 */
export function normalizeForSearch(text: string): string {
  // Convert katakana to hiragana
  let normalized = katakanaToHiragana(text);

  // Convert full-width alphanumeric to half-width
  normalized = fullToHalfAlphanumeric(normalized);

  // Remove all whitespace
  normalized = normalized.replace(/[\s\u3000]/g, '');

  // Lowercase
  normalized = normalized.toLowerCase();

  return normalized;
}

/**
 * Normalize text for storage (consistent format)
 */
export function normalizeForStorage(text: string): string {
  // Trim
  let normalized = trimJapanese(text);

  // Convert full-width spaces to half-width
  normalized = normalized.replace(/\u3000/g, ' ');

  // Normalize consecutive spaces to single space
  normalized = normalized.replace(/\s+/g, ' ');

  return normalized;
}

/**
 * Format address for display
 */
export function formatAddress(components: {
  postalCode?: string;
  prefecture?: string;
  city?: string;
  town?: string;
  building?: string;
}): string {
  const parts: string[] = [];

  if (components.postalCode) {
    parts.push(`〒${formatPostalCode(components.postalCode)}`);
  }

  if (components.prefecture) {
    parts.push(components.prefecture);
  }

  if (components.city) {
    parts.push(components.city);
  }

  if (components.town) {
    parts.push(components.town);
  }

  if (components.building) {
    parts.push(components.building);
  }

  return parts.join(' ');
}

/**
 * Truncate text with ellipsis (considering display width)
 */
export function truncateText(
  text: string,
  maxLength: number,
  ellipsis: string = '...'
): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Convert reading (furigana) format for display
 */
export function formatFurigana(
  kanji: string,
  reading: string,
  format: 'html' | 'parentheses' | 'ruby' = 'parentheses'
): string {
  switch (format) {
    case 'html':
      return `<ruby>${kanji}<rt>${reading}</rt></ruby>`;
    case 'parentheses':
      return `${kanji}（${reading}）`;
    case 'ruby':
      return `${kanji}《${reading}》`;
    default:
      return `${kanji}（${reading}）`;
  }
}

/**
 * Format number with Japanese counter suffix
 */
export function formatWithCounter(
  count: number,
  counter: '人' | '個' | '冊' | '枚' | '本' | '匹' | '台' | '回'
): string {
  return `${count}${counter}`;
}

/**
 * Convert number to Japanese numerals
 */
export function toJapaneseNumerals(num: number): string {
  if (num === 0) return '〇';

  const digits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const units = ['', '十', '百', '千'];
  const bigUnits = ['', '万', '億', '兆'];

  if (num < 0) return '-' + toJapaneseNumerals(-num);
  if (num < 10) return digits[num];

  let result = '';
  let unitIndex = 0;

  while (num > 0) {
    const segment = num % 10000;
    if (segment > 0) {
      let segmentStr = '';
      let tempNum = segment;
      let localUnitIndex = 0;

      while (tempNum > 0) {
        const digit = tempNum % 10;
        if (digit > 0) {
          if (digit === 1 && localUnitIndex > 0) {
            segmentStr = units[localUnitIndex] + segmentStr;
          } else {
            segmentStr = digits[digit] + units[localUnitIndex] + segmentStr;
          }
        }
        tempNum = Math.floor(tempNum / 10);
        localUnitIndex++;
      }

      result = segmentStr + bigUnits[unitIndex] + result;
    }
    num = Math.floor(num / 10000);
    unitIndex++;
  }

  return result;
}
