export type TaskT = {
  id: string;
  description: string;
  startDate: Date;
  endDate?: Date | null;
  timeSpent?: number | null;
  progress?: number | null;
  status: string;
  comments?: string | null;
  deliverableId: string;
};

export type DeliverableT = {
  id: string;
  name: string;
  status: string;
  comments?: string | null;
  tasks: TaskT[];
  projectId: string;
  project?: ProjectT;
};

export type ProjectT = {
  id: string;
  name: string;
  status: string;
  deliverables: DeliverableT[];
  kpis?: any[];
};

export type ProjectKPI = {
  id: string;
  name: string;
  status: string;
  deliverables: DeliverableT[];
};

export type KPI = {
  id: string;
  userId: string;
  month: Date; // Already matches the Date type in the provided data
  projectKPIId: string;
  projectKPI: {
    id: string;
    name: string;
    status: string;
    deliverables: DeliverableT[]; // Already defined earlier
  };
};
