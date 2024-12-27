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
    // console.log(requestData);

    const { userId, month, projectId, projectKPI, deliverableKPIs, taskKPIs } =
      requestData;

    // Convert month to a valid Date object
    const parsedMonth = new Date(`${month}-01T00:00:00.000Z`); // Append 'T00:00:00.000Z' to match the desired format

    // Create the ProjectKPI record
    const createdProjectKPI = await db.projectKPI.create({
      data: {
        name: projectKPI.name,
        status: projectKPI.status,
      },
    });

    // Create the KPI record (Project-level KPI)
    const createdKPI = await db.kPI.create({
      data: {
        userId,
        month: parsedMonth, // Use parsed month as Date
        projectKPIId: createdProjectKPI.id, // Link to the created ProjectKPI
      },
    });

    // Create DeliverableKPIs and associate with the created ProjectKPI
    const createdDeliverables = await Promise.all(
      deliverableKPIs.map(async (deliverable: any) => {
        const createdDeliverable = await db.deliverableKPI.create({
          data: {
            name: deliverable.name,
            progress: parseFloat(deliverable.progress), // Ensure progress is a number
            status: deliverable.status,
            comments: deliverable.comments,
            projectId: createdProjectKPI.id,
          },
        });

        return createdDeliverable; // Return just the created Deliverable
      })
    );

    // Create TaskKPIs for each task from the received taskKPIs array
    const createdTasks = await Promise.all(
      taskKPIs.map(async (task: any) => {
        // Ensure both startDate and endDate are in correct format and handle time zone
        const parsedStartDate = new Date(task.startDate); // Convert to Date object
        const parsedEndDate = task.endDate ? new Date(task.endDate) : null; // Convert to Date if provided

        // Format dates to ensure they're in the correct ISO 8601 format
        const formattedStartDate = parsedStartDate.toISOString(); // Ensures proper ISO format with time zone
        const formattedEndDate = parsedEndDate
          ? parsedEndDate.toISOString()
          : null; // Format endDate if available

        console.log("Creating TaskKPI for:", task.description);

        return db.taskKPI.create({
          data: {
            description: task.description,
            startDate: formattedStartDate, // Use formatted startDate
            endDate: formattedEndDate, // Use formatted endDate
            timeSpent: task.timeSpent,
            progress: parseFloat(task.progress), // Ensure progress is a number
            status: task.status,
            comments: task.comments,
            deliverableId: task.deliverableId, // Link to the correct DeliverableKPI
          },
        });
      })
    );

    return NextResponse.json(createdKPI);
  } catch (error) {
    console.log("/api/kpi/create", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
