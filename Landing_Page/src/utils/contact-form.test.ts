import { describe, expect, it } from 'vitest';
import { FIELD_LIMITS, validateContactForm } from './contact-form';

const validInput = {
  name: 'Jan Kowalski',
  email: 'jan@example.com',
  company: 'Acme Sp. z o.o.',
  topic: 'Ask about pricing',
  message: 'Hello, I would like to know more about your pricing.',
};

describe('validateContactForm', () => {
  it('accepts a complete valid submission', () => {
    const result = validateContactForm(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual(validInput);
    }
  });

  it('trims whitespace from all fields', () => {
    const result = validateContactForm({
      ...validInput,
      name: '  Jan Kowalski  ',
      email: ' jan@example.com ',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe('Jan Kowalski');
      expect(result.data.email).toBe('jan@example.com');
    }
  });

  it('treats company as optional', () => {
    const { company, ...withoutCompany } = validInput;
    const result = validateContactForm(withoutCompany);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.company).toBe('');
    }
  });

  it.each(['name', 'email', 'topic', 'message'] as const)(
    'rejects a submission with missing %s',
    (field) => {
      const input: Record<string, unknown> = { ...validInput };
      delete input[field];
      const result = validateContactForm(input);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.join(' ')).toContain(field);
      }
    },
  );

  it('rejects whitespace-only required fields', () => {
    const result = validateContactForm({ ...validInput, message: '   ' });
    expect(result.ok).toBe(false);
  });

  it('rejects an invalid email address', () => {
    const result = validateContactForm({ ...validInput, email: 'not-an-email' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('email');
    }
  });

  it('rejects fields exceeding their length limits', () => {
    const result = validateContactForm({
      ...validInput,
      message: 'x'.repeat(FIELD_LIMITS.message + 1),
    });
    expect(result.ok).toBe(false);
  });

  it('rejects non-string field values', () => {
    const result = validateContactForm({ ...validInput, name: 42 });
    expect(result.ok).toBe(false);
  });

  it('rejects non-object input', () => {
    expect(validateContactForm(null).ok).toBe(false);
    expect(validateContactForm('hello').ok).toBe(false);
    expect(validateContactForm(undefined).ok).toBe(false);
  });
});
