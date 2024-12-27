import db from "@/lib/db";

export const getProjects = async () => {
  try {
    const projects = await db.project.findMany({
      include: {
        deliverables: {
          include: {
            tasks: true,
          },
        },
      },
    });
    return projects;
  } catch (error) {
    return [];
  }
};
