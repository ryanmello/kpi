export type Task = {
    description: string;
    startDate: string;
    endDate: string;
    timeSpent?: number;
    progressAchieved?: number;
    status: string;
    comments?: string;
  }
  
  export type Deliverable = {
    name: string;
    progress?: number;
    status: string;
    comments?: string;
    tasks: Task[];
  }
  
  export type Project = {
    name: string;
    deliverables: Deliverable[];
  }