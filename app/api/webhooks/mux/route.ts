import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    console.log("Type of webhooks:", type);
    // const exist = await prisma.video.findFirst({
    //   where: {
    //     uploadId: data.upload_id
    //   }
    // })
    // console.log("Existing: ", !!exist)
    // if(exist && data.status==="ready") return;
    if (data.status === "waiting") {
      console.log("Waiting is over ");
    }
    if (data.status === "asset_created") {
      console.log("Asset is created");
    }
    if (data.status === "preparing") {
      // console.log("Asset prepared: \n", data);
      try {
        const metadata = await JSON.parse(data.passthrough);
        await prisma.video.create({
          data: {
            uploadId: data.upload_id,
            ownerId: metadata.userId, // Ensure passthrough exists
            publicPlaybackId:
              data.playback_ids?.[
                data.playback_ids[0].policy === "public" ? 0 : 1
              ]?.id || null,
            privatePlaybackId:
              data.playback_ids?.[
                data.playback_ids[0].policy === "public" ? 1 : 0
              ]?.id || null,
            duration: data.duration || null,
            aspectRatio: data.aspect_ratio || null,
            status: data.status,
          },
        });

        // console.log("Prepared asset is: \n", created);
      } catch (error) {
        console.error("Error creating video instance:", error);
      }
    }
    if (data.status === "ready") {
      const updated = await prisma.video.update({
        where: { uploadId: data.upload_id },
        data: {
          publicPlaybackId: data.playback_ids?.[0]?.id || null,
          privatePlaybackId: data.playback_ids?.[1]?.id || null,
          duration: data.duration || null,
          aspectRatio: data.aspect_ratio || null,
          status: data.status, // Update status to 'ready'
        },
      });
      // console.log("i am ready and updated: ", updated);
      return new NextResponse(JSON.stringify(updated), { status: 200 });
    }
    return new NextResponse(data, { status: 200 });
  } catch {
    return new NextResponse("Internal Server Error", { status: 413 });
  }
}
