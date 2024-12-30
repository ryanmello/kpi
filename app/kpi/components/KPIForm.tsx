"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { User } from "@prisma/client";
import { ProjectT } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const KPIForm = ({
  users,
  projects,
}: {
  users: User[];
  projects: ProjectT[];
}) => {
  const router = useRouter();
  const { control, handleSubmit, watch, setValue, reset } = useForm();
  const [selectedProject, setSelectedProject] = useState<ProjectT | null>(null);

  const onSubmit = async (data: any) => {
    try {
      await axios.post("/api/kpi/create", data);
      toast({
        title: "Success",
        description: "KPI created successfully!",
        variant: "default",
      });
      reset();
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Something went wrong. ${error.data}`,
        variant: "destructive",
      });
    }
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId) || null;
    setSelectedProject(project);

    if (project) {
      setValue("projectKPI", {
        name: project.name,
        status: project.status,
      });

      setValue(
        "deliverableKPIs",
        project.deliverables.map((deliverable) => ({
          id: deliverable.id,
          name: deliverable.name,
          progress: deliverable.progress || 0,
          status: deliverable.status,
          comments: deliverable.comments || "",
        }))
      );

      setValue(
        "taskKPIs",
        project.deliverables.flatMap((deliverable) =>
          deliverable.tasks.map((task) => ({
            ...task,
            deliverableId: deliverable.id,
          }))
        )
      );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="container mx-auto mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Create KPI</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Select User */}
            <div>
              <Label htmlFor="user">User</Label>
              <Controller
                name="userId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Select Month */}
            <div>
              <label className="block font-medium">Month</label>
              <Controller
                name="month"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="month"
                    value={field.value || ""}
                    className="border rounded px-4 py-2 w-full"
                  />
                )}
              />
            </div>

            {/* Select Project */}
            <div>
              <Label htmlFor="project">Project</Label>
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleProjectChange(value);
                    }}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Project KPI Fields */}
            {selectedProject && (
              <div>
                <h3 className="font-semibold">Project KPI</h3>
                <div className="space-y-4">
                  <Controller
                    name="projectKPI.name"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label>Name</Label>
                        <Input {...field} type="text" />
                      </div>
                    )}
                  />
                  <Controller
                    name="projectKPI.status"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label>Status</Label>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Started">
                              Not Started
                            </SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Deliverable KPI Fields */}
            {watch("deliverableKPIs")?.map(
              (deliverable: any, index: number) => (
                <div key={index}>
                  <h4 className="font-medium">Deliverable {index + 1}</h4>
                  <div className="space-y-4">
                    {/* Name */}
                    <Controller
                      name={`deliverableKPIs.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Label>Name</Label>
                          <Input {...field} type="text" />
                        </div>
                      )}
                    />

                    {/* Progress */}
                    <Controller
                      name={`deliverableKPIs.${index}.progress`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Label>Progress</Label>
                          <Input {...field} type="number" min={0} max={100} />
                        </div>
                      )}
                    />

                    {/* Status */}
                    <Controller
                      name={`deliverableKPIs.${index}.status`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Label>Status</Label>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Not Started">
                                Not Started
                              </SelectItem>
                              <SelectItem value="In Progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="Completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />

                    {/* Comments */}
                    <Controller
                      name={`deliverableKPIs.${index}.comments`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Label>Comments</Label>
                          <Input {...field} type="text" />
                        </div>
                      )}
                    />
                  </div>
                </div>
              )
            )}

            {/* Task KPI Fields */}
            {watch("taskKPIs")?.map((task: any, index: number) => (
              <div key={index}>
                <h4 className="font-medium">Task {index + 1}</h4>
                <div className="space-y-4">
                  {/* Description */}
                  <Controller
                    name={`taskKPIs.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label>Description</Label>
                        <Input {...field} type="text" />
                      </div>
                    )}
                  />

                  {/* Start Date */}
                  <Controller
                    name={`taskKPIs.${index}.startDate`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          {...field}
                          type="date"
                          value={field.value ? formatDate(field.value) : ""}
                        />
                      </div>
                    )}
                  />

                  {/* End Date */}
                  <Controller
                    name={`taskKPIs.${index}.endDate`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label>End Date</Label>
                        <Input
                          {...field}
                          type="date"
                          value={field.value ? formatDate(field.value) : ""}
                        />
                      </div>
                    )}
                  />

                  {/* Status */}
                  <Controller
                    name={`taskKPIs.${index}.status`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label>Status</Label>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Started">
                              Not Started
                            </SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />

                  {/* Time Spent */}
                  <Controller
                    name={`taskKPIs.${index}.timeSpent`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label>Time Spent</Label>
                        <Input {...field} type="number" min={0} step={0.1} />
                      </div>
                    )}
                  />

                  {/* Progress */}
                  <Controller
                    name={`taskKPIs.${index}.progress`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label>Progress</Label>
                        <Input {...field} type="number" min={0} max={100} />
                      </div>
                    )}
                  />

                  {/* Comments */}
                  <Controller
                    name={`taskKPIs.${index}.comments`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label>Comments</Label>
                        <Input {...field} type="text" />
                      </div>
                    )}
                  />
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIForm;
