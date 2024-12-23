import { auth } from "@/auth";
import { getUserByEmail } from "@/data/user";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = await getUserByEmail(session?.user?.email);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { userId, name, username, positionId, departmentId, supervisorId } =
      body;

    if (!userId) {
      return new NextResponse("User Id is required", { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        username,
        positionId,
        departmentId,
        supervisorId,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("/api/user/update", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
