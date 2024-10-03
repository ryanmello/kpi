import { getProjectById } from "@/app/actions/getProjectById";
import React from "react";

const Project = async ({ params }: { params: { projectId: string } }) => {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  
  return (
    <div className="container mx-auto mt-4">
      <p>{project?.id}</p>
    </div>
  );
};

export default Project;
