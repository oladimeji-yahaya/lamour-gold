import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthBackdrop } from '@/components/ui/AuthBackdrop';
import { AppText } from '@/components/ui/AppText';
import { GoldButton } from '@/components/ui/GoldButton';
import { colors } from '@/theme/tokens';
import { IS_DEMO_MODE } from '@/lib/env';

export default function Welcome() {
  const router = useRouter();
  return (
    <AuthBackdrop scroll={false} footer={
      <>
        <GoldButton title="Create Account" onPress={() => router.push('/onboarding/account')} />
        <GoldButton title="Sign In" variant="outline" onPress={() => router.push('/login')} />
        <AppText variant="caption" style={{ textAlign: 'center', fontSize: 11, marginTop: 8 }}>18+ only · Terms · Privacy</AppText>
      </>
    }>
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 28 }}>
        <AppText style={{ color: colors.goldLight, fontSize: 54, lineHeight: 66 }}>♡</AppText>
        <AppText variant="display" style={{ color: colors.goldLight, textAlign: 'center', fontSize: 37, lineHeight: 44 }}>L’AMOUR{'\n'}GOLD</AppText>
        <AppText variant="caption" style={{ color: colors.goldLight, letterSpacing: 3, fontSize: 10, marginTop: 10 }}>DATING, REIMAGINED</AppText>
        <AppText variant="body" style={{ textAlign: 'center', color: colors.champagne, marginTop: 22, maxWidth: 280 }}>A premium dating experience with purpose, choice, and real connection.</AppText>
        {IS_DEMO_MODE ? <AppText variant="caption" style={{ textAlign: 'center', marginTop: 14 }}>Demo mode · Profiles are simulated</AppText> : null}
      </View>
    </AuthBackdrop>
  );
}
