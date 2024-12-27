import { getProjects } from "../actions/getProjects";

const KPI = async () => {
  const projects = await getProjects();
  return (
    <div className="container mx-auto mt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">KPIs</h1>
      </div>
    </div>
  );
};

export default KPI;
