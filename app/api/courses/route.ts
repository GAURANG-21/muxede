import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import slugify from "@sindresorhus/slugify";

// ✅ GET request handler
export async function GET() {
  try {
    const courses = await prisma.course.findMany();
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ✅ POST request handler
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("Session", JSON.stringify(session, null, 2));

    const { name, description } = await req.json();
    const email = session?.user?.email;

    if (!email) {
      throw new Error("Cannot create course: missing email on user record");
    }

    const course = await prisma.course.create({
      data: {
        name,
        description,
        slug: slugify(name),
        author: {
          connect: { email },
        },
      },
    });

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ✅ Handle unsupported methods
export function OPTIONS() {
  return new NextResponse("Method Not Allowed", {
    status: 405,
    headers: { Allow: "GET, POST" },
  });
}
