export type TaskT = {
    id: string;
    description: string;
    startDate: string;  // Adjusted to match DateTime
    endDate: string;    // Adjusted to match DateTime
    timeSpent?: number;
    progressAchieved?: number;
    status: string;
    comments?: string;
    deliverableId: string;  // Added to match the relation
  };
  
  export type DeliverableT = {
    id: string;
    name: string;
    progress?: number;  // Adjusted to match Float?
    status: string;
    comments?: string;
    tasks: TaskT[];
    projectId: string;  // Added to match the relation
  };
  
  export type ProjectT = {
    id: string;
    name: string;
    status: string;
    deliverables: DeliverableT[];
    kpis?: any[];  // Added to match the KPI relation (assuming it is an array)
  };
