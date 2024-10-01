import db from "@/lib/db";

export const getProjects = async () => {
  try {
    const projects = await db.project.findMany();
    return projects;
  } catch (error) {
    return [];
  }
};
