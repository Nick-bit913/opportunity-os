import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    await resend.emails.send({
      from: "outreach@bookmorejobs.net",
      to: body.email,
      subject: body.subject,
      text: body.body,
    });

    const { error } = await supabase.from("sent_emails").insert([
      {
        lead_id: body.leadId || null,
        email: body.email,
        subject: body.subject,
        body: body.body,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Something went wrong while sending email." },
      { status: 500 }
    );
  }
}