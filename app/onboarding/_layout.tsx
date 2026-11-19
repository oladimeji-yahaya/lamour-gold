import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/theme/tokens';

// A stack keeps earlier steps mounted in history; their data lives in the persisted store,
// so going back never loses input.
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />;
}
