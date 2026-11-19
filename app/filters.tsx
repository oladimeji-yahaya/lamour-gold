import React from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { GoldButton } from '@/components/ui/GoldButton';
import { Chip, ChipGroup } from '@/components/ui/Chip';
import { DEFAULT_FILTERS, useApp } from '@/store/appStore';

const AGE_MIN = [21, 25, 30, 35] as const;
const AGE_MAX = [30, 35, 40, 45, 60] as const;
const DISTANCE = [5, 10, 20, 50] as const;
const INTERESTS = ['Art', 'Travel', 'Cooking', 'Jazz', 'Live music', 'Fitness', 'Reading', 'Photography'] as const;

export default function Filters() {
  const router = useRouter();
  const { filters, setFilters } = useApp();
  return (
    <Screen footer={<><GoldButton title="Done" onPress={() => router.back()} /><GoldButton title="Reset" variant="outline" onPress={() => setFilters(DEFAULT_FILTERS)} /></>}>
      <AppText variant="title">Filters</AppText>
      <AppText variant="label">Minimum age</AppText>
      <ChipGroup options={AGE_MIN.map(String) as unknown as readonly string[]} value={String(filters.ageMin)} onChange={(v) => v && setFilters({ ageMin: Number(v) })} />
      <AppText variant="label">Maximum age</AppText>
      <ChipGroup options={AGE_MAX.map(String) as unknown as readonly string[]} value={String(filters.ageMax)} onChange={(v) => v && setFilters({ ageMax: Number(v) })} />
      <AppText variant="label">Distance (km, approximate)</AppText>
      <ChipGroup options={DISTANCE.map(String) as unknown as readonly string[]} value={String(filters.maxDistanceKm)} onChange={(v) => v && setFilters({ maxDistanceKm: Number(v) })} />
      <AppText variant="label">Interest</AppText>
      <ChipGroup options={INTERESTS} value={filters.interest ?? undefined} onChange={(v) => setFilters({ interest: v ?? null })} />
      <AppText variant="label">Verification</AppText>
      <Chip label="Verified only" selected={filters.verifiedOnly} onPress={() => setFilters({ verifiedOnly: !filters.verifiedOnly })} />
      <AppText variant="caption">Nobody is verified in this build, so turning this on shows no one.</AppText>
      <AppText variant="caption">Gender preference is taken from “I’d like to meet” in your onboarding answers. Lifestyle-compatibility filtering is not built yet.</AppText>
    </Screen>
  );
}
