import { useMemo } from 'react';
import { DEMO_PROFILES } from '@/data/demoProfiles';
import type { DemoProfile } from '@/data/types';
import { computeCompatibility, CompatResult } from '@/lib/compatibility';
import { useMeSubject } from '@/lib/me';
import { useApp } from '@/store/appStore';
import { useOnboarding } from '@/store/onboardingStore';

const MEET_TO_GENDER: Record<string, DemoProfile['gender']> = { Women: 'Woman', Men: 'Man', 'Non-binary people': 'Non-binary' };

export type Candidate = { profile: DemoProfile; compat: CompatResult };

export function useDiscovery(): Candidate[] {
  const { experience, filters, passed, liked, blocked } = useApp();
  const meet = useOnboarding((s) => s.data.meet);
  const me = useMeSubject();

  return useMemo(() => {
    const everyone = meet.length === 0 || meet.includes('Everyone');
    const allowed = new Set(meet.map((m) => MEET_TO_GENDER[m]).filter(Boolean));
    return DEMO_PROFILES.filter((p) => {
      if (blocked.includes(p.id) || passed.includes(p.id) || liked.includes(p.id)) return false;
      if (!p.experiences.includes(experience)) return false;
      if (!everyone && !allowed.has(p.gender)) return false;
      if (p.age < filters.ageMin || p.age > filters.ageMax) return false;
      if (p.distanceKm > filters.maxDistanceKm) return false;
      if (filters.interest && !p.interests.some((i) => i.toLowerCase() === filters.interest!.toLowerCase())) return false;
      if (filters.verifiedOnly) return false; // nobody is verified in this build, so none qualify
      return true;
    })
      .map((profile) => ({
        profile,
        compat: computeCompatibility(me, { experiences: profile.experiences, values: profile.values, interests: profile.interests, ...profile.lifestyle, communication: profile.communication }, experience),
      }))
      .sort((a, b) => (b.compat.score ?? -1) - (a.compat.score ?? -1));
  }, [experience, filters, passed, liked, blocked, meet, me]);
}
