import { getKPIById } from "@/app/actions/getKPIById";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const KPICard = async ({ params }: { params: { kpiId: string } }) => {
  const { kpiId } = await params;
  const kpi = await getKPIById(kpiId);

  if (!kpi) {
    return (
      <div className="container mx-auto mt-4 p-4">
        <p className="text-center text-lg text-gray-400 dark:text-gray-500">
          KPI not found
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <Card className="shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {kpi.projectKPI?.name}
          </CardTitle>
          <CardDescription>
            {new Date(kpi.month).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">User</TableCell>
                <TableCell>{kpi.user.name}</TableCell>
                <TableCell className="font-medium">KPI ID</TableCell>
                <TableCell>{kpi.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Project Name</TableCell>
                <TableCell>{kpi.projectKPI?.name || "N/A"}</TableCell>
                <TableCell className="font-medium">Project Status</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      kpi.projectKPI?.status === "Completed"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {kpi.projectKPI?.status || "N/A"}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {kpi.projectKPI?.deliverables?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Deliverables</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpi.projectKPI.deliverables.map((deliverable) => (
                    <TableRow key={deliverable.id}>
                      <TableCell>{deliverable.name}</TableCell>
                      <TableCell>{deliverable.status}</TableCell>
                      <TableCell>
                        {deliverable.progress !== null ? (
                          <div className="flex items-center gap-4">
                            <p>{deliverable.progress}%</p>
                            <Progress
                              value={deliverable.progress}
                              className="w-full"
                            />
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {kpi.projectKPI.deliverables.map(
                (deliverable) =>
                  deliverable.tasks.length > 0 && (
                    <div key={deliverable.id} className="mt-4">
                      <h4 className="font-semibold text-md mb-2">
                        Tasks for {deliverable.name}
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Time Spent</TableHead>
                            <TableHead>Date Range</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deliverable.tasks.map((task) => (
                            <TableRow key={task.id}>
                              <TableCell>{task.description}</TableCell>
                              <TableCell>{task.status}</TableCell>
                              <TableCell>
                                {task.progress !== null ? (
                                  <div className="flex items-center gap-4">
                                    <p>{task.progress}%</p>
                                    <Progress
                                      value={task.progress}
                                      className="w-full"
                                    />
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                              <TableCell>
                                {task.timeSpent !== null
                                  ? `${task.timeSpent} hours`
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                {`${new Date(
                                  task.startDate
                                ).toLocaleDateString()} - ${
                                  task.endDate
                                    ? new Date(
                                        task.endDate
                                      ).toLocaleDateString()
                                    : "Ongoing"
                                }`}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICard;
