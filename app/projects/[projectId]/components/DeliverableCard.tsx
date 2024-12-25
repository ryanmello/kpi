"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { DeliverableT } from "@/types";

const DeliverableCard = ({ deliverable }: { deliverable: DeliverableT }) => {
  const router = useRouter();

  return (
    <Card className={"cursor-pointer hover:border-zinc-600"} onClick={() => {}}>
      <CardHeader>
        <CardTitle>{deliverable.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Badge variant="secondary">{deliverable.status}</Badge>
          {deliverable.progress !== undefined && (
            <span className="text-sm text-zinc-500">{`${deliverable.progress}%`}</span>
          )}
        </div>
        {deliverable.comments && (
          <p className="mt-2 text-sm text-zinc-500">{deliverable.comments}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliverableCard;
