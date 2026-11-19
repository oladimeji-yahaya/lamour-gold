import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

type Variant = 'display' | 'title' | 'body' | 'caption' | 'label';

const variants: Record<Variant, TextStyle> = {
  display: { fontFamily: fonts.headingBold, fontSize: 32, lineHeight: 41, color: colors.champagne },
  title: { fontFamily: fonts.heading, fontSize: 23, lineHeight: 31, color: colors.champagne },
  body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, color: colors.text },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.textMuted },
  label: { fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 18, color: colors.goldLight },
};

export function AppText({ variant = 'body', style, ...rest }: TextProps & { variant?: Variant }) {
  return <Text {...rest} style={[variants[variant], style]} />;
}
