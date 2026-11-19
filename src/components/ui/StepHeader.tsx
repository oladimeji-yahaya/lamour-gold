import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '@/theme/tokens';
import { AppText } from './AppText';

export function StepHeader({
  step,
  total,
  title,
  subtitle,
}: {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const progress = useSharedValue(0);
  useEffect(() => {
    const target = step / total;
    progress.value = reduce ? target : withTiming(target, { duration: 400 });
  }, [step, total, reduce, progress]);
  const barStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={12}
          onPress={() => router.back()}
          style={{ width: 44, height: 44, justifyContent: 'center' }}
        >
          <ChevronLeft color={colors.gold} size={24} />
        </Pressable>
        <View style={{ flex: 1, height: 4, backgroundColor: colors.border, borderRadius: 2 }}>
          <Animated.View style={[{ height: 4, borderRadius: 2, backgroundColor: colors.gold }, barStyle]} />
        </View>
        <AppText variant="caption">
          {step}/{total}
        </AppText>
      </View>
      <AppText variant="title">{title}</AppText>
      {subtitle ? <AppText variant="caption">{subtitle}</AppText> : null}
    </View>
  );
}
