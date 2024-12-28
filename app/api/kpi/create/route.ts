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
    const deliverableIdMap = createdDeliverables.reduce(
      (map: any, deliverable: any, index: number) => {
        map[deliverableKPIs[index].id] = deliverable.id; // Match original deliverableKPIs.id to createdDeliverable.id
        return map;
      },
      {}
    );

    // Create TaskKPIs with correct deliverable associations
    const createdTasks = await Promise.all(
      taskKPIs.map(async (task: any) => {
        const associatedDeliverableId = deliverableIdMap[task.deliverableId];

        if (!associatedDeliverableId) {
          throw new Error(
            `No associated DeliverableKPI found for task: ${task.description}`
          );
        }

        console.log("Creating TaskKPI for:", task.description);

        // Validate start and end dates
        const startDate = new Date(task.startDate);
        if (isNaN(startDate.getTime())) {
          throw new Error(`Invalid start date for task: ${task.description}`);
        }

        const endDate = task.endDate ? new Date(task.endDate) : null;
        if (endDate && isNaN(endDate.getTime())) {
          throw new Error(`Invalid end date for task: ${task.description}`);
        }

        // Validate progress and timeSpent
        const progress = parseFloat(task.progress);
        if (isNaN(progress)) {
          throw new Error(
            `Invalid progress value for task: ${task.description}`
          );
        }

        const timeSpent = parseFloat(task.timeSpent);
        if (isNaN(timeSpent)) {
          throw new Error(
            `Invalid timeSpent value for task: ${task.description}`
          );
        }

        return db.taskKPI.create({
          data: {
            description: task.description,
            startDate: startDate.toISOString(), // Convert to ISO string
            endDate: endDate ? endDate.toISOString() : null, // Handle nullable endDate
            timeSpent: timeSpent,
            progress: progress,
            status: task.status,
            comments: task.comments,
            deliverableId: associatedDeliverableId, // Link to the correct created DeliverableKPI
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
