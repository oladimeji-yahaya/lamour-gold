import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from './ui/AppText';
import { colors } from '@/theme/tokens';

// Demo profiles have no photos (they are fictional), so a gold-toned initial stands in.
export function Avatar({ name, size = 56, style }: { name: string; size?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', borderWidth: 1, borderColor: '#A88650' }, style]}>
      <LinearGradient colors={['#2A2314', '#14110A']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <AppText variant="title" style={{ color: colors.goldLight, fontSize: size * 0.42, lineHeight: size * 0.55 }}>
          {name.charAt(0).toUpperCase()}
        </AppText>
      </LinearGradient>
    </View>
  );
}
