import { getProjectById } from "@/app/actions/getProjectById";
import { ProjectT } from "@/types";
import React from "react";
import CreateDeliverableModal from "./components/CreateDeliverableModal";
import DeliverableCard from "./components/DeliverableCard";
import ProjectCard from "../components/ProjectCard";

const Project = async ({ params }: { params: { projectId: string } }) => {
  const { projectId } = await params;
  const project = (await getProjectById(projectId)) as ProjectT;

  return (
    <div className="container mx-auto mt-4 mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Project</h2>
      </div>

      <ProjectCard project={project} disableClick={true} />

      <div className="flex justify-between items-center my-6">
        <h2 className="text-2xl font-semibold">Deliverables</h2>
        <CreateDeliverableModal projectId={projectId} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {project.deliverables.map((deliverable) => (
          <DeliverableCard key={deliverable.id} deliverable={deliverable} />
        ))}
      </div>

      {project.deliverables.length === 0 && (
        <p className="text-muted-foreground mt-8">No deliverables found.</p>
      )}
    </div>
  );
};

export default Project;
