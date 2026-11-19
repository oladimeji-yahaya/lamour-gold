import type { CompatSubject } from './compatibility';
import type { OnboardingData } from '@/store/onboardingStore';
import { useOnboarding } from '@/store/onboardingStore';
import { calculateAge, parseDob } from './validation';

export function toSubject(d: OnboardingData): CompatSubject {
  return {
    experiences: d.experiences,
    values: [...d.values, ...d.relationshipValues],
    interests: [...d.hobbies, ...d.music, ...d.travel, ...d.food, ...d.weekend],
    smoking: d.smoking,
    drinking: d.drinking,
    fitness: d.fitness,
    social: d.social,
    communication: d.communication,
  };
}

export function useMeSubject(): CompatSubject {
  const data = useOnboarding((s) => s.data);
  return toSubject(data);
}

export function profileCompletion(d: OnboardingData): number {
  const checks = [
    !!d.firstName, !!d.dob, !!d.gender, d.meet.length > 0, !!d.city,
    d.photos.length >= 2, d.bio.length >= 20, d.prompts.filter((p) => p.answer).length >= 3,
    d.experiences.length > 0, d.values.length > 0, d.hobbies.length > 0 || d.music.length > 0,
    !!d.smoking || !!d.drinking, !!d.profession, !!d.education,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function myAge(d: OnboardingData): number | null {
  const dob = parseDob(d.dob);
  return dob ? calculateAge(dob) : null;
}
