import { getKPIs } from "../actions/getKPIs";
import { getProjects } from "../actions/getProjects";
import { getUsers } from "../actions/getUsers";
import KPIForm from "./components/KPIForm";
import KPITable from "./components/KPITable";

const KPIs = async () => {
  const users = await getUsers();
  const projects = await getProjects();
  const kpis = await getKPIs();

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-2xl font-semibold mb-8">KPIs</h1>
      <div className="flex flex-col-reverse md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <KPITable kpis={kpis} />
        </div>
        <div className="w-full md:w-1/2">
          <KPIForm users={users} projects={projects} />
        </div>
      </div>
    </div>
  );
};

export default KPIs;
