import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const email = {
    subject: `Quick idea for ${body.company}`,
    body: `Hey ${body.name},

I noticed ${body.company} may be missing chances to turn inbound leads into booked jobs.

We help businesses recover missed opportunities and turn them into more appointments automatically.

Would you be open to a quick look at how this could work for ${body.company}?

- Nick`,
  };

  return NextResponse.json(email);
}