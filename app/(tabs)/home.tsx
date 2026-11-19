import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { GoldButton } from '@/components/ui/GoldButton';
import { Avatar } from '@/components/Avatar';
import { ExperienceTabs } from '@/components/ExperienceTabs';
import { useDiscovery } from '@/hooks/useDiscovery';
import { useApp } from '@/store/appStore';
import { useOnboarding } from '@/store/onboardingStore';
import { profileCompletion } from '@/lib/me';
import { getProfile, DEMO_PROFILES } from '@/data/demoProfiles';
import { EXPERIENCES } from '@/constants/options';
import { colors, radius } from '@/theme/tokens';
import { IS_DEMO_MODE } from '@/lib/env';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ gap: 8 }}>
    <AppText variant="title" style={{ fontSize: 20 }}>{title}</AppText>
    {children}
  </View>
);

export default function Home() {
  const router = useRouter();
  const data = useOnboarding((s) => s.data);
  const { experience, setExperience, liked, passed, blocked, matches, messages, dates } = useApp();
  const picks = useDiscovery().slice(0, 3);
  const completion = profileCompletion(data);
  const newLikes = DEMO_PROFILES.filter((p) => p.likesYou && !liked.includes(p.id) && !passed.includes(p.id) && !blocked.includes(p.id));
  const upcoming = dates.filter((d) => d.status === 'accepted' || d.status === 'proposed');
  const current = EXPERIENCES.find((e) => e.key === experience)!;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Avatar name={data.firstName || 'You'} size={48} />
        <View style={{ flex: 1 }}>
          <AppText variant="title">{greeting}{data.firstName ? `, ${data.firstName}` : ''}</AppText>
          <AppText variant="caption">Current experience: {current.name}</AppText>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Notifications (not built yet)" onPress={() => router.push('/notifications')} hitSlop={10}>
          <AppText variant="label">Alerts</AppText>
        </Pressable>
      </View>
      {IS_DEMO_MODE ? <AppText variant="caption">DEMO MODE: all people and activity here are simulated.</AppText> : null}

      <ExperienceTabs value={experience} onChange={setExperience} />

      <Section title="Profile completion">
        <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4 }}>
          <View style={{ width: `${completion}%`, height: 8, backgroundColor: colors.gold, borderRadius: 4 }} />
        </View>
        <AppText variant="caption">{completion}% complete</AppText>
      </Section>

      <Section title="Today’s curated picks">
        {picks.length === 0 ? <AppText variant="caption">No new picks for this experience.</AppText> : picks.map(({ profile, compat }) => (
          <Pressable key={profile.id} onPress={() => router.push({ pathname: '/member/[id]', params: { id: profile.id } })} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card }}>
            <Avatar name={profile.firstName} size={48} />
            <View style={{ flex: 1 }}>
              <AppText>{profile.firstName}, {profile.age}</AppText>
              <AppText variant="caption">{compat.score === null ? 'Not enough data to estimate' : `Estimated preference match ${compat.score}%`}</AppText>
            </View>
          </Pressable>
        ))}
        <GoldButton title="Open Discover" variant="outline" onPress={() => router.push('/(tabs)/discover')} />
      </Section>

      <Section title="New likes">
        <AppText variant="caption">{newLikes.length === 0 ? 'No new likes.' : `${newLikes.length} people liked you (simulated).`}</AppText>
        {newLikes.length > 0 ? <GoldButton title="See who" variant="outline" onPress={() => router.push('/(tabs)/likes')} /> : null}
      </Section>

      <Section title="Recent conversations">
        {matches.length === 0 ? <AppText variant="caption">No matches yet.</AppText> : matches.slice(-3).map((m) => {
          const p = getProfile(m.profileId);
          const last = (messages[m.profileId] ?? []).slice(-1)[0];
          return p ? (
            <Pressable key={m.profileId} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: p.id } })}>
              <AppText>{p.firstName}</AppText>
              <AppText variant="caption">{last ? last.text : 'Say hello'}</AppText>
            </Pressable>
          ) : null;
        })}
      </Section>

      <Section title="Upcoming dates">
        <AppText variant="caption">{upcoming.length === 0 ? 'Nothing planned yet.' : `${upcoming.length} date plan(s).`}</AppText>
        <GoldButton title="Plan or view dates" variant="outline" onPress={() => router.push('/dates')} />
      </Section>
    </Screen>
  );
}
