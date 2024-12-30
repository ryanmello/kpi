import db from "@/lib/db";

export const getKPIById = async (kpiId: string) => {
  try {
    const KPI = await db.kPI.findUnique({
      where: {
        id: kpiId,
      },
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
    });
    return KPI;
  } catch (error) {
    console.log(error);
    return null;
  }
};
