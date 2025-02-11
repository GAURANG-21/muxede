import NextCors from 'nextjs-cors';
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Mux from "@mux/mux-node";

const mux = new Mux();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await NextCors(req, {
    methods: ['POST'],
    origin: ['https://muxede-v6pd-git-master-gaurang-21s-projects.vercel.app', 'http://localhost:3000'], // Add your allowed origins here
    optionsSuccessStatus: 200,
  });

  const upload = await mux.video.uploads.create({
    cors_origin: req.headers.get('origin') || '', // Set to the actual origin of the request
    new_asset_settings: {
      playback_policy: ["public", "signed"],
      passthrough: JSON.stringify({ userId: session.user?.id }),
    },
  });

  return NextResponse.json({ uploadId: upload.id, uploadUrl: upload.url });
}
