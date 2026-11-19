import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { colors, fonts, MIN_TOUCH, radius } from '@/theme/tokens';
import { AppText } from './AppText';

type Props = TextInputProps & { label: string; error?: string; hint?: string };

export function TextField({ label, error, hint, style, ...rest }: Props) {
  return (
    <View style={{ gap: 6 }}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#7A7A7A"
        {...rest}
        style={[
          {
            minHeight: MIN_TOUCH,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: error ? colors.error : colors.border,
            backgroundColor: 'rgba(20, 18, 16, 0.92)',
            color: colors.text,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontFamily: fonts.body,
            fontSize: 16,
          },
          style,
        ]}
      />
      {error ? (
        <AppText variant="caption" style={{ color: colors.error }}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption">{hint}</AppText>
      ) : null}
    </View>
  );
}
