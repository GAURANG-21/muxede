import { prisma } from "@/utils/prisma";

type PlaybackId = {
  id: string;
  policy: "signed" | "public";
};

type VideoData = {
  upload_id: string;
  playback_ids: PlaybackId[];
  status: string;
};

type Props = {
  data: VideoData;
  metadata: { userId: string };
};

const handler = async ({ data }: Props) => {
  const { upload_id, playback_ids, status } = data;

  await prisma.video.updateMany({
    where: {
      uploadId: upload_id,
      status: { not: "ready" },
    },
    data: {
      publicPlaybackId:
        playback_ids.find((row) => row.policy === "public")?.id ?? null,
      privatePlaybackId:
        playback_ids.find((row) => row.policy === "signed")?.id ?? null,
      status,
    },
  });
};

export default handler;
