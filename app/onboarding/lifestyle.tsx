import React from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { StepHeader } from '@/components/ui/StepHeader';
import { GoldButton } from '@/components/ui/GoldButton';
import { AppText } from '@/components/ui/AppText';
import { ChipGroup } from '@/components/ui/Chip';
import { DRINKING, FITNESS, FOOD, HOBBIES, MUSIC, SMOKING, SOCIAL, TRAVEL, VALUES, WEEKEND } from '@/constants/options';
import { useOnboarding } from '@/store/onboardingStore';

export default function Lifestyle() {
  const router = useRouter();
  const { data, update, completeStep } = useOnboarding();
  const go = () => {
    completeStep(4);
    router.push('/onboarding/bio');
  };
  return (
    <Screen footer={<GoldButton title="Continue" onPress={go} />}>
      <StepHeader step={4} total={9} title="Your lifestyle" subtitle="Helps us explain why you and someone else may fit." />
      <AppText variant="label">Smoking</AppText>
      <ChipGroup options={SMOKING} value={data.smoking} onChange={(v) => update({ smoking: v })} />
      <AppText variant="label">Drinking</AppText>
      <ChipGroup options={DRINKING} value={data.drinking} onChange={(v) => update({ drinking: v })} />
      <AppText variant="label">Fitness</AppText>
      <ChipGroup options={FITNESS} value={data.fitness} onChange={(v) => update({ fitness: v })} />
      <AppText variant="label">Social lifestyle</AppText>
      <ChipGroup options={SOCIAL} value={data.social} onChange={(v) => update({ social: v })} />
      <AppText variant="label">Travel</AppText>
      <ChipGroup options={TRAVEL} value={data.travel} multiple onChange={(v) => update({ travel: v })} />
      <AppText variant="label">Food</AppText>
      <ChipGroup options={FOOD} value={data.food} multiple onChange={(v) => update({ food: v })} />
      <AppText variant="label">Hobbies</AppText>
      <ChipGroup options={HOBBIES} value={data.hobbies} multiple onChange={(v) => update({ hobbies: v })} />
      <AppText variant="label">Music</AppText>
      <ChipGroup options={MUSIC} value={data.music} multiple onChange={(v) => update({ music: v })} />
      <AppText variant="label">Weekends</AppText>
      <ChipGroup options={WEEKEND} value={data.weekend} multiple onChange={(v) => update({ weekend: v })} />
      <AppText variant="label">Personal values</AppText>
      <ChipGroup options={VALUES} value={data.values} multiple onChange={(v) => update({ values: v })} />
    </Screen>
  );
}
