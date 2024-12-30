import db from "@/lib/db";

export const getProjectById = async (projectId: string) => {
  try {
    const project = await db.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        deliverables: {
          include: {
            tasks: true,
          },
        },
      },
    });
    return project;
  } catch (error) {
    console.log(error);
    return null;
  }
};
