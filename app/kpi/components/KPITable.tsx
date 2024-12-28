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
    return date.toLocaleString("default", { month: "long" });
  };

  

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Months in Quarter</TableHead>
          <TableHead>User Name</TableHead>
          <TableHead>Deliverable Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {kpis.map((kpi) => {
          const dateString = getMonth(kpi.month);
          const userName = kpi.user.name; // Assuming `user` has a `name` field
          const deliverables = kpi.projectKPI.deliverables;

          return deliverables.map((deliverable: any) => (
            <TableRow key={deliverable.id}>
              <TableCell>{dateString}</TableCell>
              <TableCell>{userName}</TableCell>
              <TableCell>{deliverable.name}</TableCell>
            </TableRow>
          ));
        })}
      </TableBody>
    </Table>
  );
};

export default KPITable;
