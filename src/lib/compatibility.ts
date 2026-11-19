// Explainable, rules-based "estimated preference match". Not a scientifically validated measure.
// Each part awards points only from data both people provided; missing data is excluded and the rest rescaled.

export type CompatSubject = {
  experiences: string[];
  values: string[];
  interests: string[];
  smoking?: string;
  drinking?: string;
  fitness?: string;
  social?: string;
  communication: string[];
};

export type CompatPart = { label: string; points: number; max: number; detail: string };
export type CompatResult = {
  score: number | null; // 0-100 estimate, or null when there is not enough shared data
  parts: CompatPart[];
  sharedIntention: boolean;
  summary: string;
  disclaimer: string;
};

export const COMPAT_DISCLAIMER =
  'Estimated preference match: a simple count of what you both chose in common. It is not a prediction of chemistry or relationship success.';

const WEIGHTS = { intention: 30, values: 25, interests: 20, lifestyle: 15, communication: 10 } as const;

const overlap = (a: string[], b: string[]) => {
  const set = new Set(b.map((x) => x.toLowerCase()));
  return a.filter((x) => set.has(x.toLowerCase()));
};

export function computeCompatibility(me: CompatSubject, other: CompatSubject, experience: string): CompatResult {
  const parts: CompatPart[] = [];

  // Intention: both must have chosen this experience. Never implies consent to anything.
  const sharedIntention = me.experiences.includes(experience) && other.experiences.includes(experience);
  if (me.experiences.length && other.experiences.length) {
    parts.push({
      label: 'Shared intention',
      max: WEIGHTS.intention,
      points: sharedIntention ? WEIGHTS.intention : 0,
      detail: sharedIntention ? 'You both chose this experience.' : 'This experience is not selected by both of you.',
    });
  }

  const ratio = (a: string[], b: string[]) => overlap(a, b).length / Math.max(1, Math.min(a.length, b.length, 4));

  if (me.values.length && other.values.length) {
    const s = overlap(me.values, other.values);
    parts.push({ label: 'Values', max: WEIGHTS.values, points: Math.min(1, ratio(me.values, other.values)) * WEIGHTS.values, detail: s.length ? `Shared: ${s.join(', ')}` : 'No shared values chosen.' });
  }
  if (me.interests.length && other.interests.length) {
    const s = overlap(me.interests, other.interests);
    parts.push({ label: 'Interests', max: WEIGHTS.interests, points: Math.min(1, ratio(me.interests, other.interests)) * WEIGHTS.interests, detail: s.length ? `Shared: ${s.join(', ')}` : 'No shared interests chosen.' });
  }

  const keys = ['smoking', 'drinking', 'fitness', 'social'] as const;
  const both = keys.filter((k) => me[k] && other[k]);
  if (both.length) {
    const same = both.filter((k) => me[k] === other[k]);
    parts.push({ label: 'Lifestyle', max: WEIGHTS.lifestyle, points: (same.length / both.length) * WEIGHTS.lifestyle, detail: `${same.length} of ${both.length} lifestyle answers match.` });
  }
  if (me.communication.length && other.communication.length) {
    const s = overlap(me.communication, other.communication);
    parts.push({ label: 'Communication', max: WEIGHTS.communication, points: s.length ? WEIGHTS.communication : 0, detail: s.length ? `Shared: ${s.join(', ')}` : 'Different communication styles.' });
  }

  const max = parts.reduce((t, p) => t + p.max, 0);
  const got = parts.reduce((t, p) => t + p.points, 0);
  const score = max === 0 ? null : Math.round((got / max) * 100);

  const top = [...parts].sort((a, b) => b.points / b.max - a.points / a.max)[0];
  const summary = score === null ? 'Not enough shared information yet to estimate.' : top && top.points > 0 ? `Strongest overlap: ${top.label.toLowerCase()}. ${top.detail}` : 'Little overlap so far, but conversation reveals more.';

  return { score, parts, sharedIntention, summary, disclaimer: COMPAT_DISCLAIMER };
}
