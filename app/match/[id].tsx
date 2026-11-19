import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { GoldButton } from '@/components/ui/GoldButton';
import { Avatar } from '@/components/Avatar';
import { getProfile } from '@/data/demoProfiles';
import { useOnboarding } from '@/store/onboardingStore';
import { useApp } from '@/store/appStore';
import { colors } from '@/theme/tokens';

export default function Match() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const p = getProfile(id);
  const first = useOnboarding((s) => s.data.firstName);
  const isMatch = useApp((s) => s.matches.some((m) => m.profileId === id));
  const reduce = useReducedMotion();
  const scale = useSharedValue(reduce ? 1 : 0.4);

  useEffect(() => {
    if (reduce) return;
    scale.value = withSequence(withSpring(1.1), withRepeat(withSequence(withTiming(1.04, { duration: 900 }), withTiming(1, { duration: 900 })), -1));
  }, [reduce, scale]);
  const heart = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (!p || !isMatch) return <Screen><AppText>No match found.</AppText></Screen>;

  return (
    <Screen
      scroll={false}
      footer={
        <>
          <GoldButton title="Send a Message" onPress={() => router.replace({ pathname: '/chat/[id]', params: { id } })} />
          <GoldButton title="View Profile" variant="outline" onPress={() => router.replace({ pathname: '/member/[id]', params: { id } })} />
          <GoldButton title="Keep Discovering" variant="ghost" onPress={() => router.back()} />
        </>
      }
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <Animated.View style={[{ flexDirection: 'row', gap: 12, alignItems: 'center' }, heart]}>
          <Avatar name={first || 'You'} size={96} />
          <Avatar name={p.firstName} size={96} />
        </Animated.View>
        <AppText variant="display" style={{ color: colors.gold, textAlign: 'center' }}>It’s a Match!</AppText>
        <AppText variant="caption" style={{ textAlign: 'center' }}>You and {p.firstName} both chose to connect. (Demo: this match is simulated.)</AppText>
      </View>
    </Screen>
  );
}
