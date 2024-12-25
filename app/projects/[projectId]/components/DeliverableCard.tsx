"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { DeliverableT } from "@/types";
import {
  Dialog,
  DialogContent,
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
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const deliverableSchema = z.object({
  name: z.string().min(2).max(50),
  status: z.enum(["Not Started", "In Progress", "Completed"]),
  progress: z.string().min(1).max(3),
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
      progress: deliverable.progress?.toString(),
      comments: deliverable.comments,
    },
  });

  const { reset } = form;

  const handleUpdate = async (data: z.infer<typeof deliverableSchema>) => {
    try {
      const updatedData = {
        id: deliverable.id,
        ...data,
        progress: Number(data.progress),
      };

      const response = await axios.post("/api/deliverable/update", updatedData);
      toast({
        title: "Success",
        description: `Deliverable "${response.data.name}" updated successfully!`,
        variant: "default",
      });
      reset();
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
        <div className="flex space-x-2">
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
                    name="progress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Progress (%)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Progress"
                            {...field}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Input placeholder="Status" {...field} />
                        </FormControl>
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
              <DialogTitle>
                Are you sure you want to delete this deliverable?
              </DialogTitle>
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
