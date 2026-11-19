import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { GoldButton } from '@/components/ui/GoldButton';
import { getProfile } from '@/data/demoProfiles';
import { useApp } from '@/store/appStore';
import { colors, fonts, radius } from '@/theme/tokens';

const REPLIES = ['That sounds lovely. Tell me more.', 'Ha, I like that. What are you up to this week?', 'Would you be up for a coffee somewhere public sometime soon?'];

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const p = getProfile(id);
  const { messages, matches, blocked, sendMessage, receiveSimulated, markRead, block, report, unmatch } = useApp();
  const [text, setText] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMatch = matches.some((m) => m.profileId === id);
  const list = messages[id] ?? [];

  useEffect(() => { markRead(id); return () => { if (timer.current) clearTimeout(timer.current); }; }, [id, markRead, list.length]);

  if (!p || !isMatch || blocked.includes(id)) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, padding: 20 }}><AppText>This conversation isn’t available. Only matched, unblocked people can chat.</AppText></SafeAreaView>;
  }

  const send = () => {
    const t = text.trim();
    if (!t) return;
    sendMessage(id, t);
    setText('');
    timer.current = setTimeout(() => receiveSimulated(id, REPLIES[list.length % REPLIES.length]), 1500);
  };

  const menu = () =>
    Alert.alert(p.firstName, undefined, [
      { text: 'Report', onPress: () => { report(id); Alert.alert('Report recorded', 'Demo mode: stored on this device only. No moderator receives it.'); } },
      { text: 'Block', style: 'destructive', onPress: () => { block(id); router.back(); } },
      { text: 'Unmatch', style: 'destructive', onPress: () => { unmatch(id); router.back(); } },
      { text: 'Cancel', style: 'cancel' },
    ]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Pressable onPress={() => router.back()} hitSlop={12}><AppText variant="label">Back</AppText></Pressable>
        <AppText variant="title" style={{ flex: 1, fontSize: 20 }}>{p.firstName}</AppText>
        <Pressable onPress={() => router.push('/dates/new?profileId=' + id)} hitSlop={12}><AppText variant="label">Plan date</AppText></Pressable>
        <Pressable onPress={menu} hitSlop={12}><AppText variant="label">More</AppText></Pressable>
      </View>
      <FlatList
        data={list}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        ListHeaderComponent={<AppText variant="caption">Demo conversation. Replies are scripted, not from a real person. Image and voice messages are not built yet.</AppText>}
        renderItem={({ item }) => (
          <View style={{ alignSelf: item.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '80%', padding: 12, borderRadius: radius.md, backgroundColor: item.from === 'me' ? 'rgba(212,175,55,0.2)' : colors.card, borderWidth: 1, borderColor: colors.border }}>
            <AppText>{item.text}</AppText>
            <AppText variant="caption">{new Date(item.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{item.from === 'me' ? ' · Sent' : item.simulated ? ' · Simulated' : ''}</AppText>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center' }}>
        <TextInput value={text} onChangeText={setText} placeholder="Message" placeholderTextColor="#7A7A7A" accessibilityLabel="Message" style={{ flex: 1, minHeight: 48, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, color: colors.text, fontFamily: fonts.body, backgroundColor: colors.card }} />
        <GoldButton title="Send" onPress={send} disabled={!text.trim()} style={{ minWidth: 80 }} />
      </View>
    </SafeAreaView>
  );
}
