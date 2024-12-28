import { getKPIById } from "@/app/actions/getKPIById";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const KPICard = async ({ params }: { params: { kpiId: string } }) => {
  const { kpiId } = await params;
  const kpi = await getKPIById(kpiId);

  if (!kpi) {
    return (
      <div className="container mx-auto mt-4">
        <p>KPI not found</p>
      </div>
    );
  }

  console.log(kpi.projectKPI.deliverables);

  return (
    <div className="container mx-auto mt-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>KPI Details</CardTitle>
          <CardDescription>{kpi.projectKPI?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div>
              <strong>KPI ID:</strong> <span>{kpi.id}</span>
            </div>
            <div>
              <strong>Month:</strong>{" "}
              <span>
                {new Date(kpi.month).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div>
              <strong>User ID:</strong> <span>{kpi.userId}</span>
            </div>
            <div>
              <strong>Project Name:</strong>{" "}
              <span>{kpi.projectKPI?.name || "N/A"}</span>
            </div>
            <div>
              <strong>Project Status:</strong>{" "}
              <span>{kpi.projectKPI?.status || "N/A"}</span>
            </div>
          </div>

          {/* Render Deliverables */}
          {kpi.projectKPI?.deliverables?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-lg">Deliverables:</h3>
              <ul className="list-disc pl-6">
                {kpi.projectKPI.deliverables.map((deliverable) => (
                  <li key={deliverable.id} className="mt-2">
                    <div>
                      <strong>Name:</strong> {deliverable.name}
                    </div>
                    <div>
                      <strong>Status:</strong> {deliverable.status}
                    </div>
                    <div>
                      <strong>Progress:</strong>{" "}
                      {deliverable.progress !== null
                        ? `${deliverable.progress}%`
                        : "N/A"}
                    </div>

                    {/* Render Tasks */}
                    {deliverable.tasks.length > 0 && (
                      <div className="mt-2">
                        <h4 className="font-semibold text-md">Tasks:</h4>
                        <ul className="list-disc pl-4">
                          {deliverable.tasks.map((task) => (
                            <li key={task.id} className="mt-1">
                              <div>
                                <strong>Description:</strong> {task.description}
                              </div>
                              <div>
                                <strong>Status:</strong> {task.status}
                              </div>
                              <div>
                                <strong>Progress:</strong>{" "}
                                {task.progress !== null
                                  ? `${task.progress}%`
                                  : "N/A"}
                              </div>
                              <div>
                                <strong>Time Spent:</strong>{" "}
                                {task.timeSpent !== null
                                  ? `${task.timeSpent} hours`
                                  : "N/A"}
                              </div>
                              <div>
                                <strong>Start Date:</strong>{" "}
                                {new Date(task.startDate).toLocaleDateString()}
                              </div>
                              {task.endDate && (
                                <div>
                                  <strong>End Date:</strong>{" "}
                                  {new Date(task.endDate).toLocaleDateString()}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICard;
