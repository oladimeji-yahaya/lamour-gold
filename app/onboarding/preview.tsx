import React from 'react';
import { Image, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { StepHeader } from '@/components/ui/StepHeader';
import { GoldButton } from '@/components/ui/GoldButton';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { colors, radius } from '@/theme/tokens';
import { useOnboarding } from '@/store/onboardingStore';
import { EXPERIENCES } from '@/constants/options';
import { calculateAge, parseDob } from '@/lib/validation';

export default function Preview() {
  const router = useRouter();
  const { data, publish } = useOnboarding();
  const dob = parseDob(data.dob);
  const age = dob ? calculateAge(dob) : null;
  const interests = [...data.hobbies, ...data.music, ...data.travel].slice(0, 8);

  return (
    <Screen
      footer={
        <>
          <GoldButton
            title="Publish profile"
            onPress={() => {
              publish();
              router.replace('/home');
            }}
          />
          <GoldButton title="Edit details" variant="outline" onPress={() => router.push('/onboarding/basic')} />
        </>
      }
    >
      <StepHeader step={9} total={9} title="Your profile preview" subtitle="This is how others will see you. Last name and birth date are never shown." />
      <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: '#A88650', overflow: 'hidden', backgroundColor: colors.card }}>
        {data.photos[0] ? <Image source={{ uri: data.photos[0].uri }} style={{ width: '100%', aspectRatio: 3 / 4 }} /> : null}
        <View style={{ padding: 16, gap: 8 }}>
          <AppText variant="title">{data.firstName}{age !== null ? `, ${age}` : ''}</AppText>
          <AppText variant="caption">{[data.profession, data.city].filter(Boolean).join(' · ')}</AppText>
          <AppText variant="label">{EXPERIENCES.filter((e) => data.experiences.includes(e.key)).map((e) => e.name).join(' · ')}</AppText>
          <AppText>{data.bio}</AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {interests.map((i) => <Chip key={i} label={i} selected={false} onPress={() => {}} />)}
          </View>
          {data.prompts.filter((p) => p.answer).map((p) => (
            <View key={p.question} style={{ gap: 2 }}>
              <AppText variant="label">{p.question}</AppText>
              <AppText>{p.answer}</AppText>
            </View>
          ))}
        </View>
      </View>
      <AppText variant="caption">Publishing here saves to this device only. Saving to a real database arrives with Phase 6.</AppText>
    </Screen>
  );
}
