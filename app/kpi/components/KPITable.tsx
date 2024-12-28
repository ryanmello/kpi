"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const KPITable = ({ kpis }: { kpis: any[] }) => {
  const router = useRouter();

  const getMonth = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "long", timeZone: "UTC" });
  };

  const handleButtonClick = (kpiId: string) => {
    router.push(`/kpi/${kpiId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Project</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {kpis.map((kpi) => {
          const dateString = getMonth(kpi.month);
          const userName = kpi.user.name;
          const projectName = kpi.projectKPI.name;

          return (
            <TableRow key={kpi.id} className="cursor-pointer">
              <TableCell>{dateString}</TableCell>
              <TableCell>{userName}</TableCell>
              <TableCell>{projectName}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="link"
                  onClick={() => handleButtonClick(kpi.id)}
                  className=""
                >
                  <ArrowRight />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default KPITable;
