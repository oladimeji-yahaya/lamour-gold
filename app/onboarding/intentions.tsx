import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Screen } from '@/components/ui/Screen';
import { StepHeader } from '@/components/ui/StepHeader';
import { GoldButton } from '@/components/ui/GoldButton';
import { AppText } from '@/components/ui/AppText';
import { EXPERIENCES, ExperienceKey } from '@/constants/options';
import { colors, radius } from '@/theme/tokens';
import { useOnboarding } from '@/store/onboardingStore';

export default function Intentions() {
  const router = useRouter();
  const { data, update, completeStep } = useOnboarding();
  const [error, setError] = useState('');

  const toggle = (k: ExperienceKey) => {
    Haptics.selectionAsync().catch(() => {});
    const has = data.experiences.includes(k);
    update({ experiences: has ? data.experiences.filter((x) => x !== k) : [...data.experiences, k] });
  };

  const next = () => {
    if (data.experiences.length === 0) return setError('Choose at least one experience.');
    setError('');
    completeStep(6);
    router.push('/onboarding/photos');
  };

  return (
    <Screen footer={<GoldButton title="Continue" onPress={next} />}>
      <StepHeader step={6} total={9} title="What brings you here?" subtitle="Choose one or more. Your choices are visible to people you may match with, and you can change them anytime." />
      {EXPERIENCES.map((e) => {
        const on = data.experiences.includes(e.key);
        return (
          <Pressable
            key={e.key}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            onPress={() => toggle(e.key)}
            style={{
              padding: 16,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: on ? colors.gold : colors.border,
              backgroundColor: on ? 'rgba(212,175,55,0.12)' : colors.card,
              gap: 6,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppText variant="title" style={{ fontSize: 20 }}>{e.name}</AppText>
              <AppText variant="label">{on ? 'Selected' : ''}</AppText>
            </View>
            <AppText variant="caption">{e.blurb}</AppText>
          </Pressable>
        );
      })}
      {error ? <AppText style={{ color: colors.error }}>{error}</AppText> : null}
      <AppText variant="caption">
        Section-specific bios and visibility settings are planned for a later phase; they are not editable yet.
      </AppText>
    </Screen>
  );
}
