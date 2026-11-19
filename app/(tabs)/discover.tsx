import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { GoldButton } from '@/components/ui/GoldButton';
import { ExperienceTabs } from '@/components/ExperienceTabs';
import { ProfileCard } from '@/components/ProfileCard';
import { useDiscovery } from '@/hooks/useDiscovery';
import { useApp } from '@/store/appStore';
import { EXPERIENCES } from '@/constants/options';
import { colors } from '@/theme/tokens';

export default function Discover() {
  const router = useRouter();
  const { experience, setExperience, like, pass, toggleSave, saved, filters } = useApp();
  const candidates = useDiscovery();
  const exp = EXPERIENCES.find((e) => e.key === experience)!;

  const doLike = (id: string, theyLikeMe: boolean) => {
    const matched = like(id, theyLikeMe);
    if (matched) router.push({ pathname: '/match/[id]', params: { id } });
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="title">Discover</AppText>
        <GoldButton title="Filters" variant="outline" onPress={() => router.push('/filters')} style={{ minWidth: 100 }} />
      </View>
      <ExperienceTabs value={experience} onChange={setExperience} />
      <AppText variant="caption">{exp.name}: {exp.blurb}</AppText>
      <AppText variant="caption">
        Ages {filters.ageMin}–{filters.ageMax} · within {filters.maxDistanceKm} km{filters.interest ? ` · ${filters.interest}` : ''}. Curated list, not endless swiping. Swipe gestures are not built yet.
      </AppText>
      {candidates.length === 0 ? (
        <View style={{ padding: 24, borderWidth: 1, borderColor: colors.border, borderRadius: 16, gap: 8 }}>
          <AppText variant="title">No one new right now</AppText>
          <AppText variant="caption">Try widening your filters or switching experience.</AppText>
        </View>
      ) : (
        candidates.map(({ profile, compat }) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            compat={compat}
            experience={experience}
            saved={saved.includes(profile.id)}
            onOpen={() => router.push({ pathname: '/member/[id]', params: { id: profile.id } })}
            onLike={() => doLike(profile.id, profile.likesYou)}
            onPass={() => pass(profile.id)}
            onSave={() => toggleSave(profile.id)}
            onMystery={() => router.push({ pathname: '/mystery/[id]', params: { id: profile.id } })}
          />
        ))
      )}
    </Screen>
  );
}
