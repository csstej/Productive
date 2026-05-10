import type { DailyHistory, DailyState } from "../types/task";
import { supabase } from "./supabase";

export type RemoteAppData = {
  dailyState: DailyState;
  history: DailyHistory[];
};

type UserDataRow = {
  daily_state: DailyState;
  history: DailyHistory[];
};

export async function loadRemoteAppData(
  userId: string,
): Promise<RemoteAppData | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("user_data")
    .select("daily_state, history")
    .eq("user_id", userId)
    .maybeSingle<UserDataRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    dailyState: data.daily_state,
    history: data.history ?? [],
  };
}

export async function saveRemoteAppData(
  userId: string,
  appData: RemoteAppData,
): Promise<void> {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.from("user_data").upsert({
    user_id: userId,
    daily_state: appData.dailyState,
    history: appData.history,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}

