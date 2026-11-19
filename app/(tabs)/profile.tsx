import React from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { GoldButton } from '@/components/ui/GoldButton';
import { Avatar } from '@/components/Avatar';
import { useOnboarding } from '@/store/onboardingStore';
import { useApp } from '@/store/appStore';
import { myAge, profileCompletion } from '@/lib/me';
import { EXPERIENCES } from '@/constants/options';
import { supabase } from '@/lib/supabase';
import { colors, radius } from '@/theme/tokens';

type Row = { label: string; to?: string; note?: string };

const ROWS: Row[] = [
  { label: 'Edit personal information', to: '/onboarding/basic' },
  { label: 'Edit more details', to: '/onboarding/details' },
  { label: 'Edit lifestyle and interests', to: '/onboarding/lifestyle' },
  { label: 'Edit biography', to: '/onboarding/bio' },
  { label: 'Edit photos', to: '/onboarding/photos' },
  { label: 'Change dating intentions', to: '/onboarding/intentions' },
  { label: 'Discovery preferences', to: '/filters' },
  { label: 'Verification', to: '/onboarding/verification' },
  { label: 'Dates', to: '/dates' },
  { label: 'Blocked accounts', to: '/settings/blocked' },
  { label: 'Privacy and visibility', note: 'Not built yet. Needs backend visibility settings.' },
  { label: 'Notification preferences', note: 'Not built yet. Needs Expo Notifications and a backend.' },
  { label: 'Help and support', note: 'Not built yet. No support channel is configured.' },
];

export default function Profile() {
  const router = useRouter();
  const data = useOnboarding((s) => s.data);
  const resetOnboarding = useOnboarding((s) => s.reset);
  const { resetDemo } = useApp();
  const age = myAge(data);

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    router.replace('/welcome');
  };

  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: 6 }}>
        <Avatar name={data.firstName || 'You'} size={96} />
        <AppText variant="title">{data.firstName || 'Your name'}{age !== null ? `, ${age}` : ''}</AppText>
        <AppText variant="caption">Verification: none completed yet · Profile {profileCompletion(data)}% complete</AppText>
        <AppText variant="label">{EXPERIENCES.filter((e) => data.experiences.includes(e.key)).map((e) => e.name).join(' · ') || 'No experience selected'}</AppText>
      </View>
      <GoldButton title="Preview public profile" variant="outline" onPress={() => router.push('/onboarding/preview')} />
      {ROWS.map((r) => (
        <Pressable
          key={r.label}
          onPress={() => (r.to ? router.push(r.to as never) : Alert.alert(r.label, r.note))}
          style={{ minHeight: 52, justifyContent: 'center', paddingHorizontal: 14, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card }}
        >
          <AppText>{r.label}</AppText>
        </Pressable>
      ))}
      <AppText variant="caption">Edit screens reuse the onboarding steps; changes save on this device. Backend saving arrives in Phase 6.</AppText>
      <GoldButton title="Log out" variant="outline" onPress={logout} />
      <GoldButton
        title="Delete account"
        variant="ghost"
        onPress={() => Alert.alert('Not built yet', 'Account deletion needs a server-side data-deletion workflow. Nothing has been deleted.')}
      />
      <GoldButton
        title="Reset demo data (dev)"
        variant="ghost"
        onPress={() => Alert.alert('Reset demo data?', 'Clears likes, matches, chats, dates and onboarding on this device.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', style: 'destructive', onPress: () => { resetDemo(); resetOnboarding(); router.replace('/welcome'); } }])}
      />
    </Screen>
  );
}
