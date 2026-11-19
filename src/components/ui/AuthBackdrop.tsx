import React from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/tokens';

/** Shared photographic background for welcome, sign-in, and registration. */
export function AuthBackdrop({ children, footer, scroll = true }: { children: React.ReactNode; footer?: React.ReactNode; scroll?: boolean }) {
  return (
    <ImageBackground source={require('../../../assets/images/romantic-background.png')} resizeMode="cover" style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient colors={['rgba(0,0,0,0.28)', 'rgba(0,0,0,0.48)', '#080808', '#080808']} locations={[0, 0.37, 0.73, 1]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {scroll ? (
              <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 18 }}>
                {children}
              </ScrollView>
            ) : <View style={{ flex: 1, paddingHorizontal: 24 }}>{children}</View>}
            {footer ? <View style={{ paddingHorizontal: 24, paddingBottom: 16, gap: 10 }}>{footer}</View> : null}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}
