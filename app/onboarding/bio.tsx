import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { StepHeader } from '@/components/ui/StepHeader';
import { TextField } from '@/components/ui/TextField';
import { GoldButton } from '@/components/ui/GoldButton';
import { AppText } from '@/components/ui/AppText';
import { ChipGroup } from '@/components/ui/Chip';
import { COMMUNICATION, RELATIONSHIP_VALUES } from '@/constants/options';
import { bioSchema } from '@/lib/validation';
import { useOnboarding } from '@/store/onboardingStore';

export default function Bio() {
  const router = useRouter();
  const { data, update, completeStep } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setAnswer = (i: number, answer: string) =>
    update({ prompts: data.prompts.map((p, idx) => (idx === i ? { ...p, answer } : p)) });

  const next = () => {
    const parsed = bioSchema.safeParse({ bio: data.bio, prompts: data.prompts });
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (e[String(i.path[0])] ??= i.message));
      return setErrors(e);
    }
    setErrors({});
    completeStep(5);
    router.push('/onboarding/intentions');
  };

  return (
    <Screen footer={<GoldButton title="Continue" onPress={next} />}>
      <StepHeader step={5} total={9} title="Your story" subtitle="Write like you’re talking to someone you’d like to meet." />
      <TextField label="Short bio" value={data.bio} onChangeText={(v) => update({ bio: v })} multiline style={{ minHeight: 110, textAlignVertical: 'top' }} error={errors.bio} hint={`${data.bio.length}/500`} maxLength={500} />
      {data.prompts.map((p, i) => (
        <TextField key={p.question} label={p.question} value={p.answer} onChangeText={(v) => setAnswer(i, v)} maxLength={200} multiline />
      ))}
      {errors.prompts ? <AppText variant="caption" style={{ color: '#D75C5C' }}>{errors.prompts}</AppText> : null}
      <TextField label="What makes you unique (optional)" value={data.unique} onChangeText={(v) => update({ unique: v })} multiline />
      <TextField label="Your ideal date (optional)" value={data.idealDate} onChangeText={(v) => update({ idealDate: v })} multiline />
      <AppText variant="label">Communication style</AppText>
      <ChipGroup options={COMMUNICATION} value={data.communication} multiple onChange={(v) => update({ communication: v })} />
      <AppText variant="label">Important in a relationship</AppText>
      <ChipGroup options={RELATIONSHIP_VALUES} value={data.relationshipValues} multiple onChange={(v) => update({ relationshipValues: v })} />
      <AppText variant="caption">Voice introduction: not built yet (planned; needs audio recording and storage).</AppText>
    </Screen>
  );
}
