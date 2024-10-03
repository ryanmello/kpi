"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";

const ProjectCard = ({ project }: { project: Project }) => {
  const router = useRouter();
  return (
    <Card
      key={project.id}
      className="cursor-pointer hover:border-zinc-600"
      onClick={() => router.push(`/projects/${project.id}`)}
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
  );
};

export default ProjectCard;
