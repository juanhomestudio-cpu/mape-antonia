import { supabase } from '@/lib/supabase';

export async function signUpWithEmail(args: {
  email: string;
  password: string;
  displayName: string;
}) {
  const { email, password, displayName } = args;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(args: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: args.email,
    password: args.password,
  });
  if (error) throw error;
  return data;
}

export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
