
export type Mission = {
  id: string;
  title: string;
  description: string;
  requiredProgress: number;
  currentProgress: number;
  points: number;
  type: 'daily' | 'weekly';
  claimed?: boolean;
  completed?: boolean;
  completedDate?: string;
  sequence?: number;
};
