import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const KPITable = ({ kpis }: { kpis: any[] }) => {
  const getMonth = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "long", timeZone: "UTC" });
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
            <TableRow key={kpi.id}>
              <TableCell>{dateString}</TableCell>
              <TableCell>{userName}</TableCell>
              <TableCell>{projectName}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default KPITable;
