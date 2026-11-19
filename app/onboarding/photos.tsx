import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '@/components/ui/Screen';
import { StepHeader } from '@/components/ui/StepHeader';
import { GoldButton } from '@/components/ui/GoldButton';
import { AppText } from '@/components/ui/AppText';
import { colors, radius } from '@/theme/tokens';
import { useOnboarding } from '@/store/onboardingStore';
import { IS_DEMO_MODE } from '@/lib/env';

const MAX_PHOTOS = 6;
const MIN_PHOTOS = 2;
const MAX_BYTES = 8 * 1024 * 1024;

export default function Photos() {
  const router = useRouter();
  const { data, update, completeStep } = useOnboarding();
  const [error, setError] = useState('');

  const pick = async () => {
    setError('');
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return setError('Photo access is needed to add pictures. You can enable it in Settings.');
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - data.photos.length,
      quality: 0.85,
    });
    if (res.canceled) return;
    const accepted = res.assets.filter((a) => (a.fileSize ?? 0) <= MAX_BYTES && (a.mimeType ?? 'image/jpeg').startsWith('image/'));
    if (accepted.length < res.assets.length) setError('Some files were skipped (images only, 8 MB max).');
    update({
      photos: [...data.photos, ...accepted.map((a) => ({ id: `${Date.now()}-${Math.random()}`, uri: a.uri }))].slice(0, MAX_PHOTOS),
    });
  };

  const remove = (id: string) => update({ photos: data.photos.filter((p) => p.id !== id) });
  const makePrimary = (id: string) => {
    const p = data.photos.find((x) => x.id === id);
    if (p) update({ photos: [p, ...data.photos.filter((x) => x.id !== id)] });
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= data.photos.length) return;
    const arr = [...data.photos];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    update({ photos: arr });
  };

  const next = () => {
    if (data.photos.length < MIN_PHOTOS) return setError(`Add at least ${MIN_PHOTOS} photos.`);
    completeStep(7);
    router.push('/onboarding/verification');
  };

  return (
    <Screen footer={<GoldButton title="Continue" onPress={next} />}>
      <StepHeader step={7} total={9} title="Add your photos" subtitle={`Add ${MIN_PHOTOS}–${MAX_PHOTOS} clear photos. The first one is your primary photo.`} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {data.photos.map((p, i) => (
          <View key={p.id} style={{ width: '48%', gap: 6 }}>
            <Image source={{ uri: p.uri }} style={{ width: '100%', aspectRatio: 3 / 4, borderRadius: radius.md, borderWidth: i === 0 ? 2 : 1, borderColor: i === 0 ? colors.gold : colors.border }} accessibilityLabel={`Photo ${i + 1}`} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Pressable onPress={() => move(i, -1)} hitSlop={10}><AppText variant="label">◀</AppText></Pressable>
              {i === 0 ? <AppText variant="label">Primary</AppText> : <Pressable onPress={() => makePrimary(p.id)} hitSlop={10}><AppText variant="label">Make primary</AppText></Pressable>}
              <Pressable onPress={() => move(i, 1)} hitSlop={10}><AppText variant="label">▶</AppText></Pressable>
            </View>
            <Pressable onPress={() => remove(p.id)} hitSlop={10}><AppText variant="caption" style={{ color: colors.error }}>Remove</AppText></Pressable>
          </View>
        ))}
        {data.photos.length < MAX_PHOTOS ? (
          <Pressable onPress={pick} accessibilityRole="button" accessibilityLabel="Add photos" style={{ width: '48%', aspectRatio: 3 / 4, borderRadius: radius.md, borderWidth: 1, borderStyle: 'dashed', borderColor: '#A88650', alignItems: 'center', justifyContent: 'center' }}>
            <AppText variant="title" style={{ color: colors.gold }}>+</AppText>
          </Pressable>
        ) : null}
      </View>
      {error ? <AppText style={{ color: colors.error }}>{error}</AppText> : null}
      <AppText variant="caption">
        {IS_DEMO_MODE
          ? 'DEMO MODE: photos stay on this device and are not uploaded.'
          : 'Upload to Supabase Storage is not wired yet; photos are kept locally until Phase 6.'}
      </AppText>
    </Screen>
  );
}
