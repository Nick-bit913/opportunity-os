import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const body = await req.json();
  const clientId = body.clientId || null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let query = supabase
    .from("leads")
    .select("*")
    .or("contacted.eq.false,follow_up_count.lt.2");

  if (clientId) {
    query = query.eq("client_id", clientId);
  }

  const { data: leads, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sentCount = 0;
  let skipped: string[] = [];

  for (const lead of leads || []) {
    if (!lead.email || !isValidEmail(lead.email)) {
      skipped.push(`${lead.name || "Unknown"} (${lead.email || "no email"})`);
      continue;
    }

    let subject = "";
    let bodyText = "";

    if (!lead.contacted) {
      subject = `Quick idea for ${lead.company}`;
      bodyText = `Hey ${lead.name},

I noticed ${lead.company} may be missing chances to turn inbound leads into booked jobs.

We help businesses recover missed opportunities and turn them into more appointments automatically.

Would you be open to a quick look at how this could work for ${lead.company}?

- Nick`;
    } else if (lead.follow_up_count === 0) {
      subject = `Following up`;
      bodyText = `Hey ${lead.name},

Just wanted to follow up in case you missed my last message.

Would you be open to a quick chat about helping ${lead.company} get more booked jobs?

- Nick`;
    } else if (lead.follow_up_count === 1) {
      subject = `Quick check`;
      bodyText = `Hey ${lead.name},

Not sure if this is a priority right now, but figured I’d check one last time.

Worth a quick look?

- Nick`;
    } else {
      continue;
    }

    const sendResult = await resend.emails.send({
      from: "outreach@bookmorejobs.net",
      to: lead.email,
      subject,
      text: bodyText,
    });

    if ((sendResult as any)?.error) {
      skipped.push(`${lead.name} (${lead.email})`);
      continue;
    }

    await supabase.from("sent_emails").insert([
      {
        lead_id: lead.id,
        email: lead.email,
        subject,
        body: bodyText,
      },
    ]);

    await supabase
      .from("leads")
      .update({
        contacted: true,
        follow_up_count: lead.contacted ? lead.follow_up_count + 1 : 0,
        last_contacted: new Date().toISOString(),
        status: "contacted",
      })
      .eq("id", lead.id);

    sentCount++;
  }

  await supabase.from("campaigns").insert([
    {
      client_id: clientId,
      name: clientId ? "Client Campaign" : "General Campaign",
      sent_count: sentCount,
    },
  ]);

  return NextResponse.json({
    success: true,
    sent: sentCount,
    skipped,
  });
}