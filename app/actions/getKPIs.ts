import db from "@/lib/db";

export const getKPIs = async () => {
  try {
    const KPI = await db.kPI.findMany({
      include: {
        projectKPI: {
          include: {
            deliverables: {
              include: {
                tasks: true,
              },
            },
          },
        },
        user: true,
      },
      orderBy: {
        month: "asc",
      },
    });
    return KPI;
  } catch (error) {
    return [];
  }
};
