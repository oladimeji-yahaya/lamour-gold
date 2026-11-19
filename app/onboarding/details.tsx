import React from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { StepHeader } from '@/components/ui/StepHeader';
import { TextField } from '@/components/ui/TextField';
import { GoldButton } from '@/components/ui/GoldButton';
import { AppText } from '@/components/ui/AppText';
import { ChipGroup } from '@/components/ui/Chip';
import { BODY_TYPES, EDUCATION, HAS_CHILDREN, RELATIONSHIP_STATUS, RELIGION, WANTS_CHILDREN } from '@/constants/options';
import { useOnboarding } from '@/store/onboardingStore';

export default function Details() {
  const router = useRouter();
  const { data, update, completeStep } = useOnboarding();
  const go = () => {
    completeStep(3);
    router.push('/onboarding/lifestyle');
  };
  return (
    <Screen
      footer={
        <>
          <GoldButton title="Continue" onPress={go} />
          <GoldButton title="Skip for now" variant="ghost" onPress={go} />
        </>
      }
    >
      <StepHeader step={3} total={9} title="More about you" subtitle="Everything here is optional. Share only what you’re comfortable with." />
      <TextField
        label="Height (cm)"
        value={data.heightCm ? String(data.heightCm) : ''}
        keyboardType="number-pad"
        onChangeText={(v) => {
          const n = parseInt(v.replace(/\D/g, ''), 10);
          update({ heightCm: Number.isFinite(n) ? Math.min(n, 250) : undefined });
        }}
      />
      <AppText variant="label">Body type</AppText>
      <ChipGroup options={BODY_TYPES} value={data.bodyType} onChange={(v) => update({ bodyType: v })} />
      <AppText variant="label">Education</AppText>
      <ChipGroup options={EDUCATION} value={data.education} onChange={(v) => update({ education: v })} />
      <TextField label="Profession" value={data.profession ?? ''} onChangeText={(v) => update({ profession: v })} />
      <TextField label="Industry" value={data.industry ?? ''} onChangeText={(v) => update({ industry: v })} />
      <TextField label="Languages spoken" value={data.languages} onChangeText={(v) => update({ languages: v })} hint="Comma separated" />
      <AppText variant="label">Religious preference</AppText>
      <ChipGroup options={RELIGION} value={data.religion} onChange={(v) => update({ religion: v })} />
      <AppText variant="label">Relationship status</AppText>
      <ChipGroup options={RELATIONSHIP_STATUS} value={data.relationshipStatus} onChange={(v) => update({ relationshipStatus: v })} />
      <AppText variant="label">Children</AppText>
      <ChipGroup options={HAS_CHILDREN} value={data.hasChildren} onChange={(v) => update({ hasChildren: v })} />
      <ChipGroup options={WANTS_CHILDREN} value={data.wantsChildren} onChange={(v) => update({ wantsChildren: v })} />
    </Screen>
  );
}
