import { supabase } from './supabase';
import { IS_DEMO_MODE } from './env';

export type AuthResult = { ok: true; simulated: boolean; needsEmailConfirm: boolean } | { ok: false; error: string };

/** Real Supabase sign-up when configured; otherwise a clearly flagged simulation. */
export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  if (IS_DEMO_MODE || !supabase) return { ok: true, simulated: true, needsEmailConfirm: false };
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, simulated: false, needsEmailConfirm: !data.session };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (IS_DEMO_MODE || !supabase) return { ok: true, simulated: true, needsEmailConfirm: false };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, simulated: false, needsEmailConfirm: false };
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (IS_DEMO_MODE || !supabase) return { ok: true, simulated: true, needsEmailConfirm: false };
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { ok: false, error: error.message };
  return { ok: true, simulated: false, needsEmailConfirm: false };
}
