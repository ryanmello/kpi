import db from "@/lib/db";

export const getPositions = async () => {
  try {
    const positions = await db.position.findMany();
    return positions;
  } catch (error) {
    return [];
  }
};
