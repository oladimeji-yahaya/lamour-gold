import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, fonts, goldGradient, MIN_TOUCH, radius } from '@/theme/tokens';
import { AppText } from './AppText';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function GoldButton({ title, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const inactive = disabled || loading;
  const primary = variant === 'primary';

  const label = loading ? (
    <ActivityIndicator color={primary ? '#080808' : colors.gold} />
  ) : (
    <AppText style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: primary ? '#080808' : colors.goldLight }}>
      {title}
    </AppText>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      disabled={inactive}
      style={({ pressed }) => [{ opacity: inactive ? 0.5 : pressed ? 0.85 : 1 }, style]}
    >
      {primary ? (
        <LinearGradient colors={goldGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.base}>
          {label}
        </LinearGradient>
      ) : (
        <View style={[styles.base, variant === 'outline' && { borderWidth: 1, borderColor: colors.border }]}>{label}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
