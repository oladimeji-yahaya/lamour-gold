import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { GoldButton } from '@/components/ui/GoldButton';
import { Avatar } from '@/components/Avatar';
import { getProfile } from '@/data/demoProfiles';
import { EXPERIENCES } from '@/constants/options';
import { colors, radius } from '@/theme/tokens';

// Optional, personality-first reveal. Age, intentions and verification status are always visible.
export default function Mystery() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const p = getProfile(id);
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const veil = useSharedValue(1);

  const total = p ? p.prompts.length : 0;
  useEffect(() => {
    const target = total === 0 ? 0 : 1 - step / total;
    veil.value = reduce ? target : withTiming(target, { duration: 700 });
  }, [step, total, reduce, veil]);
  const veilStyle = useAnimatedStyle(() => ({ opacity: veil.value }));

  if (!p) return <Screen><AppText>Not available.</AppText></Screen>;
  const shown = p.prompts.slice(0, step);
  const next = p.prompts[step];

  return (
    <Screen footer={<GoldButton title="Exit Mystery Reveal" variant="outline" onPress={() => router.back()} />}>
      <AppText variant="title">Mystery Reveal</AppText>
      <AppText variant="caption">Get to know {p.firstName} before seeing more. Optional: you can leave anytime.</AppText>
      <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: '#A88650', backgroundColor: colors.card, padding: 16, gap: 6 }}>
        <AppText variant="title">{p.firstName}, {p.age}</AppText>
        <AppText variant="label">{EXPERIENCES.filter((e) => p.experiences.includes(e.key)).map((e) => e.name).join(' · ')}</AppText>
        <AppText variant="caption">Verification: not verified (demo)</AppText>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 180 }}>
        <Avatar name={p.firstName} size={130} />
        <Animated.View pointerEvents="none" style={[{ position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: colors.bg }, veilStyle]} />
      </View>
      <AppText variant="caption">Extra photos are revealed here once real photos exist. Demo profiles have none.</AppText>
      {shown.map((q) => (
        <View key={q.question} style={{ gap: 2 }}>
          <AppText variant="label">{q.question}</AppText>
          <AppText>{q.answer}</AppText>
        </View>
      ))}
      {next ? (
        <View style={{ gap: 8 }}>
          <AppText variant="title" style={{ fontSize: 18 }}>{next.question}</AppText>
          <GoldButton title="Reveal their answer" onPress={() => setStep(step + 1)} />
        </View>
      ) : <AppText variant="caption">That’s everything {p.firstName} has shared.</AppText>}
      <AppText variant="caption">Voice introductions and icebreaker answers from you are not built yet.</AppText>
    </Screen>
  );
}
