import React from 'react';
import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from './ui/AppText';
import { Chip } from './ui/Chip';
import { GoldButton } from './ui/GoldButton';
import { Avatar } from './Avatar';
import { colors, radius } from '@/theme/tokens';
import { EXPERIENCES, ExperienceKey } from '@/constants/options';
import type { DemoProfile } from '@/data/types';
import type { CompatResult } from '@/lib/compatibility';

type Props = {
  profile: DemoProfile;
  compat: CompatResult;
  experience: ExperienceKey;
  saved: boolean;
  onOpen: () => void;
  onLike: () => void;
  onPass: () => void;
  onSave: () => void;
  onMystery: () => void;
};

export function ProfileCard({ profile: p, compat, experience, saved, onOpen, onLike, onPass, onSave, onMystery }: Props) {
  const intentions = EXPERIENCES.filter((e) => p.experiences.includes(e.key)).map((e) => e.name).join(' · ');
  return (
    <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: '#A88650', backgroundColor: colors.card, overflow: 'hidden' }}>
      <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel={`View ${p.firstName}'s profile`}>
        <LinearGradient colors={['#2A2314', '#0E0C08']} style={{ height: 220, alignItems: 'center', justifyContent: 'center' }}>
          <Avatar name={p.firstName} size={110} />
          <AppText variant="caption" style={{ position: 'absolute', top: 10, right: 12 }}>Demo profile · no photo</AppText>
        </LinearGradient>
        <View style={{ padding: 16, gap: 6 }}>
          <AppText variant="title">{p.firstName}, {p.age}</AppText>
          <AppText variant="caption">{[p.profession, `${p.area} · ~${p.distanceKm} km`].filter(Boolean).join(' · ')}</AppText>
          <AppText variant="label">{intentions}</AppText>
          <AppText variant="caption">Verification: not verified (demo)</AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {p.interests.slice(0, 3).map((i) => <Chip key={i} label={i} selected={false} onPress={onOpen} />)}
          </View>
          <AppText variant="caption">
            {compat.score === null ? 'Estimated preference match: not enough data' : `Estimated preference match: ${compat.score}%`}
            {experience === 'spark' ? ' · Interest alone never implies consent.' : ''}
          </AppText>
        </View>
      </Pressable>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 16, flexWrap: 'wrap' }}>
        <GoldButton title="Pass" variant="outline" onPress={onPass} style={{ flexGrow: 1, flexBasis: '30%' }} />
        <GoldButton title={saved ? 'Saved' : 'Save'} variant="outline" onPress={onSave} style={{ flexGrow: 1, flexBasis: '30%' }} />
        <GoldButton title="Like" onPress={onLike} style={{ flexGrow: 1, flexBasis: '30%' }} />
        <GoldButton title="Mystery Reveal" variant="ghost" onPress={onMystery} style={{ flexBasis: '100%' }} />
      </View>
    </View>
  );
}
