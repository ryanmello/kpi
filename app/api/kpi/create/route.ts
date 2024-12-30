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

    const { userId, month, projectId, projectKPI, deliverableKPIs, taskKPIs } =
      requestData;

    const parsedMonth = new Date(`${month}-01T00:00:00.000Z`);

    // Create the ProjectKPI record
    const createdProjectKPI = await db.projectKPI.create({
      data: {
        name: projectKPI.name,
        status: projectKPI.status,
      },
    });

    // updated project
    await db.project.update({
      where: {
        id: projectId,
      },
      data: {
        name: createdProjectKPI.name,
        status: createdProjectKPI.status,
      },
    });

    // Create the KPI record (Project-level KPI)
    const createdKPI = await db.kPI.create({
      data: {
        userId,
        month: parsedMonth,
        projectKPIId: createdProjectKPI.id,
      },
    });

    // Create DeliverableKPIs and associate with the created ProjectKPI
    const createdDeliverables = await Promise.all(
      deliverableKPIs.map(async (deliverable: any) => {
        const createdDeliverable = await db.deliverableKPI.create({
          data: {
            name: deliverable.name,
            progress: parseFloat(deliverable.progress),
            status: deliverable.status,
            comments: deliverable.comments,
            projectId: createdProjectKPI.id,
          },
        });

        // update existing deliverable
        await db.deliverable.update({
          where: {
            id: deliverable.id,
          },
          data: {
            name: deliverable.name,
            progress: parseFloat(deliverable.progress),
            status: deliverable.status,
            comments: deliverable.comments,
          },
        });

        return createdDeliverable;
      })
    );

    // Create TaskKPIs for each task from the received taskKPIs array
    const deliverableIdMap = createdDeliverables.reduce(
      (map: any, deliverable: any, index: number) => {
        map[deliverableKPIs[index].id] = deliverable.id;
        return map;
      },
      {}
    );

    // Create TaskKPIs with correct deliverable associations
    await Promise.all(
      taskKPIs.map(async (task: any) => {
        const associatedDeliverableId = deliverableIdMap[task.deliverableId];

        if (!associatedDeliverableId) {
          throw new Error(
            `No associated DeliverableKPI found for task: ${task.description}`
          );
        }

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

        const createdTaskKPI = await db.taskKPI.create({
          data: {
            description: task.description,
            startDate: startDate.toISOString(),
            endDate: endDate ? endDate.toISOString() : null,
            timeSpent: timeSpent,
            progress: progress,
            status: task.status,
            comments: task.comments,
            deliverableId: associatedDeliverableId,
          },
        });

        await db.task.update({
          where: {
            id: task.id,
          },
          data: {
            description: task.description,
            startDate: startDate.toISOString(),
            endDate: endDate ? endDate.toISOString() : null,
            progress: progress,
            status: task.status,
            comments: task.comments,
          },
        });

        return createdTaskKPI;
      })
    );

    return NextResponse.json(createdKPI);
  } catch (error) {
    console.log("/api/kpi/create", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
