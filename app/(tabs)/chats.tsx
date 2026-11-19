import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/Avatar';
import { getProfile } from '@/data/demoProfiles';
import { useApp } from '@/store/appStore';
import { colors } from '@/theme/tokens';

export default function Chats() {
  const router = useRouter();
  const { matches, messages, unread, blocked } = useApp();
  const list = matches.filter((m) => !blocked.includes(m.profileId));
  return (
    <Screen>
      <AppText variant="title">Chats</AppText>
      <AppText variant="caption">Demo mode: messages are stored on this device and replies are simulated.</AppText>
      {list.length === 0 ? <AppText variant="caption">No conversations yet. Match with someone to start one.</AppText> : list.map((m) => {
        const p = getProfile(m.profileId);
        if (!p) return null;
        const last = (messages[p.id] ?? []).slice(-1)[0];
        const n = unread[p.id] ?? 0;
        return (
          <Pressable key={p.id} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: p.id } })} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 8 }}>
            <Avatar name={p.firstName} size={52} />
            <View style={{ flex: 1 }}>
              <AppText>{p.firstName}</AppText>
              <AppText variant="caption" numberOfLines={1}>{last ? last.text : 'It’s a match. Say hello.'}</AppText>
            </View>
            {n > 0 ? <AppText style={{ color: colors.gold }}>{n} new</AppText> : null}
          </Pressable>
        );
      })}
    </Screen>
  );
}
