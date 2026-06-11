export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
}

export type ContactFormValidation =
  | { ok: true; data: ContactFormData }
  | { ok: false; errors: string[] };

export const FIELD_LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  topic: 120,
  message: 5000,
} as const;

const REQUIRED_FIELDS = ['name', 'email', 'topic', 'message'] as const;

// Celowo proste sprawdzenie formatu — pełną weryfikację adresu i tak robi SMTP.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readField(input: Record<string, unknown>, field: keyof typeof FIELD_LIMITS): string | null {
  const value = input[field];
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return null;
  return value.trim();
}

export function validateContactForm(input: unknown): ContactFormValidation {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, errors: ['Invalid request body.'] };
  }

  const record = input as Record<string, unknown>;
  const errors: string[] = [];
  const data: Record<string, string> = {};

  for (const field of Object.keys(FIELD_LIMITS) as (keyof typeof FIELD_LIMITS)[]) {
    const value = readField(record, field);
    if (value === null) {
      errors.push(`Field "${field}" must be a string.`);
      continue;
    }
    if (value.length > FIELD_LIMITS[field]) {
      errors.push(`Field "${field}" exceeds ${FIELD_LIMITS[field]} characters.`);
      continue;
    }
    data[field] = value;
  }

  for (const field of REQUIRED_FIELDS) {
    if (field in data && data[field] === '') {
      errors.push(`Field "${field}" is required.`);
    }
  }

  if (data.email && !EMAIL_PATTERN.test(data.email)) {
    errors.push('Field "email" is not a valid email address.');
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: data as unknown as ContactFormData };
}
