import db from "@/lib/db";

export const getUsers = async () => {
  try {
    const users = await db.user.findMany();
    return users;
  } catch (error) {
    return [];
  }
};
