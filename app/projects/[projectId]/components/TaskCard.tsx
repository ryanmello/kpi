"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarIcon,
  ClockIcon,
  MessageSquareIcon,
  MoreVertical,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { DeliverableT, TaskT } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const taskSchema = z.object({
  description: z.string(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Start date must be a valid date.",
  }),
  endDate: z
    .string()
    .optional()
    .refine((date) => date === undefined || !isNaN(Date.parse(date)), {
      message: "End date must be a valid date.",
    }),
  timeSpent: z
    .number()
    .optional()
    .refine((val) => val === undefined || val >= 0, {
      message: "Time spent must be a non-negative number.",
    }),
    progress: z
    .number()
    .optional()
    .refine((val) => val === undefined || (val >= 0 && val <= 100), {
      message: "Progress achieved must be a number between 0 and 100.",
    }),
  status: z.enum(["Not Started", "In Progress", "Completed"]),
  comments: z.string().optional(),
  deliverableId: z.string(),
});

const TaskCard = ({ task }: { task: TaskT }) => {
  const router = useRouter();

  const validStatus: "Not Started" | "In Progress" | "Completed" = [
    "Not Started",
    "In Progress",
    "Completed",
  ].includes(task.status)
    ? (task.status as "Not Started" | "In Progress" | "Completed")
    : "Not Started";

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      description: task.description,
      status: validStatus,
      startDate: task.startDate
        ? new Date(task.startDate).toISOString().slice(0, 10)
        : undefined,
      endDate: task.endDate
        ? new Date(task.endDate).toISOString().slice(0, 10)
        : undefined,
      timeSpent: task.timeSpent ?? undefined,
      progress: task.progress ?? undefined,
      comments: task.comments ?? undefined,
      deliverableId: task.deliverableId,
    },
  });

  const handleUpdate = async (data: z.infer<typeof taskSchema>) => {
    try {
      const updatedData = {
        id: task.id,
        ...data,
      };

      await axios.post("/api/task/update", updatedData);
      toast({
        title: "Success",
        description: `Task updated successfully!`,
        variant: "default",
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating deliverable:", error);
      toast({
        title: "Error",
        description: "Failed to update deliverable. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post("/api/task/delete", {
        id: task.id,
      });
      toast({
        title: "Success",
        description: `Task deleted`,
        variant: "default",
      });
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error deleting deliverable:", error);
      toast({
        title: "Error",
        description: "Failed to delete deliverable. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      key={task.id}
      className="overflow-hidden transition-shadow hover:shadow-lg mb-4"
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold line-clamp-2">
              {task.description}
            </h3>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Edit Task</DialogTitle>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleUpdate)}
                      className="space-y-4"
                    >
                      <FormField
                        name="description"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="startDate"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="endDate"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="status"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="progress"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Progress Achieved (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="timeSpent"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Spent (hours)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="comments"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comments</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-4 mt-4">
                        <DialogTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogTrigger>
                        <Button type="submit">Save</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this task?
                  </DialogDescription>
                  <div className="flex space-x-4">
                    <DialogTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogTrigger>
                    <DialogTrigger asChild onClick={() => handleDelete()}>
                      <Button variant="destructive">Delete</Button>
                    </DialogTrigger>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4" />
            <span>
              {new Date(task.startDate).toLocaleDateString()} -{" "}
              {task.endDate
                ? new Date(task.endDate).toLocaleDateString()
                : "Ongoing"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <Badge
              variant={task.status === "Completed" ? "default" : "secondary"}
              className="text-xs font-medium"
            >
              {task.status}
            </Badge>
            {task.progress !== undefined && (
              <div className="text-sm font-medium">
                Progress: {task.progress}%
              </div>
            )}
          </div>

          {task.timeSpent !== undefined && (
            <div className="flex items-center space-x-2 text-sm">
              <ClockIcon className="w-4 h-4 text-gray-400" />
              <span>{task.timeSpent} hours spent</span>
            </div>
          )}

          {task.comments && (
            <div className="pt-2 mt-2 border-t border-gray-200">
              <div className="flex items-start space-x-2">
                <MessageSquareIcon className="w-4 h-4 mt-1 text-gray-400" />
                <p className="text-sm text-gray-600">{task.comments}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
