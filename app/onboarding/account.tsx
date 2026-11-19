import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthBackdrop } from '@/components/ui/AuthBackdrop';
import { View } from 'react-native';
import { colors } from '@/theme/tokens';
import { StepHeader } from '@/components/ui/StepHeader';
import { TextField } from '@/components/ui/TextField';
import { GoldButton } from '@/components/ui/GoldButton';
import { AppText } from '@/components/ui/AppText';
import { accountSchema } from '@/lib/validation';
import { signUpWithEmail } from '@/lib/auth';
import { IS_DEMO_MODE } from '@/lib/env';

export default function Account() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const submit = async () => {
    setServerError('');
    const parsed = accountSchema.safeParse({ email, password, confirm });
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (e[String(i.path[0])] ??= i.message));
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    const res = await signUpWithEmail(parsed.data.email, parsed.data.password);
    setLoading(false);
    if (!res.ok) return setServerError(res.error);
    router.push('/onboarding/basic');
  };

  return (
    <AuthBackdrop footer={<GoldButton title="Continue" onPress={submit} loading={loading} />}>
      <View style={{ height: 110 }} />
      <AppText variant="display" style={{ color: colors.goldLight, textAlign: 'center' }}>Create Your Account</AppText>
      <AppText variant="caption" style={{ textAlign: 'center', marginBottom: 20 }}>Begin your journey to meaningful connections.</AppText>
      {IS_DEMO_MODE ? (
        <AppText variant="caption">DEMO MODE: no real account is created; nothing leaves this device.</AppText>
      ) : null}
      <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" error={errors.email} />
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" error={errors.password} hint="8+ characters with a letter and a number" />
      <TextField label="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry error={errors.confirm} />
      {serverError ? <AppText style={{ color: '#D75C5C' }}>{serverError}</AppText> : null}
      <AppText variant="caption">
        Google and Apple sign-in are not set up yet. They need OAuth credentials configured in your Supabase project (see README).
      </AppText>
    </AuthBackdrop>
  );
}
