import React from 'react';
import { View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { GoldButton } from '@/components/ui/GoldButton';
import { getProfile } from '@/data/demoProfiles';
import { useApp } from '@/store/appStore';

export default function Blocked() {
  const { blocked, unblock } = useApp();
  return (
    <Screen>
      <AppText variant="title">Blocked accounts</AppText>
      {blocked.length === 0 ? <AppText variant="caption">You haven’t blocked anyone.</AppText> : blocked.map((id) => (
        <View key={id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <AppText>{getProfile(id)?.firstName ?? id}</AppText>
          <GoldButton title="Unblock" variant="outline" onPress={() => unblock(id)} style={{ minWidth: 110 }} />
        </View>
      ))}
      <AppText variant="caption">Demo mode: blocks are stored on this device. Blocking is enforced in the database in Phase 6.</AppText>
    </Screen>
  );
}
