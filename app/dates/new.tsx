import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { GoldButton } from '@/components/ui/GoldButton';
import { TextField } from '@/components/ui/TextField';
import { ChipGroup } from '@/components/ui/Chip';
import { getProfile } from '@/data/demoProfiles';
import { useApp } from '@/store/appStore';
import { parseDob } from '@/lib/validation';
import type { DateCategory } from '@/data/types';

const CATEGORIES: readonly DateCategory[] = ['Dinner Date', 'Coffee Date', 'Drinks and Conversation', 'Concert', 'Art Gallery', 'Outdoor Activity', 'Custom Date'];

export default function NewDate() {
  const router = useRouter();
  const { profileId: initial } = useLocalSearchParams<{ profileId?: string }>();
  const { matches, blocked, addDate } = useApp();
  const options = matches.filter((m) => !blocked.includes(m.profileId));
  const [who, setWho] = useState<string | undefined>(initial ?? options[0]?.profileId);
  const [category, setCategory] = useState<DateCategory | undefined>('Coffee Date');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!who || !options.some((m) => m.profileId === who)) return setError('Choose a match.');
    if (!category) return setError('Choose an activity.');
    const d = parseDob(day);
    if (!d || d.getTime() < new Date().setHours(0, 0, 0, 0)) return setError('Enter a future date as YYYY-MM-DD.');
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return setError('Enter a time as HH:MM (24h).');
    if (venue.trim().length < 3) return setError('Suggest a public venue.');
    addDate({ profileId: who, category, day, time, venue: venue.trim() });
    router.replace('/dates');
  };

  return (
    <Screen footer={<GoldButton title="Send date plan" onPress={submit} disabled={options.length === 0} />}>
      <AppText variant="title">Plan a date</AppText>
      {options.length === 0 ? <AppText variant="caption">You need a match first.</AppText> : (
        <>
          <AppText variant="label">With</AppText>
          <ChipGroup
            options={options.map((m) => getProfile(m.profileId)?.firstName ?? m.profileId)}
            value={who ? getProfile(who)?.firstName : undefined}
            onChange={(name?: string) => setWho(options.find((m) => getProfile(m.profileId)?.firstName === name)?.profileId)}
          />
          <AppText variant="label">Activity</AppText>
          <ChipGroup options={CATEGORIES} value={category} onChange={setCategory} />
          <TextField label="Date (YYYY-MM-DD)" value={day} onChangeText={setDay} keyboardType="numbers-and-punctuation" />
          <TextField label="Time (HH:MM, 24h)" value={time} onChangeText={setTime} keyboardType="numbers-and-punctuation" />
          <TextField label="Public venue (your suggestion)" value={venue} onChangeText={setVenue} hint="We don’t check availability or make reservations." />
          {error ? <AppText style={{ color: '#D75C5C' }}>{error}</AppText> : null}
          <AppText variant="label">First-date safety</AppText>
          <AppText variant="caption">Meet in a public place, tell a friend where you’ll be, arrange your own transport, and leave if you feel uncomfortable. Consent is always yours to give or withdraw.</AppText>
        </>
      )}
    </Screen>
  );
}
