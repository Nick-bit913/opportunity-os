import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.from("appointments").insert([
    {
      lead_id: body.leadId,
      name: body.name,
      company: body.company,
      email: body.email,
      scheduled_time: body.scheduledTime,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from("leads")
    .update({ status: "closed" })
    .eq("id", body.leadId);

  return NextResponse.json({ success: true });
}