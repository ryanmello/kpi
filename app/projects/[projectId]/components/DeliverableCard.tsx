"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { DeliverableT } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeliverableTasks from "./DeliverableTasks";

const deliverableSchema = z.object({
  name: z.string().min(2).max(50),
  status: z.enum(["Not Started", "In Progress", "Completed"]),
  comments: z.string().optional(),
});

const DeliverableCard = ({ deliverable }: { deliverable: DeliverableT }) => {
  const router = useRouter();

  const validStatus: "Not Started" | "In Progress" | "Completed" = [
    "Not Started",
    "In Progress",
    "Completed",
  ].includes(deliverable.status)
    ? (deliverable.status as "Not Started" | "In Progress" | "Completed")
    : "Not Started";

  const form = useForm<z.infer<typeof deliverableSchema>>({
    resolver: zodResolver(deliverableSchema),
    defaultValues: {
      name: deliverable.name,
      status: validStatus,
      comments: deliverable.comments || "",
    },
  });

  const progress =
    deliverable.tasks.length > 0
      ? deliverable.tasks.reduce((sum, task) => sum + (task.progress || 0), 0) /
        deliverable.tasks.length
      : 0;

  const { reset } = form;

  const handleUpdate = async (data: z.infer<typeof deliverableSchema>) => {
    try {
      const updatedData = {
        id: deliverable.id,
        ...data,
      };

      const response = await axios.post("/api/deliverable/update", updatedData);
      toast({
        title: "Success",
        description: `Deliverable "${response.data.name}" updated successfully!`,
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
      const response = await axios.post("/api/deliverable/delete", {
        id: deliverable.id,
      });
      toast({
        title: "Success",
        description: `Deliverable "${response.data.name}" deleted`,
        variant: "default",
      });
      reset();
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
    <Card onClick={() => {}}>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>{deliverable.name}</CardTitle>
        </div>
        <div className="flex">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Update Deliverable</DialogTitle>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleUpdate)}
                  className="space-y-4"
                >
                  <FormField
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Deliverable Name" {...field} />
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
                        <FormLabel>Project Status</FormLabel>
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
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comments</FormLabel>
                        <FormControl>
                          <Input placeholder="Comments" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Update Deliverable
                  </Button>
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
                Are you sure you want to delete this deliverable?
              </DialogDescription>
              <div className="flex space-x-4">
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button variant="destructive" onClick={() => handleDelete()}>
                    Delete
                  </Button>
                </DialogTrigger>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Badge variant="secondary">{deliverable.status}</Badge>
          <span className="text-sm text-zinc-500">{progress}%</span>
        </div>
        {deliverable.comments && (
          <p className="mt-2 text-sm text-zinc-500">{deliverable.comments}</p>
        )}

        <DeliverableTasks deliverable={deliverable} />
      </CardContent>
    </Card>
  );
};

export default DeliverableCard;
