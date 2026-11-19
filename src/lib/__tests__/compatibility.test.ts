import { computeCompatibility, CompatSubject } from '../compatibility';

const base: CompatSubject = { experiences: ['love'], values: ['Honesty', 'Family'], interests: ['Art', 'Jazz'], smoking: 'Never', drinking: 'Socially', communication: ['Texting'] };

describe('computeCompatibility', () => {
  it('scores identical profiles at 100', () => {
    expect(computeCompatibility(base, base, 'love').score).toBe(100);
  });
  it('gives zero intention points without a shared experience', () => {
    const r = computeCompatibility(base, { ...base, experiences: ['spark'] }, 'love');
    expect(r.sharedIntention).toBe(false);
    expect(r.parts.find((p) => p.label === 'Shared intention')?.points).toBe(0);
  });
  it('returns null when no data overlaps in availability', () => {
    const empty: CompatSubject = { experiences: [], values: [], interests: [], communication: [] };
    expect(computeCompatibility(empty, base, 'love').score).toBeNull();
  });
  it('always includes the disclaimer', () => {
    expect(computeCompatibility(base, base, 'love').disclaimer).toMatch(/not a prediction/i);
  });
});
