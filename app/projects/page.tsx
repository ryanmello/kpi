import { getProjects } from "../actions/getProjects";
import CreateProjectModal from "./components/CreateProjectModal";
import ProjectCard from "./components/ProjectCard";

const Projects = async () => {
  const projects = await getProjects();

  return (
    <div className="container mx-auto mt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <CreateProjectModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            disableClick={false}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-muted-foreground mt-8">
          No projects found. Create your first project!
        </p>
      )}
    </div>
  );
};

export default Projects;
