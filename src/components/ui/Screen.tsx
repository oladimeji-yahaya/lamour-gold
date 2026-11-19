import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/tokens';

export function Screen({
  children,
  scroll = true,
  footer,
  style,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  footer?: React.ReactNode;
  style?: ViewStyle;
}) {
  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[{ padding: 20, paddingBottom: 32, gap: 16 }, style]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1, padding: 20, gap: 16 }, style]}>{children}</View>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {body}
        {footer ? <View style={{ padding: 20, paddingTop: 8, gap: 10 }}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
