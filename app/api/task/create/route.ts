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
    const {
      description,
      startDate,
      endDate,
      timeSpent,
      progress,
      status,
      comments,
      deliverableId,
    } = requestData;

    const formattedStartDate = new Date(startDate);
    const formattedEndDate = endDate ? new Date(endDate) : null;

    const task = await db.task.create({
      data: {
        description,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        timeSpent,
        progress,
        status,
        comments,
        deliverableId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log("/api/task/create", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
