import { getProjects } from "../actions/getProjects";
import { getUsers } from "../actions/getUsers";
import KPIForm from "./components/KPIForm";

const KPI = async () => {
  const users = await getUsers();
  const projects = await getProjects();

  return (
    <div className="container mx-auto mt-4">
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-semibold">KPIs</h1>
        <KPIForm users={users} projects={projects} />
      </div>
    </div>
  );
};

export default KPI;
