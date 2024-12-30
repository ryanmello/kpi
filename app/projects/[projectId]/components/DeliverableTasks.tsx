"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { DeliverableT } from "@/types";
import TaskCard from "./TaskCard";

const taskSchema = z.object({
  description: z.string().min(1),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Start date must be a valid date.",
  }),
  endDate: z
    .string()
    .optional()
    .refine((date) => date === undefined || !isNaN(Date.parse(date)), {
      message: "End date must be a valid date.",
    }),
  progress: z
    .number()
    .optional()
    .refine((val) => val === undefined || (val >= 0 && val <= 100), {
      message: "Progress achieved must be a number between 0 and 100.",
    }),
  status: z.enum(["Not Started", "In Progress", "Completed"]),
  comments: z.string().optional(),
});

const DeliverableTasks = ({ deliverable }: { deliverable: DeliverableT }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      description: "",
      startDate: "",
      endDate: "",
      progress: 0,
      status: "Not Started",
      comments: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof taskSchema>) => {
    try {
      const updatedData = {
        deliverableId: deliverable.id,
        ...data,
      };

      await axios.post("/api/task/create", updatedData);
      toast({
        title: "Success",
        description: "Task created successfully!",
        variant: "default",
      });
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create the task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Tasks</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add Task</DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Task Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="startDate"
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
                      <FormLabel>Deliverable Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="progress"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progress Achieved</FormLabel>
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
                  name="comments"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any comments"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogTrigger asChild>
                  <Button type="submit" className="w-full">
                    Create Task
                  </Button>
                </DialogTrigger>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {deliverable.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default DeliverableTasks;
