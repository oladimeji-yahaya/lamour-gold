import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from './ui/AppText';
import { colors, radius } from '@/theme/tokens';
import { EXPERIENCES, ExperienceKey } from '@/constants/options';

const SHORT: Record<ExperienceKey, string> = { love: 'Love', spark: 'Spark', evening: 'Evening' };

export function ExperienceTabs({ value, onChange }: { value: ExperienceKey; onChange: (k: ExperienceKey) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, width: '100%' }} accessibilityRole="tablist">
      {EXPERIENCES.map((e) => {
        const on = e.key === value;
        return (
          <Pressable
            key={e.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(e.key)}
            style={{
              minHeight: 44,
              flex: 1,
              paddingHorizontal: 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius.pill,
              borderWidth: 1,
              borderColor: on ? '#C9A364' : colors.border,
              backgroundColor: on ? colors.gold : colors.card,
            }}
          >
            <AppText style={{ color: on ? '#080808' : colors.textMuted, fontFamily: 'Inter_600SemiBold' }}>{SHORT[e.key]}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
