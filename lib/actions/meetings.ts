"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import type { MeetingStatus } from "@/lib/types";

export async function updateMeetingStatus(meetingId: string, status: MeetingStatus) {
  const user = await getAuthUser();
  if (!user) {
    return { ok: false, error: "Not authenticated." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("meetings").update({ status }).eq("id", meetingId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/meetings");
  revalidatePath("/admin/clients");
  revalidatePath("/admin");
  return { ok: true };
}
