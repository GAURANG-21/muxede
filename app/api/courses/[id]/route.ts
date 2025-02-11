import { prisma } from "@/utils/prisma";
import { auth } from "@/lib/authHelper";
import { NextResponse } from "next/server";

// GET Request Handler
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Directly access params without awaiting
) {
  const courseId = (await params).id; // Directly access the id
  if (!courseId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId, 10) }, // Specify radix for parseInt
      include: {
        lessons: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT Request Handler
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Directly access params without awaiting
) {
  const courseId = (await params).id; // Directly access the id
  if (!courseId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description } = await req.json();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Cannot update course: missing user id");

    // Check if the course exists and belongs to the user
    const existingCourse = await prisma.course.findFirst({
      where: {
        id: parseInt(courseId, 10), // Specify radix for parseInt
        authorId: userId, // Assuming `authorId` is the correct field name in Prisma schema
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Unauthorized or Course Not Found" },
        { status: 403 }
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(courseId, 10) }, // Specify radix for parseInt
      data: { name, description },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}