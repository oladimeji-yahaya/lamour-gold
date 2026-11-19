import React from 'react';
import { Pressable, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, MIN_TOUCH, radius } from '@/theme/tokens';
import { AppText } from './AppText';

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={{
        minHeight: 40,
        paddingHorizontal: 16,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: selected ? colors.gold : colors.border,
        backgroundColor: selected ? 'rgba(212,175,55,0.16)' : colors.card,
        justifyContent: 'center',
      }}
    >
      <AppText style={{ color: selected ? colors.goldLight : colors.textMuted, fontSize: 14 }}>{label}</AppText>
    </Pressable>
  );
}

/** Single- or multi-select group of chips. */
export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  multiple = false,
}: {
  options: readonly T[];
  value: T[] | T | undefined;
  onChange: (next: any) => void;
  multiple?: boolean;
}) {
  const isSel = (o: T) => (Array.isArray(value) ? value.includes(o) : value === o);
  const toggle = (o: T) => {
    if (multiple) {
      const arr = (Array.isArray(value) ? value : []) as T[];
      onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o]);
    } else {
      onChange(value === o ? undefined : o);
    }
  };
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => (
        <Chip key={o} label={o} selected={isSel(o)} onPress={() => toggle(o)} />
      ))}
    </View>
  );
}
