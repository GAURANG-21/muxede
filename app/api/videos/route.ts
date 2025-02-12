import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Mux from "@mux/mux-node";

const mux = new Mux();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  const upload = await mux.video.uploads.create({
    cors_origin: "*",
    new_asset_settings: {
      playback_policy: ["public", "signed"],
      passthrough: JSON.stringify({ userId: session.user?.id }),
    },
  });

  return NextResponse.json({ uploadId: upload.id, uploadUrl: upload.url });
}
