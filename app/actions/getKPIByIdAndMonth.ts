import db from "@/lib/db";

export const getKPIByIdAndMonth = async (
  userId: string,
  month: string,
  year: string
) => {
  const dateString = `${year}-${month}-01T00:00:00.000+00:00`;
  const date = new Date(dateString);

  try {
    const KPI = await db.kPI.findMany({
      where: {
        userId,
        month: date,
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
      },
    });
    return KPI;
  } catch (error) {
    return [];
  }
};
