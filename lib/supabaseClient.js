import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (data.user) {
    await supabase.from("profiles").insert({ id: data.user.id, username });
  }
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function getForYouFeed(limit = 20) {
  const { data, error } = await supabase
    .from("videos")
    .select("*, profiles(username, avatar_url)")
    .order("engagement_score", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function likeVideo(userId, videoId) {
  const { error } = await supabase.from("likes").insert({ user_id: userId, video_id: videoId });
  if (error) throw error;
  }
