import { getKPIById } from "@/app/actions/getKPIById";
import { DeliverableT, KPI } from "@/types";

const KPICard = async ({ params }: { params: { kpiId: string } }) => {
  const { kpiId } = await params;
  const kpi = await getKPIById(kpiId);

  return (
    <div className="container mx-auto mt-4">
      <p>{kpi?.id}</p>
    </div>
  );
};

export default KPICard;
