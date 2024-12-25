"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const ProjectCard = ({
  project,
  disableClick,
}: {
  project: Project;
  disableClick: boolean;
}) => {
  const router = useRouter();

  return (
    <Card
      className={cn(!disableClick && "cursor-pointer hover:border-zinc-600")}
      onClick={() => {
        if (!disableClick) {
          router.push(`/projects/${project.id}`);
        }
      }}
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
