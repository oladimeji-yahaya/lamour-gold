import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { GoldButton } from '@/components/ui/GoldButton';
import { getProfile } from '@/data/demoProfiles';
import { useApp } from '@/store/appStore';
import { colors, radius } from '@/theme/tokens';

export default function Dates() {
  const router = useRouter();
  const { dates, setDateStatus, matches } = useApp();
  return (
    <Screen footer={<GoldButton title="Plan a date" onPress={() => router.push('/dates/new')} disabled={matches.length === 0} />}>
      <AppText variant="title">Dates</AppText>
      {matches.length === 0 ? <AppText variant="caption">Match with someone first, then you can plan a date.</AppText> : null}
      <AppText variant="caption">Demo mode: the other person’s responses are simulated with the buttons below. Venue availability and reservations are never checked.</AppText>
      {dates.length === 0 ? <AppText variant="caption">No dates yet.</AppText> : dates.map((d) => {
        const p = getProfile(d.profileId);
        return (
          <View key={d.id} style={{ padding: 14, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, gap: 6 }}>
            <AppText>{d.category} with {p?.firstName ?? 'match'}</AppText>
            <AppText variant="caption">{d.day} at {d.time} · {d.venue}</AppText>
            <AppText variant="label">Status: {d.status}</AppText>
            {d.status === 'proposed' ? (
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                <GoldButton title="Demo: they accept" variant="outline" onPress={() => setDateStatus(d.id, 'accepted')} />
                <GoldButton title="Demo: they decline" variant="outline" onPress={() => setDateStatus(d.id, 'declined')} />
              </View>
            ) : null}
            {d.status === 'proposed' || d.status === 'accepted' ? <GoldButton title="Cancel plan" variant="ghost" onPress={() => setDateStatus(d.id, 'cancelled')} /> : null}
          </View>
        );
      })}
      <AppText variant="caption">“Propose another time” is not built yet: cancel and propose a new plan for now.</AppText>
    </Screen>
  );
}
