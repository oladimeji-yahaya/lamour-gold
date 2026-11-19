import React from 'react';
import { Alert, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { GoldButton } from '@/components/ui/GoldButton';
import { Chip } from '@/components/ui/Chip';
import { Avatar } from '@/components/Avatar';
import { getProfile } from '@/data/demoProfiles';
import { computeCompatibility } from '@/lib/compatibility';
import { useMeSubject } from '@/lib/me';
import { useApp } from '@/store/appStore';
import { EXPERIENCES } from '@/constants/options';
import { colors, radius } from '@/theme/tokens';

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ gap: 6 }}><AppText variant="label">{title}</AppText>{children}</View>
);

export default function ProfileDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const p = getProfile(id);
  const me = useMeSubject();
  const { experience, like, pass, block, report, blocked } = useApp();

  if (!p || blocked.includes(p.id)) return <Screen><AppText>This profile isn’t available.</AppText></Screen>;

  const compat = computeCompatibility(me, { experiences: p.experiences, values: p.values, interests: p.interests, ...p.lifestyle, communication: p.communication }, experience);

  return (
    <Screen
      footer={
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <GoldButton title="Pass" variant="outline" style={{ flex: 1 }} onPress={() => { pass(p.id); router.back(); }} />
          <GoldButton title="Like" style={{ flex: 1 }} onPress={() => { if (like(p.id, p.likesYou)) router.replace({ pathname: '/match/[id]', params: { id: p.id } }); else Alert.alert('Like sent', 'Demo mode: stored on this device.'); }} />
        </View>
      }
    >
      <LinearGradient colors={['#2A2314', '#0E0C08']} style={{ height: 240, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#A88650' }}>
        <Avatar name={p.firstName} size={120} />
        <AppText variant="caption" style={{ position: 'absolute', bottom: 10 }}>Demo profile · gallery not built</AppText>
      </LinearGradient>
      <AppText variant="display" style={{ fontSize: 28 }}>{p.firstName}, {p.age}</AppText>
      <AppText variant="caption">{[p.profession, `${p.area} · ~${p.distanceKm} km away`].filter(Boolean).join(' · ')}</AppText>
      <AppText variant="caption">Verification: not verified (demo)</AppText>
      <AppText variant="label">{EXPERIENCES.filter((e) => p.experiences.includes(e.key)).map((e) => e.name).join(' · ')}</AppText>

      <Block title="About"><AppText>{p.bio}</AppText></Block>
      <Block title="Relationship goals"><AppText>{p.relationshipGoals}</AppText></Block>
      <Block title="Interests"><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{p.interests.map((i) => <Chip key={i} label={i} selected={false} onPress={() => {}} />)}</View></Block>
      <Block title="Values"><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{p.values.map((i) => <Chip key={i} label={i} selected={false} onPress={() => {}} />)}</View></Block>
      <Block title="Lifestyle"><AppText>{Object.entries(p.lifestyle).map(([k, v]) => `${k}: ${v}`).join(' · ')}</AppText></Block>
      {p.prompts.map((q) => <Block key={q.question} title={q.question}><AppText>{q.answer}</AppText></Block>)}
      <Block title="Voice introduction"><AppText variant="caption">Not built yet.</AppText></Block>

      <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, gap: 6 }}>
        <AppText variant="title" style={{ fontSize: 18 }}>{compat.score === null ? 'Estimated preference match' : `Estimated preference match: ${compat.score}%`}</AppText>
        {compat.parts.map((c) => <AppText key={c.label} variant="caption">{c.label}: {Math.round(c.points)}/{c.max}. {c.detail}</AppText>)}
        <AppText variant="caption">{compat.summary}</AppText>
        <AppText variant="caption">{compat.disclaimer}</AppText>
      </View>

      <GoldButton title="Start Mystery Reveal" variant="outline" onPress={() => router.push({ pathname: '/mystery/[id]', params: { id: p.id } })} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <GoldButton title="Report" variant="ghost" style={{ flex: 1 }} onPress={() => Alert.alert('Report this profile?', undefined, [{ text: 'Cancel', style: 'cancel' }, { text: 'Report', onPress: () => { report(p.id); Alert.alert('Report recorded', 'Demo mode: saved on this device only. No moderator receives it.'); } }])} />
        <GoldButton title="Block" variant="ghost" style={{ flex: 1 }} onPress={() => Alert.alert('Block this person?', 'They will no longer appear for you.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Block', style: 'destructive', onPress: () => { block(p.id); router.back(); } }])} />
        <GoldButton title="Share" variant="ghost" style={{ flex: 1 }} onPress={() => Alert.alert('Not built yet', 'Profile sharing will respect each member’s privacy settings once those exist.')} />
      </View>
    </Screen>
  );
}
