import { z } from 'zod';

export const MIN_AGE_LEGAL = 18;
export const MIN_AGE_AUDIENCE = 21;

export function calculateAge(dob: Date, today = new Date()): number {
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

/** Parses strict YYYY-MM-DD; returns null for invalid or impossible dates. */
export function parseDob(input: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
  if (!match) return null;
  const [, y, m, d] = match.map(Number) as unknown as number[];
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

export const basicInfoSchema = z.object({
  firstName: z.string().trim().min(2, 'Enter your first name').max(40),
  lastName: z.string().trim().min(1, 'Enter your last name').max(60),
  dob: z.string().refine((v) => parseDob(v) !== null, 'Use the format YYYY-MM-DD').refine((v) => {
    const d = parseDob(v);
    return !d || calculateAge(d) >= MIN_AGE_LEGAL;
  }, 'You must be at least 18 to use L’AMOUR GOLD'),
  gender: z.string().min(1, 'Select your gender identity'),
  meet: z.array(z.string()).min(1, 'Select at least one'),
  city: z.string().trim().min(2, 'Enter your city'),
  country: z.string().trim().min(2, 'Enter your country'),
});

export const accountSchema = z
  .object({
    email: z.string().trim().email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Za-z]/, 'Include a letter')
      .regex(/[0-9]/, 'Include a number'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match' });

export const bioSchema = z.object({
  bio: z.string().trim().min(20, 'Tell us a little more (20+ characters)').max(500),
  prompts: z
    .array(z.object({ question: z.string(), answer: z.string().trim().max(200) }))
    .refine((p) => p.filter((x) => x.answer.length > 0).length >= 3, 'Answer three prompts'),
});

export type BasicInfo = z.infer<typeof basicInfoSchema>;
export type AccountInput = z.infer<typeof accountSchema>;
