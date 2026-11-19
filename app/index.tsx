import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme/tokens';
import { AppText } from '@/components/ui/AppText';

export default function Splash() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const o = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (!reduce) o.value = withTiming(1, { duration: 1100 });
    const t = setTimeout(() => router.replace('/welcome'), reduce ? 600 : 1800);
    return () => clearTimeout(t);
  }, [reduce, o, router]);
  const style = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ scale: 0.94 + 0.06 * o.value }] }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[{ alignItems: 'center', gap: 10 }, style]}>
        <AppText variant="display" style={{ color: colors.gold, textAlign: 'center' }}>
          L’AMOUR{'\n'}GOLD
        </AppText>
        <AppText variant="caption" style={{ letterSpacing: 4 }}>
          DATING, REIMAGINED.
        </AppText>
      </Animated.View>
    </View>
  );
}
