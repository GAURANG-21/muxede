import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    console.log("Type of webhooks:", type);
    console.log("Webhook data:", data);

    // Handle asset.created event
    if (type === "video.asset.created") {
      try {
        const metadata = JSON.parse(data.passthrough);
        const video = await prisma.video.create({
          data: {
            uploadId: data.upload_id,
            ownerId: metadata.userId,
            publicPlaybackId: data.playback_ids?.[0]?.id || null,
            privatePlaybackId: data.playback_ids?.[1]?.id || null,
            duration: data.duration || null,
            aspectRatio: data.aspect_ratio || null,
            status: data.status,
          },
        });
        console.log("Created video record:", video);
        return NextResponse.json(video, { status: 200 });
      } catch (error) {
        console.error("Error creating video record:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    // Handle asset.ready event
    if (type === "video.asset.ready") {
      try {
        const video = await prisma.video.update({
          where: { uploadId: data.upload_id },
          data: {
            publicPlaybackId: data.playback_ids?.[0]?.id || null,
            privatePlaybackId: data.playback_ids?.[1]?.id || null,
            duration: data.duration || null,
            aspectRatio: data.aspect_ratio || null,
            status: "ready",
          },
        });
        console.log("Updated video record:", video);
        return NextResponse.json(video, { status: 200 });
      } catch (error) {
        console.error("Error updating video record:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
