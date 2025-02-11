import { prisma } from "@/utils/prisma";
import { auth } from "@/lib/authHelper";
import { NextResponse } from "next/server";

// ✅ POST Request Handler
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const lessonId = (await params).id;
    if (!lessonId)
      return NextResponse.json({ error: "Missing lesson ID" }, { status: 400 });

    const userId = session.user.id;
    if (!userId)
      throw new Error("Cannot create lesson progress: missing user ID");

    const progress = await prisma.userLessonProgress.create({
      data: {
        lessonId: parseInt(lessonId),
        userId,
      },
    });

    return NextResponse.json(progress, { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
