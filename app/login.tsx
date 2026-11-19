import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthBackdrop } from '@/components/ui/AuthBackdrop';
import { View } from 'react-native';
import { colors } from '@/theme/tokens';
import { TextField } from '@/components/ui/TextField';
import { GoldButton } from '@/components/ui/GoldButton';
import { AppText } from '@/components/ui/AppText';
import { signInWithEmail, requestPasswordReset } from '@/lib/auth';
import { IS_DEMO_MODE } from '@/lib/env';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const login = async () => {
    setMessage('');
    if (!email.includes('@') || password.length < 8) return setMessage('Enter a valid email and your password.');
    setLoading(true);
    const res = await signInWithEmail(email.trim(), password);
    setLoading(false);
    if (!res.ok) return setMessage(res.error);
    router.replace('/home');
  };

  const forgot = async () => {
    if (!email.includes('@')) return setMessage('Enter your email above first.');
    const res = await requestPasswordReset(email.trim());
    if (!res.ok) return setMessage(res.error);
    setMessage(res.simulated ? 'Demo mode: no email was sent.' : 'If that email has an account, a reset link has been sent.');
  };

  return (
    <AuthBackdrop
      footer={
        <>
          <GoldButton title="Sign In" onPress={login} loading={loading} />
          <GoldButton title="Forgot password" variant="ghost" onPress={forgot} />
          <GoldButton title="Create an Account" variant="outline" onPress={() => router.push('/onboarding/account')} />
        </>
      }
    >
      <View style={{ height: 160 }} />
      <AppText variant="display" style={{ textAlign: 'center', color: colors.goldLight }}>Welcome Back</AppText>
      <AppText variant="caption" style={{ textAlign: 'center', marginBottom: 22 }}>Sign in to continue your golden journey.</AppText>
      {IS_DEMO_MODE ? <AppText variant="caption">DEMO MODE: any valid-looking credentials are accepted.</AppText> : null}
      <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {message ? <AppText variant="caption">{message}</AppText> : null}
    </AuthBackdrop>
  );
}
