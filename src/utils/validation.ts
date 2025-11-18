/**
 * Japanese text validation utilities
 * Practical validation functions for form inputs, data processing, etc.
 */

import {
  isAllHiragana,
  isAllKatakana,
  isAllKanji,
  getCharacterStats,
  getDisplayWidth,
} from '../index';

/**
 * Validate Japanese name (family name + given name)
 */
export function validateJapaneseName(
  familyName: string,
  givenName: string
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if not empty
  if (!familyName || familyName.trim() === '') {
    errors.push('Family name is required');
  }
  if (!givenName || givenName.trim() === '') {
    errors.push('Given name is required');
  }

  // Check if contains only Japanese characters
  const familyStats = getCharacterStats(familyName);
  const givenStats = getCharacterStats(givenName);

  const isFamilyJapanese =
    familyStats.hiragana + familyStats.katakana + familyStats.kanji ===
    familyStats.total;
  const isGivenJapanese =
    givenStats.hiragana + givenStats.katakana + givenStats.kanji ===
    givenStats.total;

  if (!isFamilyJapanese) {
    errors.push('Family name must contain only Japanese characters');
  }
  if (!isGivenJapanese) {
    errors.push('Given name must contain only Japanese characters');
  }

  // Check reasonable length
  if (getDisplayWidth(familyName) > 20) {
    errors.push('Family name is too long (max 10 characters)');
  }
  if (getDisplayWidth(givenName) > 20) {
    errors.push('Given name is too long (max 10 characters)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate furigana (reading) matches the kanji text
 */
export function validateFurigana(
  kanjiText: string,
  furigana: string
): {
  valid: boolean;
  error?: string;
} {
  // Furigana should be hiragana only
  if (!isAllHiragana(furigana)) {
    return {
      valid: false,
      error: 'Furigana must be hiragana only',
    };
  }

  // Check length compatibility (furigana is usually longer)
  const kanjiStats = getCharacterStats(kanjiText);
  if (furigana.length < kanjiStats.kanji) {
    return {
      valid: false,
      error: 'Furigana seems too short for the kanji text',
    };
  }

  return { valid: true };
}

/**
 * Validate katakana name (for foreign names)
 */
export function validateKatakanaName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Name is required' };
  }

  // Allow katakana, long vowel mark, and middle dot
  const validPattern = /^[ァ-ヴー・]+$/;
  if (!validPattern.test(name)) {
    return {
      valid: false,
      error: 'Name must contain only katakana characters',
    };
  }

  if (getDisplayWidth(name) > 40) {
    return {
      valid: false,
      error: 'Name is too long (max 20 characters)',
    };
  }

  return { valid: true };
}

/**
 * Validate postal code format
 */
export function validatePostalCode(postalCode: string): {
  valid: boolean;
  formatted?: string;
  error?: string;
} {
  // Remove hyphens and spaces
  const cleaned = postalCode.replace(/[-\s]/g, '');

  // Check if 7 digits
  if (!/^\d{7}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Postal code must be 7 digits',
    };
  }

  // Format as XXX-XXXX
  const formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;

  return {
    valid: true,
    formatted,
  };
}

/**
 * Validate Japanese phone number
 */
export function validatePhoneNumber(phoneNumber: string): {
  valid: boolean;
  formatted?: string;
  type?: 'mobile' | 'landline' | 'unknown';
  error?: string;
} {
  // Remove hyphens, spaces, and parentheses
  const cleaned = phoneNumber.replace(/[-\s()]/g, '');

  // Check if only digits
  if (!/^\d+$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Phone number must contain only digits',
    };
  }

  // Mobile: 090/080/070 + 8 digits
  if (/^0[789]0\d{8}$/.test(cleaned)) {
    const formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(
      3,
      7
    )}-${cleaned.slice(7)}`;
    return {
      valid: true,
      formatted,
      type: 'mobile',
    };
  }

  // Landline: 0X-XXXX-XXXX or 0XX-XXX-XXXX or 0XXX-XX-XXXX
  if (/^0\d{9}$/.test(cleaned)) {
    // Tokyo (03), Osaka (06), etc: 0X-XXXX-XXXX
    if (['03', '04', '06'].includes(cleaned.slice(0, 2))) {
      const formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(
        2,
        6
      )}-${cleaned.slice(6)}`;
      return {
        valid: true,
        formatted,
        type: 'landline',
      };
    }

    // Other cities: 0XX-XXX-XXXX
    const formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(
      3,
      6
    )}-${cleaned.slice(6)}`;
    return {
      valid: true,
      formatted,
      type: 'landline',
    };
  }

  return {
    valid: false,
    error: 'Invalid phone number format',
  };
}

/**
 * Validate text length for forms (considering full-width characters)
 */
export function validateTextLength(
  text: string,
  minLength: number,
  maxLength: number,
  countMethod: 'chars' | 'displayWidth' = 'chars'
): {
  valid: boolean;
  length: number;
  error?: string;
} {
  const length =
    countMethod === 'displayWidth' ? getDisplayWidth(text) : text.length;

  if (length < minLength) {
    return {
      valid: false,
      length,
      error: `Text is too short (minimum: ${minLength}, actual: ${length})`,
    };
  }

  if (length > maxLength) {
    return {
      valid: false,
      length,
      error: `Text is too long (maximum: ${maxLength}, actual: ${length})`,
    };
  }

  return {
    valid: true,
    length,
  };
}

/**
 * Sanitize user input (remove control characters, normalize)
 */
export function sanitizeInput(input: string): string {
  // Remove control characters except newline and tab
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Normalize whitespace
  sanitized = sanitized.replace(/\u3000/g, ' '); // Full-width space to half-width

  // Trim
  sanitized = sanitized.trim();

  return sanitized;
}
