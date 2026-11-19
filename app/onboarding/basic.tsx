import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { StepHeader } from '@/components/ui/StepHeader';
import { TextField } from '@/components/ui/TextField';
import { GoldButton } from '@/components/ui/GoldButton';
import { AppText } from '@/components/ui/AppText';
import { ChipGroup } from '@/components/ui/Chip';
import { GENDERS, MEET } from '@/constants/options';
import { basicInfoSchema, calculateAge, MIN_AGE_AUDIENCE, parseDob } from '@/lib/validation';
import { useOnboarding } from '@/store/onboardingStore';

export default function Basic() {
  const router = useRouter();
  const { data, update, completeStep } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dob = parseDob(data.dob);
  const age = dob ? calculateAge(dob) : null;

  const next = () => {
    const parsed = basicInfoSchema.safeParse(data);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (e[String(i.path[0])] ??= i.message));
      return setErrors(e);
    }
    setErrors({});
    completeStep(2);
    router.push('/onboarding/details');
  };

  return (
    <Screen footer={<GoldButton title="Continue" onPress={next} />}>
      <StepHeader step={2} total={9} title="Tell us about you" subtitle="Last name and date of birth stay private." />
      <TextField label="First name" value={data.firstName} onChangeText={(v) => update({ firstName: v })} error={errors.firstName} />
      <TextField label="Last name (private)" value={data.lastName} onChangeText={(v) => update({ lastName: v })} error={errors.lastName} />
      <TextField
        label="Date of birth (YYYY-MM-DD)"
        value={data.dob}
        onChangeText={(v) => update({ dob: v })}
        keyboardType="numbers-and-punctuation"
        error={errors.dob}
        hint={age !== null && age >= 18 ? (age < MIN_AGE_AUDIENCE ? `Age ${age}. L’AMOUR GOLD is designed for members 21 and over.` : `Age ${age}. Only your age is shown, never your birth date.`) : undefined}
      />
      <AppText variant="label">I identify as</AppText>
      <ChipGroup options={GENDERS} value={data.gender} onChange={(v) => update({ gender: v ?? '' })} />
      {errors.gender ? <AppText variant="caption" style={{ color: '#D75C5C' }}>{errors.gender}</AppText> : null}
      <AppText variant="label">I’d like to meet</AppText>
      <ChipGroup options={MEET} value={data.meet} multiple onChange={(v) => update({ meet: v })} />
      {errors.meet ? <AppText variant="caption" style={{ color: '#D75C5C' }}>{errors.meet}</AppText> : null}
      <TextField label="City" value={data.city} onChangeText={(v) => update({ city: v })} error={errors.city} />
      <TextField label="Country" value={data.country} onChangeText={(v) => update({ country: v })} error={errors.country} />
    </Screen>
  );
}
