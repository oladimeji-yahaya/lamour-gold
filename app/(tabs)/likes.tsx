import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { GoldButton } from '@/components/ui/GoldButton';
import { Avatar } from '@/components/Avatar';
import { DEMO_PROFILES, getProfile } from '@/data/demoProfiles';
import { useApp } from '@/store/appStore';
import { colors, radius } from '@/theme/tokens';

export default function Likes() {
  const router = useRouter();
  const { liked, passed, blocked, matches, like, pass } = useApp();
  const likesYou = DEMO_PROFILES.filter((p) => p.likesYou && !liked.includes(p.id) && !passed.includes(p.id) && !blocked.includes(p.id));
  const youLiked = liked.map(getProfile).filter((p) => p && !blocked.includes(p.id) && !matches.some((m) => m.profileId === p.id));

  return (
    <Screen>
      <AppText variant="title">Likes</AppText>
      <AppText variant="label">Liked you (simulated)</AppText>
      {likesYou.length === 0 ? <AppText variant="caption">No new likes.</AppText> : likesYou.map((p) => (
        <View key={p.id} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card }}>
          <Avatar name={p.firstName} size={52} />
          <View style={{ flex: 1 }}>
            <AppText onPress={() => router.push({ pathname: '/member/[id]', params: { id: p.id } })}>{p.firstName}, {p.age}</AppText>
            <AppText variant="caption">{p.profession}</AppText>
          </View>
          <GoldButton title="Pass" variant="outline" onPress={() => pass(p.id)} style={{ minWidth: 70 }} />
          <GoldButton title="Like" onPress={() => { if (like(p.id, true)) router.push({ pathname: '/match/[id]', params: { id: p.id } }); }} style={{ minWidth: 70 }} />
        </View>
      ))}
      <AppText variant="label">You liked, awaiting a response</AppText>
      {youLiked.length === 0 ? <AppText variant="caption">Nothing pending.</AppText> : youLiked.map((p) => p && (
        <AppText key={p.id} onPress={() => router.push({ pathname: '/member/[id]', params: { id: p.id } })}>{p.firstName}, {p.age}</AppText>
      ))}
    </Screen>
  );
}
