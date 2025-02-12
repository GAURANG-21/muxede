import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Mux from "@mux/mux-node";

// Initialize Mux with required credentials
const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      return NextResponse.json(
        { error: "Mux credentials not configured" },
        { status: 500 }
      );
    }

    const upload = await video.uploads.create({
      cors_origin: process.env.NEXT_PUBLIC_APP_URL || "*",
      new_asset_settings: {
        playback_policy: ["public"],
        passthrough: JSON.stringify({ userId: session.user?.id }),
      },
    });

    return NextResponse.json({ uploadId: upload.id, uploadUrl: upload.url });
  } catch (error) {
    console.error("Mux upload error:", error);
    return NextResponse.json(
      { error: "Failed to create upload" },
      { status: 500 }
    );
  }
}