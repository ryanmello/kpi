import { auth } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = await getUserByEmail(session?.user?.email);

    if (user == null || user.role != "admin")
      return new NextResponse("Unauthorized", { status: 401 });

    const requestData = await req.json();
    const { name, progress, status, comments, projectId } = requestData;

    const deliverable = await db.deliverable.create({
      data: {
        name,
        progress,
        status,
        comments,
        projectId,
      },
    });

    return NextResponse.json(deliverable);
  } catch (error) {
    console.log("/api/deliverable/create", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
