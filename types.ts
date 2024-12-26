export type TaskT = {
  id: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  timeSpent?: number;
  progress?: number;
  status: string;
  comments?: string;
  deliverableId: string;
};

export type DeliverableT = {
  id: string;
  name: string;
  progress?: number;
  status: string;
  comments?: string;
  tasks: TaskT[];
  projectId: string;
};

export type ProjectT = {
  id: string;
  name: string;
  status: string;
  deliverables: DeliverableT[];
  tasks: TaskT[];
  kpis?: any[];
};



