import { accountSchema, basicInfoSchema, calculateAge, parseDob } from '../validation';

describe('calculateAge', () => {
  it('handles birthdays not yet reached this year', () => {
    expect(calculateAge(new Date(1990, 5, 15), new Date(2026, 5, 14))).toBe(35);
    expect(calculateAge(new Date(1990, 5, 15), new Date(2026, 5, 15))).toBe(36);
  });
});

describe('parseDob', () => {
  it('accepts valid and rejects impossible dates', () => {
    expect(parseDob('1995-02-28')).not.toBeNull();
    expect(parseDob('1995-02-30')).toBeNull();
    expect(parseDob('28/02/1995')).toBeNull();
  });
});

describe('basicInfoSchema', () => {
  const base = { firstName: 'Amara', lastName: 'D', dob: '1995-01-01', gender: 'Woman', meet: ['Men'], city: 'Lagos', country: 'Nigeria' };
  it('accepts an adult', () => expect(basicInfoSchema.safeParse(base).success).toBe(true));
  it('rejects under 18', () => {
    const year = new Date().getFullYear() - 16;
    expect(basicInfoSchema.safeParse({ ...base, dob: `${year}-01-01` }).success).toBe(false);
  });
});

describe('accountSchema', () => {
  it('requires matching strong passwords', () => {
    expect(accountSchema.safeParse({ email: 'a@b.co', password: 'abcdefg1', confirm: 'abcdefg1' }).success).toBe(true);
    expect(accountSchema.safeParse({ email: 'a@b.co', password: 'abcdefg1', confirm: 'x' }).success).toBe(false);
    expect(accountSchema.safeParse({ email: 'a@b.co', password: 'short1', confirm: 'short1' }).success).toBe(false);
  });
});
