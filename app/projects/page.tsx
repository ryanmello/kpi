import { getProjects } from "../actions/getProjects";
import CreateProjectModal from "./components/CreateProjectModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          <Card
            key={project.id}
            className="cursor-pointer hover:border-zinc-600"
          >
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">{project.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No projects found. Create your first project!
        </p>
      )}
    </div>
  );
};

export default Projects;
