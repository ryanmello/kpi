import db from "@/lib/db";

export const getDepartments = async () => {
  try {
    const departments = await db.department.findMany();
    return departments;
  } catch (error) {
    console.log(error);
    return [];
  }
};
