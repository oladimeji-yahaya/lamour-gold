import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { StepHeader } from '@/components/ui/StepHeader';
import { GoldButton } from '@/components/ui/GoldButton';
import { AppText } from '@/components/ui/AppText';
import { colors, radius } from '@/theme/tokens';
import { useOnboarding } from '@/store/onboardingStore';

function Row({ title, status, body }: { title: string; status: string; body: string }) {
  return (
    <View style={{ padding: 16, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText variant="title" style={{ fontSize: 18 }}>{title}</AppText>
        <AppText variant="label">{status}</AppText>
      </View>
      <AppText variant="caption">{body}</AppText>
    </View>
  );
}

export default function Verification() {
  const router = useRouter();
  const { completeStep } = useOnboarding();
  return (
    <Screen
      footer={
        <GoldButton
          title="Continue"
          onPress={() => {
            completeStep(8);
            router.push('/onboarding/preview');
          }}
        />
      }
    >
      <StepHeader step={8} total={9} title="Build trust" subtitle="Verification is optional and can be done later." />
      <Row title="Email" status="Pending" body="Confirm the link we send to your email. Real status appears once Supabase is connected." />
      <Row title="Selfie check" status="Not available yet" body="Needs a liveness provider. Nothing is marked verified until a provider has actually checked it." />
      <Row title="ID check" status="Not available yet" body="Needs an identity-verification provider integration. Not active in this build." />
      <AppText variant="caption">
        Your profile will show only the verification badges you have really earned. No badge is shown in this build.
      </AppText>
    </Screen>
  );
}
