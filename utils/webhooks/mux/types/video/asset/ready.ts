import { prisma } from "@/utils/prisma";

type PlaybackId = {
  id: string;
  policy: "signed" | "public";
};

type VideoData = {
  upload_id: string;
  playback_ids: PlaybackId[];
  duration: number;
  status: string;
  aspect_ratio: string;
};

type Props = {
  data: VideoData;
  metadata: { userId: string };
};

const handler = async ({ data }: Props) => {
  const { upload_id, playback_ids, duration, status, aspect_ratio } = data;

  await prisma.video.update({
    where: {
      uploadId: upload_id,
    },
    data: {
      publicPlaybackId:
        playback_ids.find((row) => row.policy === "public")?.id ?? null,
      privatePlaybackId:
        playback_ids.find((row) => row.policy === "signed")?.id ?? null,
      duration,
      aspectRatio: aspect_ratio,
      status,
    },
  });
};

export default handler;
