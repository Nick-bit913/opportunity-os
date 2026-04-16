import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function classifyReply(text: string) {
  const lower = text.toLowerCase();

  if (
    lower.includes("interested") ||
    lower.includes("sounds good") ||
    lower.includes("let's talk") ||
    lower.includes("lets talk") ||
    lower.includes("book a call") ||
    lower.includes("available") ||
    lower.includes("yes") ||
    lower.includes("sure") ||
    lower.includes("send more info")
  ) {
    return "interested";
  }

  if (
    lower.includes("closed") ||
    lower.includes("we're in") ||
    lower.includes("we are in") ||
    lower.includes("let's do it") ||
    lower.includes("lets do it") ||
    lower.includes("sign me up")
  ) {
    return "closed";
  }

  return "replied";
}

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: tokenRow, error: tokenError } = await supabase
    .from("gmail_tokens")
    .select("*")
    .limit(1)
    .single();

  if (tokenError || !tokenRow) {
    return NextResponse.json({ error: "No Gmail token found" }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: tokenRow.access_token,
    refresh_token: tokenRow.refresh_token,
    expiry_date: tokenRow.expiry_date,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .eq("contacted", true);

  if (leadsError) {
    return NextResponse.json({ error: leadsError.message }, { status: 500 });
  }

  let matched = 0;

  for (const lead of leads || []) {
    if (!lead.email) continue;

    // Only search newer messages if we have a last_contacted timestamp
    let query = `from:${lead.email}`;

    if (lead.last_contacted) {
      const contactDate = new Date(lead.last_contacted);
      const yyyy = contactDate.getUTCFullYear();
      const mm = String(contactDate.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(contactDate.getUTCDate()).padStart(2, "0");
      query += ` after:${yyyy}/${mm}/${dd}`;
    }

    const msgList = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 5,
    });

    const messages = msgList.data.messages || [];
    if (messages.length === 0) continue;

    let newestReplyText = "";
    let newestReplyDate: string | null = null;

    for (const msg of messages) {
      const fullMessage = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "full",
      });

      const internalDate = fullMessage.data.internalDate
        ? new Date(Number(fullMessage.data.internalDate)).toISOString()
        : null;

      const payload = fullMessage.data.payload;
      let bodyText = "";

      if (payload?.body?.data) {
        bodyText = Buffer.from(payload.body.data, "base64").toString("utf-8");
      } else if (payload?.parts) {
        for (const part of payload.parts) {
          if (part.mimeType === "text/plain" && part.body?.data) {
            bodyText = Buffer.from(part.body.data, "base64").toString("utf-8");
            break;
          }
        }
      }

      if (
        internalDate &&
        (!newestReplyDate || new Date(internalDate) > new Date(newestReplyDate))
      ) {
        newestReplyDate = internalDate;
        newestReplyText = bodyText || "";
      }
    }

    if (!newestReplyDate) continue;

    // Extra safety: only count as reply if it came after last_contacted
    if (lead.last_contacted) {
      const lastContacted = new Date(lead.last_contacted);
      const replyDate = new Date(newestReplyDate);

      if (replyDate <= lastContacted) {
        continue;
      }
    }

    const newStatus = classifyReply(newestReplyText);

    await supabase
      .from("leads")
      .update({
        status: newStatus,
        reply_summary: newestReplyText.slice(0, 500),
        reply_detected_at: newestReplyDate,
      })
      .eq("id", lead.id);

    matched++;
  }

  return NextResponse.json({ success: true, matched });
}